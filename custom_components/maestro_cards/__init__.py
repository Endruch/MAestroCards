from __future__ import annotations

import logging
from pathlib import Path
from typing import Any
from urllib.parse import quote

import voluptuous as vol

from homeassistant.components import frontend, websocket_api
from homeassistant.components.http import StaticPathConfig
from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant, callback
from homeassistant.helpers import config_validation as cv
from homeassistant.helpers.typing import ConfigType

from .config_flow import ma_players, thermostats
from .const import DOMAIN
from .player import async_register_player
from .wled import async_register_wled

CONFIG_SCHEMA = cv.empty_config_schema(DOMAIN)

WWW_DIR = Path(__file__).parent / "www"
WWW_URL = f"/{DOMAIN}"
_LOGGER = logging.getLogger(__name__)
LOADER_MARK = "__maestroLoader"
LOADER_JS = (
    "window." + LOADER_MARK + "=1;(async()=>{for(let i=0;i<300;i++){const h=document.querySelector('home-assistant')?.hass;"
    "if(h&&h.connected){try{const s=await h.callWS({type:'maestro_cards/settings'});"
    "for(const u of s.modules||[])import(new URL(u,location.origin).href);return}catch(e){}}"
    "await new Promise(r=>setTimeout(r,1000))}})()"
)
LOADER_URL = "data:text/javascript;charset=utf-8," + quote(LOADER_JS, safe="")
CARDS = ("player/maestro-player.js", "thermostat/maestro-thermostat.js", "wled/maestro-wled.js", "switch/maestro-switch.js", "dimmer/maestro-dimmer.js", "sensor/maestro-sensor.js", "cover/maestro-cover.js", "nvr/maestro-nvr.js")


async def async_setup(hass: HomeAssistant, config: ConfigType) -> bool:
    await _register_frontend(hass)
    async_register_player(hass)
    async_register_wled(hass)
    return True


async def async_setup_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    await _register_frontend(hass)
    async_register_player(hass)
    async_register_wled(hass)
    await _ensure_loader(hass, True)
    return True


async def async_remove_entry(hass: HomeAssistant, entry: ConfigEntry) -> None:
    await _ensure_loader(hass, False)


def _resources(hass: HomeAssistant) -> Any:
    try:
        from homeassistant.components.lovelace.const import LOVELACE_DATA

        data = hass.data.get(LOVELACE_DATA)
    except ImportError:
        data = hass.data.get("lovelace")
    res = getattr(data, "resources", None)
    if res is None and isinstance(data, dict):
        res = data.get("resources")
    return res if hasattr(res, "async_create_item") else None


async def _ensure_loader(hass: HomeAssistant, present: bool) -> None:
    try:
        res = _resources(hass)
        if res is None:
            return
        await res.async_get_info()
        mine = [item for item in res.async_items() if LOADER_MARK in str(item.get("url", ""))]
        if present and len(mine) == 1 and mine[0].get("url") == LOADER_URL:
            return
        for item in mine:
            await res.async_delete_item(item["id"])
        if present:
            await res.async_create_item({"res_type": "module", "url": LOADER_URL})
    except Exception as err:
        _LOGGER.debug("Could not update the dashboard loader: %s", err)


async def _register_frontend(hass: HomeAssistant) -> None:
    if hass.data.get(f"{DOMAIN}_frontend"):
        return
    hass.data[f"{DOMAIN}_frontend"] = True
    websocket_api.async_register_command(hass, ws_settings)
    await hass.http.async_register_static_paths([StaticPathConfig(WWW_URL, str(WWW_DIR), False)])
    modules = []
    for name in CARDS:
        version = int(await hass.async_add_executor_job(lambda n=name: (WWW_DIR / n).stat().st_mtime))
        url = f"{WWW_URL}/{name}?v={version}"
        modules.append(url)
        frontend.add_extra_js_url(hass, url)
    hass.data[f"{DOMAIN}_modules"] = modules


async def async_unload_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    return True


@websocket_api.websocket_command({vol.Required("type"): "maestro_cards/settings"})
@callback
def ws_settings(hass: HomeAssistant, connection: websocket_api.ActiveConnection, msg: dict[str, Any]) -> None:
    entries = hass.config_entries.async_entries(DOMAIN)
    options = dict(entries[0].options) if entries else {}
    connection.send_result(
        msg["id"],
        {
            "options": options,
            "players": [eid for eid, _ in ma_players(hass)],
            "thermostats": thermostats(hass),
            "modules": hass.data.get(f"{DOMAIN}_modules", []),
        },
    )
