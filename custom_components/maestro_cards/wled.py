from __future__ import annotations

import json
from typing import Any

import voluptuous as vol

from homeassistant.auth.permissions.const import POLICY_CONTROL, POLICY_READ
from homeassistant.components import websocket_api
from homeassistant.core import HomeAssistant, callback
from homeassistant.exceptions import HomeAssistantError, Unauthorized
from homeassistant.helpers import config_validation as cv, entity_registry as er

from .const import DOMAIN


@callback
def async_register_wled(hass: HomeAssistant) -> None:
    if hass.data.get(f"{DOMAIN}_wled"):
        return
    hass.data[f"{DOMAIN}_wled"] = {}
    websocket_api.async_register_command(hass, ws_info)
    websocket_api.async_register_command(hass, ws_presets)
    websocket_api.async_register_command(hass, ws_state)
    websocket_api.async_register_command(hass, ws_subscribe)


def _check(connection: websocket_api.ActiveConnection, entity_id: str, policy: str) -> None:
    if not connection.user.permissions.check_entity(entity_id, policy):
        raise Unauthorized(entity_id=entity_id)


def _coordinator(hass: HomeAssistant, entity_id: str) -> Any:
    ent = er.async_get(hass).async_get(entity_id)
    if ent is None or ent.platform != "wled" or not ent.config_entry_id:
        raise HomeAssistantError(f"{entity_id} is not a WLED entity")
    entry = hass.config_entries.async_get_entry(ent.config_entry_id)
    coordinator = getattr(entry, "runtime_data", None)
    if coordinator is None or not hasattr(coordinator, "wled"):
        raise HomeAssistantError("WLED is not loaded")
    return coordinator


def _decode(value: Any) -> Any:
    if isinstance(value, (bytes, str)):
        try:
            return json.loads(value)
        except ValueError:
            return {}
    return value


async def _get(coordinator: Any, uri: str, page: int | None = None) -> Any:
    if page is None:
        return _decode(await coordinator.wled.request(uri))
    try:
        return _decode(await coordinator.wled.request(uri, params={"page": page}))
    except TypeError:
        return _decode(await coordinator.wled.request(f"{uri}?page={page}"))


async def _palettes(hass: HomeAssistant, coordinator: Any) -> dict[str, Any]:
    cache = hass.data[f"{DOMAIN}_wled"]
    host = coordinator.wled.host
    if host in cache:
        return cache[host]
    first = await _get(coordinator, "/json/palx", 0)
    pages = int(first.get("m", 0)) if isinstance(first, dict) else 0
    result = dict(first.get("p", {})) if isinstance(first, dict) else {}
    for page in range(1, pages + 1):
        data = await _get(coordinator, "/json/palx", page)
        if isinstance(data, dict):
            result.update(data.get("p", {}))
    cache[host] = result
    return result


async def _run(connection, msg, coro) -> None:
    try:
        result = await coro
    except Unauthorized:
        connection.send_error(msg["id"], websocket_api.ERR_UNAUTHORIZED, "Not allowed for this light")
        return
    except Exception as err:
        connection.send_error(msg["id"], "wled_error", str(err))
        return
    connection.send_result(msg["id"], result)


@websocket_api.websocket_command(
    {vol.Required("type"): "maestro_cards/wled/info", vol.Required("entity_id"): cv.entity_id}
)
@websocket_api.async_response
async def ws_info(hass: HomeAssistant, connection: websocket_api.ActiveConnection, msg: dict[str, Any]) -> None:
    async def run() -> dict[str, Any]:
        _check(connection, msg["entity_id"], POLICY_READ)
        coordinator = _coordinator(hass, msg["entity_id"])
        data = await _get(coordinator, "/json")
        return {
            "state": data.get("state", {}),
            "info": data.get("info", {}),
            "effects": data.get("effects", []),
            "palettes": data.get("palettes", []),
            "palx": await _palettes(hass, coordinator),
            "presets": await _get(coordinator, "/presets.json"),
        }

    await _run(connection, msg, run())


@websocket_api.websocket_command(
    {vol.Required("type"): "maestro_cards/wled/presets", vol.Required("entity_id"): cv.entity_id}
)
@websocket_api.async_response
async def ws_presets(hass: HomeAssistant, connection: websocket_api.ActiveConnection, msg: dict[str, Any]) -> None:
    async def run() -> Any:
        _check(connection, msg["entity_id"], POLICY_READ)
        return await _get(_coordinator(hass, msg["entity_id"]), "/presets.json")

    await _run(connection, msg, run())


@websocket_api.websocket_command(
    {
        vol.Required("type"): "maestro_cards/wled/state",
        vol.Required("entity_id"): cv.entity_id,
        vol.Required("data"): dict,
    }
)
@websocket_api.async_response
async def ws_state(hass: HomeAssistant, connection: websocket_api.ActiveConnection, msg: dict[str, Any]) -> None:
    async def run() -> Any:
        _check(connection, msg["entity_id"], POLICY_CONTROL)
        coordinator = _coordinator(hass, msg["entity_id"])
        result = _decode(await coordinator.wled.request("/json/state", method="POST", data=dict(msg["data"])))
        await coordinator.async_request_refresh()
        return result

    await _run(connection, msg, run())


@websocket_api.websocket_command(
    {vol.Required("type"): "maestro_cards/wled/subscribe", vol.Required("entity_id"): cv.entity_id}
)
@websocket_api.async_response
async def ws_subscribe(hass: HomeAssistant, connection: websocket_api.ActiveConnection, msg: dict[str, Any]) -> None:
    try:
        _check(connection, msg["entity_id"], POLICY_READ)
        coordinator = _coordinator(hass, msg["entity_id"])
    except Unauthorized:
        connection.send_error(msg["id"], websocket_api.ERR_UNAUTHORIZED, "Not allowed for this light")
        return
    except HomeAssistantError as err:
        connection.send_error(msg["id"], "wled_error", str(err))
        return

    pending: dict[str, Any] = {"timer": None}

    async def push() -> None:
        try:
            state = await _get(coordinator, "/json/state")
        except Exception:
            return
        connection.send_message(websocket_api.event_message(msg["id"], {"state": state}))

    @callback
    def fire() -> None:
        pending["timer"] = None
        hass.async_create_task(push())

    @callback
    def changed() -> None:
        if pending["timer"] is None:
            pending["timer"] = hass.loop.call_later(0.3, fire)

    remove = coordinator.async_add_listener(changed)

    @callback
    def unsubscribe() -> None:
        remove()
        if pending["timer"] is not None:
            pending["timer"].cancel()

    connection.subscriptions[msg["id"]] = unsubscribe
    connection.send_result(msg["id"])
