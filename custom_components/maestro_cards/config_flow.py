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


UNAVAILABLE = ("unavailable", "unknown")


def _name(hass: HomeAssistant, entity_id: str, fallback: str | None = None) -> str:
    state = hass.states.get(entity_id)
    return (state.attributes.get("friendly_name") if state else None) or fallback or entity_id


def _available(hass: HomeAssistant, entity_id: str) -> bool:
    state = hass.states.get(entity_id)
    return state is not None and state.state not in UNAVAILABLE


def ma_players(hass: HomeAssistant) -> list[tuple[str, str]]:
    reg = er.async_get(hass)
    found = []
    for ent in reg.entities.values():
        if ent.platform != "music_assistant" or ent.domain != "media_player" or ent.disabled_by:
            continue
        found.append((ent.entity_id, _name(hass, ent.entity_id, ent.name or ent.original_name)))
    return sorted(found, key=lambda p: (not _available(hass, p[0]), p[1].lower()))


def thermostats(hass: HomeAssistant) -> list[str]:
    return sorted(
        (s.entity_id for s in hass.states.async_all("climate")),
        key=lambda eid: (not _available(hass, eid), _name(hass, eid).lower()),
    )


def _options(hass: HomeAssistant, items: list[tuple[str, str]]) -> list[selector.SelectOptionDict]:
    return [
        selector.SelectOptionDict(value=eid, label=name if _available(hass, eid) else f"{name} (unavailable)")
        for eid, name in items
    ]


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
        climates = [(eid, _name(self.hass, eid)) for eid in thermostats(self.hass)]
        found_p = [eid for eid, _ in players]
        found_t = [eid for eid, _ in climates]
        default_p = [e for e in o.get("players", []) if e in found_p] or [e for e in found_p if _available(self.hass, e)]
        default_t = [e for e in o.get("thermostats", []) if e in found_t] or [e for e in found_t if _available(self.hass, e)]
        schema = vol.Schema(
            {
                vol.Optional("players", default=default_p): selector.SelectSelector(
                    selector.SelectSelectorConfig(options=_options(self.hass, players), multiple=True, mode=selector.SelectSelectorMode.LIST)
                ),
                vol.Optional("thermostats", default=default_t): selector.SelectSelector(
                    selector.SelectSelectorConfig(options=_options(self.hass, climates), multiple=True, mode=selector.SelectSelectorMode.LIST)
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
                "thermostats": str(len(climates)),
            },
        )

    async def async_step_power(self, user_input: dict[str, Any] | None = None) -> ConfigFlowResult:
        chosen = self._opts.get("players") or []
        players = [(eid, name) for eid, name in ma_players(self.hass) if not chosen or eid in chosen]
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
