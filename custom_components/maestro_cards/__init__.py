from __future__ import annotations

from pathlib import Path
from typing import Any

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

CONFIG_SCHEMA = cv.empty_config_schema(DOMAIN)

WWW_DIR = Path(__file__).parent / "www"
WWW_URL = f"/{DOMAIN}"
CARDS = ("player/maestro-player.js", "thermostat/maestro-thermostat.js")


async def async_setup(hass: HomeAssistant, config: ConfigType) -> bool:
    await _register_frontend(hass)
    async_register_player(hass)
    return True


async def async_setup_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    await _register_frontend(hass)
    async_register_player(hass)
    return True


async def _register_frontend(hass: HomeAssistant) -> None:
    if hass.data.get(f"{DOMAIN}_frontend"):
        return
    hass.data[f"{DOMAIN}_frontend"] = True
    websocket_api.async_register_command(hass, ws_settings)
    await hass.http.async_register_static_paths([StaticPathConfig(WWW_URL, str(WWW_DIR), False)])
    for name in CARDS:
        version = int(await hass.async_add_executor_job(lambda n=name: (WWW_DIR / n).stat().st_mtime))
        frontend.add_extra_js_url(hass, f"{WWW_URL}/{name}?v={version}")


async def async_unload_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    return True


@websocket_api.websocket_command({vol.Required("type"): "maestro_cards/settings"})
@callback
def ws_settings(hass: HomeAssistant, connection: websocket_api.ActiveConnection, msg: dict[str, Any]) -> None:
    entries = hass.config_entries.async_entries(DOMAIN)
    options = dict(entries[0].options) if entries else {}
    connection.send_result(
        msg["id"],
        {"options": options, "players": [eid for eid, _ in ma_players(hass)], "thermostats": thermostats(hass)},
    )
