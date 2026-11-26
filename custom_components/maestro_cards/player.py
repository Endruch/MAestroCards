from __future__ import annotations

from typing import Any

import voluptuous as vol

from homeassistant.auth.permissions.const import POLICY_CONTROL, POLICY_READ
from homeassistant.components import websocket_api
from homeassistant.core import HomeAssistant, callback
from homeassistant.exceptions import HomeAssistantError, Unauthorized
from homeassistant.helpers import config_validation as cv, entity_registry as er

from .const import DOMAIN


@callback
def async_register_player(hass: HomeAssistant) -> None:
    if hass.data.get(f"{DOMAIN}_player"):
        return
    hass.data[f"{DOMAIN}_player"] = True
    websocket_api.async_register_command(hass, ws_dsp_get)
    websocket_api.async_register_command(hass, ws_dsp_save)
    websocket_api.async_register_command(hass, ws_queue_get)
    websocket_api.async_register_command(hass, ws_media_info)


def _check(connection: websocket_api.ActiveConnection, entity_id: str, policy: str) -> None:
    if not connection.user.permissions.check_entity(entity_id, policy):
        raise Unauthorized(entity_id=entity_id)


def _resolve(hass: HomeAssistant, entity_id: str) -> tuple[Any, str]:
    ent = er.async_get(hass).async_get(entity_id)
    if ent is None or ent.platform != "music_assistant" or not ent.config_entry_id:
        raise HomeAssistantError(f"{entity_id} is not a Music Assistant player")
    entry = hass.config_entries.async_get_entry(ent.config_entry_id)
    mass = getattr(getattr(entry, "runtime_data", None), "mass", None)
    if mass is None:
        raise HomeAssistantError("Music Assistant is not loaded")
    return mass, ent.unique_id


def _plain(value: Any) -> Any:
    if hasattr(value, "to_dict"):
        return value.to_dict()
    return value


async def _run(connection, msg, coro) -> None:
    try:
        result = await coro
    except Unauthorized:
        connection.send_error(msg["id"], websocket_api.ERR_UNAUTHORIZED, "Not allowed for this player")
        return
    except Exception as err:
        connection.send_error(msg["id"], "music_assistant_error", str(err))
        return
    connection.send_result(msg["id"], _plain(result))


@websocket_api.websocket_command(
    {vol.Required("type"): "maestro_cards/player/dsp/get", vol.Required("entity_id"): cv.entity_id}
)
@websocket_api.async_response
async def ws_dsp_get(hass: HomeAssistant, connection, msg: dict[str, Any]) -> None:

    async def _do():
        _check(connection, msg["entity_id"], POLICY_READ)
        mass, player_id = _resolve(hass, msg["entity_id"])
        return await mass.send_command("config/players/dsp/get", player_id=player_id)

    await _run(connection, msg, _do())


@websocket_api.websocket_command(
    {
        vol.Required("type"): "maestro_cards/player/dsp/save",
        vol.Required("entity_id"): cv.entity_id,
        vol.Required("config"): dict,
    }
)
@websocket_api.async_response
async def ws_dsp_save(hass: HomeAssistant, connection, msg: dict[str, Any]) -> None:

    async def _do():
        _check(connection, msg["entity_id"], POLICY_CONTROL)
        mass, player_id = _resolve(hass, msg["entity_id"])
        return await mass.send_command("config/players/dsp/save", player_id=player_id, config=msg["config"])

    await _run(connection, msg, _do())


@websocket_api.websocket_command(
    {vol.Required("type"): "maestro_cards/player/queue/get", vol.Required("entity_id"): cv.entity_id}
)
@websocket_api.async_response
async def ws_queue_get(hass: HomeAssistant, connection, msg: dict[str, Any]) -> None:

    async def _do():
        _check(connection, msg["entity_id"], POLICY_READ)
        mass, player_id = _resolve(hass, msg["entity_id"])
        state = hass.states.get(msg["entity_id"])
        queue_id = (state.attributes.get("active_queue") if state else None) or player_id
        queue = await mass.send_command("player_queues/get", queue_id=queue_id)
        queue = _plain(queue) or {}
        return {"queue_id": queue.get("queue_id", queue_id), "is_dynamic": bool(queue.get("is_dynamic"))}

    await _run(connection, msg, _do())


def _image(item: dict | None) -> str | None:
    for img in ((item or {}).get("metadata") or {}).get("images") or []:
        if img.get("type") in ("thumb", "front", None) and img.get("path", "").startswith("http"):
            return img["path"]
    return None


async def _try(coro):
    try:
        return _plain(await coro)
    except Exception:
        return None


@websocket_api.websocket_command(
    {vol.Required("type"): "maestro_cards/player/media/info", vol.Required("entity_id"): cv.entity_id}
)
@websocket_api.async_response
async def ws_media_info(hass: HomeAssistant, connection, msg: dict[str, Any]) -> None:

    async def _do():
        _check(connection, msg["entity_id"], POLICY_READ)
        mass, _player_id = _resolve(hass, msg["entity_id"])
        state = hass.states.get(msg["entity_id"])
        uri = state.attributes.get("media_content_id") if state else None
        if not uri or "://" not in uri:
            return {"uri": uri}
        track = await _try(mass.send_command("music/item_by_uri", uri=uri)) or {}
        meta = track.get("metadata") or {}
        info: dict[str, Any] = {
            "uri": uri,
            "media_type": track.get("media_type"),
            "title": track.get("name"),
            "image": _image(track),
            "track_description": meta.get("description"),
            "genres": list(meta.get("genres") or []),
            "links": [l for l in (meta.get("links") or []) if isinstance(l, dict) and l.get("url")],
        }
        if track.get("media_type") == "track":
            lyrics = await _try(mass.send_command("metadata/get_track_lyrics", track=track))
            if isinstance(lyrics, (list, tuple)):
                info["lyrics"], info["lrc_lyrics"] = (list(lyrics) + [None, None])[:2]
            elif isinstance(lyrics, str):
                info["lyrics"] = lyrics
            info["lyrics"] = info.get("lyrics") or meta.get("lyrics")
            info["lrc_lyrics"] = info.get("lrc_lyrics") or meta.get("lrc_lyrics")
        artists = track.get("artists") or []
        if artists and artists[0].get("uri"):
            artist = await _try(mass.send_command("music/item_by_uri", uri=artists[0]["uri"])) or {}
            am = artist.get("metadata") or {}
            info["artist"] = artist.get("name") or artists[0].get("name")
            info["artist_description"] = am.get("description")
            info["artist_image"] = _image(artist)
            if not info["genres"]:
                info["genres"] = list(am.get("genres") or [])
            info["links"] = info["links"] or [l for l in (am.get("links") or []) if isinstance(l, dict) and l.get("url")]
        album_ref = track.get("album")
        if isinstance(album_ref, dict) and album_ref.get("uri"):
            album = await _try(mass.send_command("music/item_by_uri", uri=album_ref["uri"])) or {}
            alm = album.get("metadata") or {}
            info["album"] = album.get("name") or album_ref.get("name")
            info["year"] = album.get("year")
            info["album_description"] = alm.get("description")
            info["album_review"] = alm.get("review")
            info["label"] = alm.get("label")
            info["image"] = info["image"] or _image(album)
        info["genres"] = info["genres"][:8]
        info["links"] = info["links"][:6]
        return info

    await _run(connection, msg, _do())
