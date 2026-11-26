from __future__ import annotations

from typing import Any

import voluptuous as vol

from homeassistant.config_entries import ConfigEntry, ConfigFlow, ConfigFlowResult, OptionsFlow
from homeassistant.core import HomeAssistant, callback
from homeassistant.helpers import entity_registry as er, selector

from .const import DOMAIN

THEMES = ["blue", "dark", "light", "glass"]
THERMOSTAT_THEMES = ["auto", *THEMES]
POWER_DOMAINS = ["media_player", "switch", "input_boolean", "light"]


def ma_players(hass: HomeAssistant) -> list[tuple[str, str]]:
    reg = er.async_get(hass)
    found = []
    for ent in reg.entities.values():
        if ent.platform != "music_assistant" or ent.domain != "media_player" or ent.disabled_by:
            continue
        state = hass.states.get(ent.entity_id)
        name = (state.attributes.get("friendly_name") if state else None) or ent.name or ent.original_name or ent.entity_id
        found.append((ent.entity_id, name))
    return sorted(found, key=lambda p: p[1].lower())


def thermostats(hass: HomeAssistant) -> list[str]:
    return sorted(s.entity_id for s in hass.states.async_all("climate"))


class MaestroCardsConfigFlow(ConfigFlow, domain=DOMAIN):

    VERSION = 1

    async def async_step_user(self, user_input: dict[str, Any] | None = None) -> ConfigFlowResult:
        if user_input is not None:
            return self.async_create_entry(title="MAestro Cards", data={})
        return self.async_show_form(step_id="user")

    @staticmethod
    @callback
    def async_get_options_flow(config_entry: ConfigEntry) -> OptionsFlow:
        return MaestroCardsOptionsFlow()


class MaestroCardsOptionsFlow(OptionsFlow):

    def __init__(self) -> None:
        self._opts: dict[str, Any] = {}

    async def async_step_init(self, user_input: dict[str, Any] | None = None) -> ConfigFlowResult:
        if user_input is not None:
            self._opts = {**self.config_entry.options, **user_input}
            return await self.async_step_power()
        o = self.config_entry.options
        players = ma_players(self.hass)
        schema = vol.Schema(
            {
                vol.Optional("players", default=o.get("players", [])): selector.EntitySelector(
                    selector.EntitySelectorConfig(domain="media_player", integration="music_assistant", multiple=True)
                ),
                vol.Optional("thermostats", default=o.get("thermostats", [])): selector.EntitySelector(
                    selector.EntitySelectorConfig(domain="climate", multiple=True)
                ),
                vol.Optional("player_theme", default=o.get("player_theme", "blue")): selector.SelectSelector(
                    selector.SelectSelectorConfig(options=THEMES, translation_key="theme", mode=selector.SelectSelectorMode.DROPDOWN)
                ),
                vol.Optional("thermostat_theme", default=o.get("thermostat_theme", "auto")): selector.SelectSelector(
                    selector.SelectSelectorConfig(options=THERMOSTAT_THEMES, translation_key="theme", mode=selector.SelectSelectorMode.DROPDOWN)
                ),
            }
        )
        return self.async_show_form(
            step_id="init",
            data_schema=schema,
            description_placeholders={
                "players": str(len(players)),
                "thermostats": str(len(thermostats(self.hass))),
                "names": ", ".join(name for _, name in players) or "—",
            },
        )

    async def async_step_power(self, user_input: dict[str, Any] | None = None) -> ConfigFlowResult:
        players = ma_players(self.hass)
        if user_input is not None or not players:
            power = {eid: user_input[name] for eid, name in players if user_input and user_input.get(name)}
            return self.async_create_entry(data={**self._opts, "power": power})
        current = self.config_entry.options.get("power", {})
        schema = vol.Schema(
            {
                vol.Optional(name, description={"suggested_value": current.get(eid)}): selector.EntitySelector(
                    selector.EntitySelectorConfig(domain=POWER_DOMAINS)
                )
                for eid, name in players
            }
        )
        return self.async_show_form(step_id="power", data_schema=schema)
