import { P, svg, clamp, esc, STYLE, THEME_NAMES, THEME_LABELS, resolveTheme, openPopup, withAlpha, loadSettings, withSettings } from '../core/maestro-core.js?v=1.5.3';

const TP = {
  heat: 'M17.66 11.2C17.43 10.9 17.15 10.64 16.89 10.38C16.22 9.78 15.46 9.35 14.82 8.72C13.33 7.26 13 4.85 13.95 3C13 3.23 12.17 3.75 11.46 4.32C8.87 6.4 7.85 10.07 9.07 13.22C9.11 13.32 9.15 13.42 9.15 13.55C9.15 13.77 9 13.97 8.8 14.05C8.57 14.15 8.33 14.09 8.14 13.93C8.08 13.88 8.04 13.83 8 13.76C6.87 12.33 6.69 10.28 7.45 8.64C5.78 10 4.87 12.3 5 14.47C5.06 14.97 5.12 15.47 5.29 15.97C5.43 16.57 5.7 17.17 6 17.7C7.08 19.43 8.95 20.67 10.96 20.92C13.1 21.19 15.39 20.8 17.03 19.32C18.86 17.66 19.5 15 18.56 12.72L18.43 12.46C18.22 12 17.66 11.2 17.66 11.2M14.5 17.5C14.22 17.74 13.76 18 13.4 18.1C12.28 18.5 11.16 17.94 10.5 17.28C11.69 17 12.4 16.12 12.61 15.23C12.78 14.43 12.46 13.77 12.33 13C12.21 12.26 12.23 11.63 12.5 10.94C12.69 11.32 12.89 11.7 13.13 12C13.9 13 15.11 13.44 15.37 14.8C15.41 14.94 15.43 15.08 15.43 15.23C15.46 16.05 15.1 16.95 14.5 17.5H14.5Z',
  cool: 'M20.79,13.95L18.46,14.57L16.46,13.44V10.56L18.46,9.43L20.79,10.05L21.31,8.12L19.54,7.65L20,5.88L18.07,5.36L17.45,7.69L15.45,8.82L13,7.38V5.12L14.71,3.41L13.29,2L12,3.29L10.71,2L9.29,3.41L11,5.12V7.38L8.5,8.82L6.5,7.69L5.92,5.36L4,5.88L4.47,7.65L2.7,8.12L3.22,10.05L5.55,9.43L7.55,10.56V13.45L5.55,14.58L3.22,13.96L2.7,15.89L4.47,16.36L4,18.12L5.93,18.64L6.55,16.31L8.55,15.18L11,16.62V18.88L9.29,20.59L10.71,22L12,20.71L13.29,22L14.7,20.59L13,18.88V16.62L15.5,15.17L17.5,16.3L18.12,18.63L20,18.12L19.53,16.35L21.3,15.88L20.79,13.95M9.5,10.56L12,9.11L14.5,10.56V13.44L12,14.89L9.5,13.44V10.56Z',
  fan: 'M12,11A1,1 0 0,0 11,12A1,1 0 0,0 12,13A1,1 0 0,0 13,12A1,1 0 0,0 12,11M12.5,2C17,2 17.11,5.57 14.75,6.75C13.76,7.24 13.32,8.29 13.13,9.22C13.61,9.42 14.03,9.73 14.35,10.13C18.05,8.13 22.03,8.92 22.03,12.5C22.03,17 18.46,17.1 17.28,14.73C16.78,13.74 15.72,13.3 14.79,13.11C14.59,13.59 14.28,14 13.88,14.34C15.87,18.03 15.08,22 11.5,22C7,22 6.91,18.42 9.27,17.24C10.25,16.75 10.69,15.71 10.89,14.79C10.4,14.59 9.97,14.27 9.65,13.87C5.96,15.85 2,15.07 2,11.5C2,7 5.56,6.89 6.74,9.26C7.24,10.25 8.29,10.68 9.22,10.87C9.41,10.39 9.73,9.97 10.14,9.65C8.15,5.96 8.94,2 12.5,2Z',
  auto: 'M12,6V9L16,5L12,1V4A8,8 0 0,0 4,12C4,13.57 4.46,15.03 5.24,16.26L6.7,14.8C6.25,13.97 6,13 6,12A6,6 0 0,1 12,6M18.76,7.74L17.3,9.2C17.74,10.04 18,11 18,12A6,6 0 0,1 12,18V15L8,19L12,23V20A8,8 0 0,0 20,12C20,10.43 19.54,8.97 18.76,7.74Z',
  drop: 'M12,20A6,6 0 0,1 6,14C6,10 12,3.25 12,3.25C12,3.25 18,10 18,14A6,6 0 0,1 12,20Z',
  home: 'M12 5.69L17 10.19V18H15V12H9V18H7V10.19L12 5.69M12 3L2 12H5V20H11V14H13V20H19V12H22L12 3Z',
  thermo: 'M15 13V5A3 3 0 0 0 9 5V13A5 5 0 1 0 15 13M12 4A1 1 0 0 1 13 5V8H11V5A1 1 0 0 1 12 4Z',
  minus: 'M19,13H5V11H19V13Z',
  plus: 'M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z',
  off: 'M16.56,5.44L15.11,6.89C16.84,7.94 18,9.83 18,12A6,6 0 0,1 12,18A6,6 0 0,1 6,12C6,9.83 7.16,7.94 8.88,6.88L7.44,5.44C5.36,6.88 4,9.28 4,12A8,8 0 0,0 12,20A8,8 0 0,0 20,12C20,9.28 18.64,6.88 16.56,5.44M13,3H11V13H13',
};

const THERMOS_SVG = '<svg viewBox="0 0 24 24"><path transform="translate(-4.5 1) scale(.8)" d="M15 13V5A3 3 0 0 0 9 5V13A5 5 0 1 0 15 13M12 4A1 1 0 0 1 13 5V8H11V5A1 1 0 0 1 12 4Z"/><path transform="translate(7.5 1) scale(.8)" d="M15 13V5A3 3 0 0 0 9 5V13A5 5 0 1 0 15 13M12 4A1 1 0 0 1 13 5V8H11V5A1 1 0 0 1 12 4Z"/></svg>';

const MODE_INFO = {
  off: { label: 'Off', icon: TP.off, color: '#9aa0aa' },
  heat: { label: 'Heat', icon: TP.heat, color: '#ff8a3d' },
  cool: { label: 'Cool', icon: TP.cool, color: '#3da5ff' },
  heat_cool: { label: 'Heat / Cool', icon: TP.auto, color: '#a37bff' },
  auto: { label: 'Auto', icon: TP.auto, color: '#a37bff' },
  fan_only: { label: 'Fan', icon: TP.fan, color: '#4fd1c5' },
  dry: { label: 'Dry', icon: TP.drop, color: '#e0c341' },
};

const modeInfo = (m) => MODE_INFO[m] || { label: String(m || '').replace(/_/g, ' '), icon: TP.auto, color: '#a37bff' };

const T_STYLE = `
ha-card.thermo{min-height:0}
.t-content{flex-direction:row;align-items:stretch;padding:16px 0;min-height:176px;box-sizing:border-box}
.t-left{flex:none;width:var(--t-left,210px);display:flex;flex-direction:column;justify-content:center;align-items:center;text-align:center;box-sizing:border-box;padding:0 12px}
.t-big{display:flex;align-items:flex-start;justify-content:center;line-height:1;font-weight:700;letter-spacing:-.02em}
.t-num{font-size:64px;font-variant-numeric:tabular-nums}
.t-unit{font-size:26px;font-weight:500;opacity:.85;margin:6px 0 0 4px}
.t-label{font-size:12px;opacity:.6;margin:4px 0 10px;height:15px;text-transform:uppercase;letter-spacing:.08em;transition:color .2s}
.t-label.set{opacity:1;color:var(--t-mode,var(--mmp-accent))}
.t-btns{display:flex;gap:22px;justify-content:center}
.tbtn{display:grid;place-items:center;width:44px;height:44px;border-radius:50%;border:0;padding:0;cursor:pointer;color:inherit;background:none;transition:background .15s,transform .1s}
.tbtn:hover{background:rgba(var(--mmp-fg-rgb),.12)}
.tbtn:active{transform:scale(.9)}
.tbtn svg{width:26px;height:26px;fill:currentColor}
.t-sep{flex:none;width:1px;background:linear-gradient(transparent,rgba(var(--mmp-fg-rgb),.3) 15%,rgba(var(--mmp-fg-rgb),.3) 85%,transparent)}
.t-right{flex:1;min-width:0;display:flex;flex-direction:column;padding:0 22px}
.t-stats{display:flex;align-items:center;gap:14px;height:34px;font-size:22px;font-weight:500;opacity:.9;padding-right:100px;white-space:nowrap}
.t-stat{display:flex;align-items:center;gap:6px;border:0;background:none;color:inherit;font:inherit;padding:2px 10px 2px 2px;border-radius:999px;cursor:pointer;transition:background .15s}
.t-stat:hover{background:rgba(var(--mmp-fg-rgb),.08)}
.t-ico{width:32px;height:32px;border-radius:50%;display:grid;place-items:center;transition:background .15s,box-shadow .15s}
.t-stat svg{width:21px;height:21px;fill:currentColor;opacity:.85}
.t-stat.hum svg{fill:#5aa9ff;opacity:1}
.t-stat.on .t-ico{background:rgba(var(--mmp-fg-rgb),.16);box-shadow:0 0 0 1.5px rgba(var(--mmp-fg-rgb),.55)}
.t-sdiv{width:1px;height:24px;background:rgba(var(--mmp-fg-rgb),.25)}
.t-graph{position:relative;flex:1;min-height:90px;margin-top:6px}
.t-graph canvas{position:absolute;inset:0;width:100%;height:100%}
.t-empty{position:absolute;inset:0;display:grid;place-items:center;font-size:12px;opacity:.5}
.t-tr{position:absolute;z-index:6;top:14px;right:18px;display:flex;align-items:center;gap:2px}
.t-tr .divider{margin:0 6px}
.t-tr .power{position:static}
.t-power.on,.theme-light .t-power.on{color:var(--t-mode);filter:drop-shadow(0 0 6px var(--t-mode))}
.panel.open~.t-tr{opacity:0;pointer-events:none}
.off .t-tr #roomsBtn,.off .t-tr .divider{filter:blur(6px);opacity:.4;pointer-events:none}
.t-offtemp{position:absolute;inset:0;z-index:4;display:none;align-items:center;justify-content:center;pointer-events:none}
.off .t-offtemp{display:flex}
.off .t-offtemp .t-num{text-shadow:0 2px 14px rgba(0,0,0,.35)}
.modes{flex:1;display:flex;flex-direction:column;justify-content:center;gap:12px;padding:14px 18px}
.mode-row{display:flex;flex-wrap:wrap;gap:10px;justify-content:center}
.mode{display:flex;flex-direction:column;align-items:center;gap:6px;width:78px;padding:10px 0;border-radius:16px;border:1px solid rgba(var(--mmp-fg-rgb),.15);
  background:rgba(var(--mmp-fg-rgb),.06);color:inherit;font:inherit;font-size:12px;cursor:pointer;transition:background .15s,border-color .15s}
.mode svg{width:26px;height:26px;fill:var(--c)}
.mode:hover{background:rgba(var(--mmp-fg-rgb),.12)}
.mode.on{border-color:var(--c);background:color-mix(in srgb,var(--c) 22%,transparent)}
.fan-row{display:flex;gap:6px;justify-content:center;flex-wrap:wrap;font-size:12px;align-items:center}
.fan-row span{opacity:.6;margin-right:4px}
.troom{display:flex;align-items:center;gap:8px;padding:4px 12px 4px 10px;min-height:42px}
.tmodes+.troom,.troom+.tmodes+.troom{border-top:1px solid rgba(var(--mmp-fg-rgb),.07)}
.troom .tn{flex:1;min-width:0;font-size:14px;font-weight:500;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.troom .tc{font-size:13px;opacity:.7;width:52px;text-align:right;font-variant-numeric:tabular-nums}
.troom .tt{font-size:15px;font-weight:600;width:56px;text-align:center;font-variant-numeric:tabular-nums}
.troom .btn.xs.mini{background:rgba(var(--mmp-fg-rgb),.08)}
.troom .tpw.on{color:var(--c);filter:drop-shadow(0 0 4px var(--c))}
.tmodes{display:flex;flex-wrap:wrap;gap:6px;justify-content:flex-end;padding:0 12px 8px 10px}
.tmode{display:flex;align-items:center;gap:5px;padding:4px 10px;border-radius:999px;border:1px solid rgba(var(--mmp-fg-rgb),.16);background:rgba(var(--mmp-fg-rgb),.06);color:inherit;font:inherit;font-size:12px;cursor:pointer}
.tmode svg{width:14px;height:14px;fill:var(--c)}
.tmode.on{border-color:var(--c);background:var(--cb)}
.troom.off .tn,.troom.off .tt,.troom.off .tc{opacity:.4}
.troom.off .mini{opacity:.3;pointer-events:none}
@container (max-width:560px){
  .t-num{font-size:50px}
  .t-left{--t-left:156px}
  .t-unit{font-size:22px}
  .t-right{padding:0 18px}
  .t-stats{font-size:16px;gap:6px;padding-right:92px}
  .t-stat{gap:4px;padding-right:6px}
  .t-ico{width:28px;height:28px}
  .t-stat svg{width:18px;height:18px}
}
@container (max-width:420px){
  .t-content{flex-direction:column;padding:14px}
  .t-left{width:auto;padding:0 0 8px}
  .t-sep{display:none}
  .t-right{padding:0}
  .t-stats{padding-right:0;justify-content:center}
}
`;

const MODE_THEME = { heat: 'm_heat', cool: 'm_cool', heat_cool: 'm_auto', auto: 'm_auto' };

const themeFor = (c, mode) => (!c.theme || c.theme === 'auto' ? MODE_THEME[mode] || 'm_grey' : c.theme);

const isF = (u) => /F/i.test(u || '');

const convT = (v, from, to) => (v == null || Number.isNaN(+v) || isF(from) === isF(to) ? v : isF(to) ? +v * 9 / 5 + 32 : (+v - 32) * 5 / 9);

const haUnit = (hass) => hass?.config?.unit_system?.temperature || '°C';

const dispUnit = (hass, c) => (c.unit === 'C' ? '°C' : c.unit === 'F' ? '°F' : haUnit(hass));

function thermoModel(hass, c) {
  const m = thermoModelRaw(hass, c);
  const from = m.targetUnit || haUnit(hass), to = dispUnit(hass, c);
  const cv = (v) => (v == null ? v : Math.round(convT(v, from, to) * 10) / 10);
  const tg = {};
  for (const k of Object.keys(m.target || {})) tg[k] = cv(m.target[k]);
  const conv = isF(from) !== isF(to);
  return { ...m, cur: m.curRaw != null ? Math.round(convT(m.curRaw, m.curUnit || from, to) * 10) / 10 : null, target: tg,
    min: cv(m.min), max: cv(m.max), step: conv ? (isF(to) ? 1 : 0.5) : m.step, unit: to };
}

function thermoModelRaw(hass, c) {
  const S = (id) => (id ? hass?.states?.[id] : undefined);
  const num = (id) => { const v = parseFloat(S(id)?.state); return Number.isNaN(v) ? null : v; };
  const unit = haUnit(hass);
  const allowed = Array.isArray(c.modes) && c.modes.length ? c.modes : null;
  const keep = (m) => m === 'off' || !allowed || allowed.includes(m) || (m === 'auto' && allowed.includes('heat_cool'));
  if (c.source === 'custom') {
    const ent = { heat: c.heat_entity, cool: c.cool_entity, fan_only: c.fan_entity };
    const isOn = (id) => !!id && !['off', 'unavailable', 'unknown', 'idle', 'standby'].includes(S(id)?.state ?? 'off');
    const mode = Object.keys(ent).find((k) => isOn(ent[k])) || 'off';
    const tgt = S(c.target_entity);
    const t = tgt ? parseFloat(tgt.state) : NaN;
    return {
      ok: !!S(c.temperature_entity) || !!tgt || Object.values(ent).some((id) => S(id)),
      name: c.name || S(c.temperature_entity)?.attributes.friendly_name || 'Thermostat',
      mode, modes: ['off', ...Object.keys(ent).filter((k) => ent[k])].filter(keep),
      curRaw: num(c.temperature_entity), curUnit: S(c.temperature_entity)?.attributes.unit_of_measurement, hum: num(c.humidity_entity),
      target: Number.isNaN(t) ? {} : { t }, targetUnit: tgt?.attributes.unit_of_measurement,
      step: +tgt?.attributes.step || 0.5, min: tgt?.attributes.min ?? 5, max: tgt?.attributes.max ?? 35,
      action: mode === 'off' ? null : { heat: 'heating', cool: 'cooling', fan_only: 'fan' }[mode],
      fanModes: [], fanMode: null, unit,
    };
  }
  const st = S(c.entity);
  if (!st) return { ok: false, unit, modes: [], target: {} };
  const a = st.attributes;
  const sensorCur = c.temperature_entity ? num(c.temperature_entity) : null;
  const cur = sensorCur ?? a.current_temperature;
  const curUnit = sensorCur != null ? S(c.temperature_entity)?.attributes.unit_of_measurement : unit;
  const hum = (c.humidity_entity && num(c.humidity_entity)) ?? a.current_humidity ?? null;
  const target = a.temperature != null ? { t: +a.temperature }
    : (a.target_temp_low != null || a.target_temp_high != null) ? { low: +a.target_temp_low, high: +a.target_temp_high } : {};
  const vf = virtualFan(a);
  const modes = [...(a.hvac_modes || ['off', 'heat', 'cool']), ...(vf ? ['fan_only'] : [])].filter(keep);
  const mode = vf && st.state === 'off' && a.fan_mode === 'on' ? 'fan_only' : st.state;
  const fanModes = vf && (a.fan_modes || []).every((f) => FAN_ONLY_SPEEDS.includes(f)) ? [] : (a.fan_modes || []);
  return {
    ok: true, name: c.name || a.friendly_name, mode, modes,
    curRaw: cur, curUnit, hum, target, step: +a.target_temp_step || (unit.includes('F') ? 1 : 0.5), min: a.min_temp ?? 5, max: a.max_temp ?? 35,
    action: mode === 'fan_only' && a.hvac_action === 'off' ? 'fan' : a.hvac_action, fanModes, fanMode: a.fan_mode, unit,
  };
}

const FAN_ONLY_SPEEDS = ['on', 'off', 'auto'];

function virtualFan(a) {
  const modes = a.hvac_modes || [];
  const fans = a.fan_modes || [];
  return !modes.includes('fan_only') && fans.includes('on');
}

function thermoSetMode(hass, c, mode) {
  if (c.source === 'custom') {
    const ent = { heat: c.heat_entity, cool: c.cool_entity, fan_only: c.fan_entity };
    for (const [m, id] of Object.entries(ent)) {
      if (id && m !== mode) hass.callService('homeassistant', 'turn_off', { entity_id: id });
    }
    if (ent[mode]) hass.callService('homeassistant', 'turn_on', { entity_id: ent[mode] });
    return;
  }
  const st = hass.states[c.entity];
  const a = st?.attributes || {};
  if (virtualFan(a)) return fanModeSwitch(hass, c.entity, st, mode);
  hass.callService('climate', 'set_hvac_mode', { entity_id: c.entity, hvac_mode: mode });
}

async function fanModeSwitch(hass, entity, st, mode) {
  const a = st.attributes;
  const fanOff = (a.fan_modes || []).includes('auto') ? 'auto' : 'off';
  const via = ['cool', 'heat_cool', 'heat'].find((m) => (a.hvac_modes || []).includes(m)) || 'heat';
  const hvac = (m) => hass.callService('climate', 'set_hvac_mode', { entity_id: entity, hvac_mode: m });
  const fan = (f) => hass.callService('climate', 'set_fan_mode', { entity_id: entity, fan_mode: f });
  const fanOn = st.state === 'off' && a.fan_mode === 'on';
  if (mode === 'fan_only') {
    if (st.state === 'off') await hvac(via);
    await fan('on');
    await hvac('off');
    return;
  }
  if (mode === 'off') {
    if (fanOn) { await hvac(via); await fan(fanOff); }
    await hvac('off');
    return;
  }
  await hvac(mode);
  if (a.fan_mode === 'on') await fan(fanOff);
}

function thermoSetTarget(hass, c, tgDisp) {
  const from = dispUnit(hass, c);
  const to = c.source === 'custom' ? (hass.states[c.target_entity]?.attributes.unit_of_measurement || haUnit(hass)) : haUnit(hass);
  const back = (v) => (v == null ? v : Math.round(convT(v, from, to) * 10) / 10);
  const tg = {};
  for (const k of Object.keys(tgDisp)) tg[k] = back(tgDisp[k]);
  if (c.source === 'custom') {
    if (!c.target_entity || tg.t == null) return;
    hass.callService(c.target_entity.startsWith('number.') ? 'number' : 'input_number', 'set_value', { entity_id: c.target_entity, value: tg.t });
    return;
  }
  hass.callService('climate', 'set_temperature', tg.t != null
    ? { entity_id: c.entity, temperature: tg.t }
    : { entity_id: c.entity, target_temp_low: tg.low, target_temp_high: tg.high });
}

const fmtT = (v) => (v == null || Number.isNaN(+v) ? '--' : (Math.round(+v * 10) / 10).toFixed(1));

const targetText = (tg) => (tg.t != null ? fmtT(tg.t) : tg.low != null || tg.high != null ? `${fmtT(tg.low)}–${fmtT(tg.high)}` : '--');

class MaestroThermostatCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._panel = null;
    this._hist = { temp: [], hum: [] };
    this._metric = 'temp';
  }

  _setMetric(m) {
    if (this._metric === m) return;
    this._metric = m;
    this._els.tgBox.classList.toggle('on', m === 'temp');
    this._els.humBox.classList.toggle('on', m === 'hum');
    this._drawGraph();
  }

  static getConfigElement() { return document.createElement('maestro-thermostat-editor'); }
  static getStubConfig(hass) {
    const ids = Object.keys(hass?.states || {}).filter((id) => id.startsWith('climate.'));
    return { entity: ids.find((id) => !['unavailable', 'unknown'].includes(hass.states[id].state)) || ids[0] || 'climate.thermostat' };
  }

  setConfig(config) {
    if (config?.source === 'custom') {
      if (!config.temperature_entity) throw new Error('Custom thermostat: please set "temperature_entity"');
    } else if (!config?.entity) throw new Error('Please define "entity" (a climate entity)');
    this._raw = config;
    this._configure();
  }

  _configure() {
    this._config = { hours: 24, show_multiroom: true, ...withSettings(this._raw, this._settings, 'thermostat') };
    this._themeKey = null;
    this._build();
    if (this._hass) this._update();
  }

  set hass(h) {
    this._hass = h;
    if (!this._settingsReq) {
      this._settingsReq = loadSettings(h).then((st) => { if (st) { this._settings = st; this._configure(); } });
    }
    if (!this._els) return;
    this._update();
    if (this._panel === 'rooms') this._updateRooms();
    if (Date.now() - (this._histAt || 0) > 10 * 60 * 1000) this._loadHistory();
  }

  getCardSize() { return 3; }
  getGridOptions() { return { columns: 'full', rows: 'auto', min_columns: 12, min_rows: 3 }; }
  connectedCallback() { this._observe(); }
  disconnectedCallback() { this._ro?.disconnect(); this._watchOutside(false); }

  _observe() {
    this._ro?.disconnect();
    if (!this.isConnected || !this._els) return;
    this._ro = new ResizeObserver(() => this._drawGraph());
    this._ro.observe(this._els.graph);
  }

  _state(id) { return this._hass?.states?.[id]; }
  _model() { return thermoModel(this._hass, this._config); }

  _build() {
    const c = this._config;
    this.shadowRoot.innerHTML = `
      <style>${STYLE}${T_STYLE}</style>
      <ha-card id="card" class="thermo">
        <div class="bg"></div><div class="shade"></div>
        <div class="content t-content">
          <div class="t-left">
            <div class="t-big"><span class="t-num" id="val">--</span><span class="t-unit" id="unit"></span></div>
            <div class="t-label" id="label">Room</div>
            <div class="t-btns" id="btns">
              <button class="tbtn" id="minus">${svg(TP.minus)}</button>
              <button class="tbtn" id="plus">${svg(TP.plus)}</button>
            </div>
          </div>
          <div class="t-sep"></div>
          <div class="t-right">
            <div class="t-stats">
              <button class="t-stat on" id="tgBox" title="Target · room temperature graph"><span class="t-ico">${svg(TP.home)}</span><span id="target">--</span></button>
              <span class="t-sdiv" id="sdiv"></span>
              <button class="t-stat hum" id="humBox" title="Humidity graph"><span class="t-ico">${svg(TP.drop)}</span><span id="hum">--</span></button>
            </div>
            <div class="t-graph"><canvas id="graph"></canvas><div class="t-empty" id="empty" hidden>No history yet</div></div>
          </div>
        </div>
        <div class="t-offtemp"><div class="t-big"><span class="t-num" id="offVal">--</span><span class="t-unit" id="offUnit"></span></div></div>
        <div class="panel" id="panel"></div>
        <div class="t-tr">
          ${c.show_multiroom ? `<button class="btn sm" id="roomsBtn">${THERMOS_SVG}</button><span class="divider"></span>` : ''}
          <button class="btn sm power t-power" id="powerBtn">${svg(P.power)}</button>
        </div>
      </ha-card>`;
    const $ = (id) => this.shadowRoot.getElementById(id);
    this._els = {
      card: $('card'), val: $('val'), unit: $('unit'), label: $('label'), btns: $('btns'), hum: $('hum'), humBox: $('humBox'), sdiv: $('sdiv'),
      tgBox: $('tgBox'), target: $('target'), graph: $('graph'), empty: $('empty'), offVal: $('offVal'), offUnit: $('offUnit'),
      power: $('powerBtn'), rooms: $('roomsBtn'), panel: $('panel'),
    };
    $('minus').onclick = () => this._adjust(-1);
    $('plus').onclick = () => this._adjust(1);
    this._els.power.onclick = () => this._togglePanel('modes');
    this._els.tgBox.onclick = () => this._setMetric('temp');
    this._els.humBox.onclick = () => this._setMetric('hum');
    if (this._els.rooms) this._els.rooms.onclick = () => this._togglePanel('rooms');
    this._observe();
    this._histAt = 0;
  }

  _applyTheme(mode) {
    const key = themeFor(this._config, mode);
    if (key === this._themeKey) return;
    this._themeKey = key;
    const th = resolveTheme({ ...this._config, theme: key, artwork: false });
    this._theme = th;
    const card = this._els.card;
    card.style.cssText = `--mmp-blur:0px;${th.vars}`;
    card.classList.toggle('glass', th.glass);
    card.className = card.className.replace(/\btheme-\S+/g, '').trim() + ` theme-${th.name}`;
    this._drawGraph();
  }

  _update() {
    const m = this._model();
    const e = this._els;
    if (!m.ok) { e.val.textContent = '--'; e.label.textContent = 'Entity not found'; return; }
    const off = m.mode === 'off' || m.mode === 'unavailable';
    const mi = modeInfo(m.mode);
    this._applyTheme(m.mode);
    e.card.classList.toggle('off', off);
    e.card.style.setProperty('--t-mode', mi.color);
    e.power.classList.toggle('on', !off);
    e.power.title = `${m.name || ''} · ${mi.label}`;
    e.unit.textContent = m.unit; e.offUnit.textContent = m.unit;
    const tg = this._pending || m.target;
    const hasTarget = m.mode !== 'fan_only' && (tg.t != null || tg.low != null || tg.high != null);
    e.btns.hidden = !hasTarget;
    e.tgBox.hidden = !hasTarget;
    if (this._showTarget && hasTarget) {
      e.val.textContent = tg.t != null ? fmtT(tg.t) : targetText(tg);
      e.label.textContent = 'Target';
      e.label.classList.add('set');
    } else {
      e.val.textContent = fmtT(m.cur);
      e.label.textContent = m.action && m.action !== 'off' && m.action !== 'idle' ? `Room · ${String(m.action).replace(/_/g, ' ')}` : 'Room';
      e.label.classList.remove('set');
    }
    e.offVal.textContent = fmtT(m.cur);
    e.target.textContent = `${targetText(tg)}${m.unit}`;
    e.humBox.hidden = m.hum == null; e.sdiv.hidden = m.hum == null || !hasTarget;
    e.hum.textContent = m.hum == null ? '' : `${Math.round(m.hum)}%`;
    if (m.hum == null && this._metric === 'hum') this._setMetric('temp');
    e.tgBox.classList.toggle('on', this._metric === 'temp');
    let changed = false;
    for (const [k, v] of [['temp', m.cur], ['hum', m.hum]]) {
      const arr = this._hist[k];
      if (arr.length && v != null && Date.now() - arr[arr.length - 1].t > 60000) { arr.push({ t: Date.now(), v: +v }); changed = true; }
    }
    if (changed) this._drawGraph();
  }

  _adjust(dir) {
    const m = this._model();
    if (!m.ok || m.mode === 'off') return;
    const cur = this._pending || m.target;
    const r = (v) => { const snapped = Math.round((v + dir * m.step) / m.step) * m.step; return Math.round(clamp(snapped, m.min, m.max) * 10) / 10; };
    this._pending = cur.t != null ? { t: r(cur.t) } : (cur.low != null ? { low: r(cur.low), high: r(cur.high) } : null);
    if (!this._pending) return;
    this._showTarget = true;
    this._update();
    clearTimeout(this._sendT);
    this._sendT = setTimeout(() => { if (this._pending) thermoSetTarget(this._hass, this._config, this._pending); }, 700);
    clearTimeout(this._showT);
    this._showT = setTimeout(() => { this._showTarget = false; this._pending = null; this._update(); }, 2500);
  }

  async _fetchSeries(id, attr) {
    const hours = Math.max(1, Number(this._config.hours) || 24);
    const res = await this._hass.callWS({
      type: 'history/history_during_period',
      start_time: new Date(Date.now() - hours * 3600 * 1000).toISOString(),
      entity_ids: [id], minimal_response: !attr, no_attributes: !attr, significant_changes_only: false,
    });
    let lastAttr = null;
    return (res?.[id] || []).map((r) => {
      const t = r.lu ? r.lu * 1000 : Date.parse(r.last_updated || r.last_changed);
      let v;
      if (!attr) v = parseFloat(r.s ?? r.state);
      else { const at = r.a || r.attributes || lastAttr; lastAttr = at; v = at ? parseFloat(at[attr]) : NaN; }
      return { t, v };
    }).filter((p) => Number.isFinite(p.v) && Number.isFinite(p.t));
  }

  async _loadHistory() {
    if (!this._hass) return;
    this._histAt = Date.now();
    const c = this._config;
    const m = this._model();
    const to = dispUnit(this._hass, c);
    try {
      const sensor = c.temperature_entity;
      const temp = sensor ? await this._fetchSeries(sensor) : (c.entity ? await this._fetchSeries(c.entity, 'current_temperature') : []);
      const srcUnit = sensor ? this._state(sensor)?.attributes.unit_of_measurement : haUnit(this._hass);
      this._hist.temp = temp.map((p) => ({ t: p.t, v: convT(p.v, srcUnit, to) }));
      if (m.cur != null) this._hist.temp.push({ t: Date.now(), v: +m.cur });
    } catch (_) { this._hist.temp = []; }
    try {
      const hs = c.humidity_entity;
      this._hist.hum = hs ? await this._fetchSeries(hs) : (c.source !== 'custom' && c.entity && m.hum != null ? await this._fetchSeries(c.entity, 'current_humidity') : []);
      if (m.hum != null) this._hist.hum.push({ t: Date.now(), v: +m.hum });
    } catch (_) { this._hist.hum = []; }
    this._drawGraph();
  }

  _drawGraph() {
    const cv = this._els?.graph;
    if (!cv || !this._theme) return;
    const w = cv.clientWidth, h = cv.clientHeight;
    if (!w || !h) return;
    const dpr = window.devicePixelRatio || 1;
    cv.width = Math.round(w * dpr); cv.height = Math.round(h * dpr);
    const ctx = cv.getContext('2d');
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, w, h);
    const pts = this._hist[this._metric] || [];
    this._els.empty.hidden = pts.length > 1;
    if (pts.length < 2) return;
    const hours = Math.max(1, Number(this._config.hours) || 24);
    const t1 = Date.now(), t0 = t1 - hours * 3600 * 1000;
    const buckets = Math.min(60, Math.max(12, Math.floor(w / 10)));
    const series = [];
    let lastV = pts[0].v;
    for (let b = 0; b <= buckets; b++) {
      const ts = t0 + ((t1 - t0) * b) / buckets, te = ts + (t1 - t0) / buckets;
      const inB = pts.filter((p) => p.t >= ts && p.t < te);
      if (inB.length) lastV = inB.reduce((s, p) => s + p.v, 0) / inB.length;
      else { const before = pts.filter((p) => p.t < ts); if (before.length) lastV = before[before.length - 1].v; }
      series.push({ t: ts, v: lastV });
    }
    const vs = series.map((p) => p.v);
    let lo = Math.min(...vs), hi = Math.max(...vs);
    const minSpan = this._metric === 'hum' ? 10 : 2;
    if (hi - lo < minSpan) { const mid = (hi + lo) / 2; lo = mid - minSpan / 2; hi = mid + minSpan / 2; }
    const padTop = 10, padBot = 22;
    const xOf = (t) => ((t - t0) / (t1 - t0)) * w;
    const yOf = (v) => padTop + (1 - (v - lo) / (hi - lo)) * (h - padTop - padBot);
    const xy = series.map((p) => [xOf(p.t), yOf(p.v)]);
    const mode = this._model().mode;
    const color = this._metric === 'hum' ? '#5aa9ff' : mode && mode !== 'off' ? modeInfo(mode).color : `rgb(${this._theme.accent})`;
    const path = () => {
      ctx.moveTo(xy[0][0], xy[0][1]);
      for (let i = 0; i < xy.length - 1; i++) {
        const p0 = xy[i - 1] || xy[i], p1 = xy[i], p2 = xy[i + 1], p3 = xy[i + 2] || p2;
        ctx.bezierCurveTo(p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6, p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6, p2[0], p2[1]);
      }
    };
    const grad = ctx.createLinearGradient(0, padTop, 0, h - padBot);
    grad.addColorStop(0, withAlpha(color, 0.38));
    grad.addColorStop(1, withAlpha(color, 0));
    ctx.beginPath(); path(); ctx.lineTo(w, h - padBot); ctx.lineTo(0, h - padBot); ctx.closePath();
    ctx.fillStyle = grad; ctx.fill();
    ctx.beginPath(); path();
    ctx.strokeStyle = color; ctx.lineWidth = 2.5; ctx.lineJoin = 'round'; ctx.lineCap = 'round'; ctx.stroke();
    const fg = this._theme.fg;
    ctx.font = '12px sans-serif'; ctx.textAlign = 'center';
    for (let i = 0; i < 3; i++) {
      const t = t0 + ((t1 - t0) * (i + 0.5)) / 3;
      const d = new Date(t);
      const x = xOf(t);
      ctx.fillStyle = `rgba(${fg},.55)`;
      ctx.fillText(`${String(d.getHours()).padStart(2, '0')}:00`, x, h - 5);
      ctx.strokeStyle = `rgba(${fg},.08)`; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(Math.round(x) + 0.5, padTop); ctx.lineTo(Math.round(x) + 0.5, h - padBot); ctx.stroke();
    }
    const maxI = vs.indexOf(Math.max(...vs));
    for (const i of [maxI, xy.length - 1]) {
      const [x, y] = xy[i];
      ctx.beginPath(); ctx.arc(Math.min(x, w - 6), y, 5, 0, Math.PI * 2);
      ctx.fillStyle = this._theme.name === 'light' ? '#fff' : 'rgba(15,18,28,.92)'; ctx.fill();
      ctx.lineWidth = 2.5; ctx.strokeStyle = i === maxI ? color : `rgb(${fg})`; ctx.stroke();
    }
  }

  _watchOutside(on) {
    if (on && !this._outside) {
      this._outside = (e) => { if (this._panel && !e.composedPath().includes(this)) this._togglePanel(this._panel); };
      this._escKey = (e) => { if (e.key === 'Escape' && this._panel) this._togglePanel(this._panel); };
      document.addEventListener('pointerdown', this._outside, true);
      document.addEventListener('keydown', this._escKey);
    } else if (!on && this._outside) {
      document.removeEventListener('pointerdown', this._outside, true);
      document.removeEventListener('keydown', this._escKey);
      this._outside = null;
    }
  }

  _togglePanel(kind) {
    const p = this._els.panel;
    const close = this._panel === kind;
    this._panel = close ? null : kind;
    this._watchOutside(!!this._panel);
    p.classList.toggle('open', !close);
    if (close) return;
    p.className = `panel open p-${kind}`;
    if (kind === 'modes') this._renderModes(); else this._renderRooms();
    p.onclick = (e) => { if (e.target === p || e.target.classList.contains('modes') || e.target.classList.contains('list')) this._togglePanel(this._panel); };
  }

  _renderModes() {
    const m = this._model();
    const modes = m.modes.slice().sort((x, y) => (x === 'off' ? -1 : y === 'off' ? 1 : 0));
    this._els.panel.innerHTML = `<div class="modes">
      <div class="mode-row">${modes.map((x) => { const mi = modeInfo(x); return `<button class="mode ${x === m.mode ? 'on' : ''}" data-mode="${esc(x)}" style="--c:${mi.color}">${svg(mi.icon)}${esc(mi.label)}</button>`; }).join('')}</div>
      ${m.fanModes.length ? `<div class="fan-row"><span>Fan</span>${m.fanModes.map((f) => `<button class="tab ${f === m.fanMode ? 'on' : ''}" data-fan="${esc(f)}">${esc(String(f).replace(/_/g, ' '))}</button>`).join('')}</div>` : ''}
    </div>`;
    this._els.panel.querySelectorAll('[data-mode]').forEach((b) => { b.onclick = () => { thermoSetMode(this._hass, this._config, b.dataset.mode); this._togglePanel('modes'); }; });
    this._els.panel.querySelectorAll('[data-fan]').forEach((b) => {
      b.onclick = () => {
        this._hass.callService('climate', 'set_fan_mode', { entity_id: this._config.entity, fan_mode: b.dataset.fan });
        this._els.panel.querySelectorAll('[data-fan]').forEach((x) => x.classList.toggle('on', x === b));
      };
    });
  }

  _thermostats() {
    if (Array.isArray(this._config.thermostats) && this._config.thermostats.length) return this._config.thermostats.filter((id) => this._state(id));
    const main = this._config.entity;
    return Object.keys(this._hass.states).filter((id) => id.startsWith('climate.') && (id === main || !['unavailable', 'unknown'].includes(this._hass.states[id].state)) && !this._hass.entities?.[id]?.hidden)
      .sort((x, y) => (x === main ? -1 : y === main ? 1 : (this._state(x).attributes.friendly_name || x).localeCompare(this._state(y).attributes.friendly_name || y)));
  }

  _renderRooms() {
    const ids = this._thermostats();
    this._els.panel.innerHTML = `<div class="col"><div class="list rooms">${ids.length ? ids.map((id) => `
      <div class="troom" data-id="${esc(id)}">
        <span class="tn">${esc(this._state(id).attributes.friendly_name || id)}</span>
        <span class="tc"></span>
        <button class="btn xs mini" data-d="-1">${svg(TP.minus)}</button>
        <span class="tt"></span>
        <button class="btn xs mini" data-d="1">${svg(TP.plus)}</button>
        <button class="btn xs tpw">${svg(P.power)}</button>
      </div>
      <div class="tmodes" data-for="${esc(id)}" hidden></div>`).join('') : '<div class="msg">No other thermostats</div>'}</div></div>`;
    this._els.panel.querySelectorAll('.troom').forEach((row) => {
      const id = row.dataset.id;
      row.querySelectorAll('[data-d]').forEach((b) => {
        b.onclick = () => {
          const st = this._state(id); if (!st) return;
          const a = st.attributes; const step = +a.target_temp_step || 0.5;
          if (a.temperature == null) return;
          const v = Math.round(clamp(+a.temperature + +b.dataset.d * step, a.min_temp ?? 5, a.max_temp ?? 35) * 10) / 10;
          row.querySelector('.tt').textContent = `${fmtT(v)}°`;
          clearTimeout(row._t);
          row._t = setTimeout(() => { this._hass.callService('climate', 'set_temperature', { entity_id: id, temperature: v }); row._t = null; }, 600);
        };
      });
      row.querySelector('.tpw').onclick = () => {
        const st = this._state(id); if (!st) return;
        const box = row.nextElementSibling;
        const open = box.hidden;
        this._els.panel.querySelectorAll('.tmodes').forEach((x) => { x.hidden = true; });
        if (!open) return;
        const modes = (st.attributes.hvac_modes || ['off', 'heat', 'cool']).slice().sort((x, y) => (x === 'off' ? -1 : y === 'off' ? 1 : 0));
        box.innerHTML = modes.map((md) => { const mi = modeInfo(md); return `<button class="tmode ${md === st.state ? 'on' : ''}" data-m="${esc(md)}" style="--c:${mi.color};--cb:${withAlpha(mi.color, 0.2)}">${svg(mi.icon)}${esc(mi.label)}</button>`; }).join('');
        box.hidden = false;
        box.querySelectorAll('[data-m]').forEach((b) => {
          b.onclick = () => { thermoSetMode(this._hass, { entity: id }, b.dataset.m); box.hidden = true; };
        });
      };
    });
    this._updateRooms();
  }

  _updateRooms() {
    this._els.panel.querySelectorAll('.troom').forEach((row) => {
      const st = this._state(row.dataset.id); if (!st) return;
      const a = st.attributes; const off = st.state === 'off';
      const mi = modeInfo(st.state);
      row.classList.toggle('off', off);
      row.style.setProperty('--c', mi.color);
      row.querySelector('.tc').textContent = a.current_temperature != null ? `${fmtT(a.current_temperature)}°` : '';
      if (!row._t) row.querySelector('.tt').textContent = a.temperature != null ? `${fmtT(a.temperature)}°` : (a.target_temp_low != null ? `${fmtT(a.target_temp_low)}–${fmtT(a.target_temp_high)}` : '');
      const pw = row.querySelector('.tpw'); pw.classList.toggle('on', !off); pw.title = mi.label;
    });
    const others = this._thermostats().filter((id) => id !== this._config.entity);
    const active = others.some((id) => { const s = this._state(id); return s && s.state !== 'off' && ['heating', 'cooling', 'drying', 'fan'].includes(s.attributes.hvac_action); });
    this._els.rooms?.classList.toggle('playing', active);
  }
}

const T_BADGE_STYLE = `
:host{display:inline-block}
.b{position:relative;display:flex;align-items:center;gap:6px;height:36px;padding:0 12px 0 6px;box-sizing:border-box;border-radius:18px;cursor:pointer;
  color:var(--mmp-fg);background:var(--mmp-bg);border:1px solid rgba(var(--mmp-fg-rgb),.18);font-family:var(--ha-font-family-body,inherit);user-select:none}
.b.glass{-webkit-backdrop-filter:blur(16px) saturate(1.5);backdrop-filter:blur(16px) saturate(1.5)}
.ic{width:26px;height:26px;border-radius:50%;display:grid;place-items:center;background:rgba(255,255,255,.14)}
.ic svg{width:16px;height:16px;fill:var(--c)}
.cur{font-size:15px;font-weight:700;font-variant-numeric:tabular-nums}
.tg{font-size:12px;opacity:.65;font-variant-numeric:tabular-nums}
.off .cur,.off .tg{opacity:.55}
`;

class MaestroThermostatBadge extends HTMLElement {
  constructor() { super(); this.attachShadow({ mode: 'open' }); }
  static getConfigElement() { const e = document.createElement('maestro-thermostat-editor'); e.badge = true; return e; }
  static getStubConfig(hass) { return MaestroThermostatCard.getStubConfig(hass); }
  setConfig(c) {
    if (c?.source === 'custom' ? !c.temperature_entity : !c?.entity) throw new Error('Please define the thermostat entities');
    this._raw = c;
    this._configure();
  }

  _configure() {
    this._config = withSettings({ ...this._raw }, this._settings, 'thermostat');
    this._themeKey = null;
    this._icon = null;
    this.shadowRoot.innerHTML = `<style>${T_BADGE_STYLE}</style><div class="b" id="b"><span class="ic" id="ic"></span><span class="cur" id="cur">--</span><span class="tg" id="tg"></span></div>`;
    this._b = this.shadowRoot.getElementById('b');
    this._b.onclick = () => this._openPopup();
    if (this._hass) this._update();
  }
  set hass(h) {
    this._hass = h;
    if (!this._settingsReq) {
      this._settingsReq = loadSettings(h).then((st) => { if (st) { this._settings = st; this._configure(); } });
    }
    if (this._b) this._update();
    if (this._popup) this._popup.card.hass = h;
  }
  disconnectedCallback() { this._popup?.close(); }
  _update() {
    const m = thermoModel(this._hass, this._config);
    if (!m.ok) return;
    const mi = modeInfo(m.mode), off = m.mode === 'off';
    const key = themeFor(this._config, m.mode);
    if (key !== this._themeKey) {
      this._themeKey = key;
      const th = resolveTheme({ ...this._config, theme: key, artwork: false });
      this._b.style.cssText = th.vars;
      this._b.classList.toggle('glass', th.glass);
    }
    this._b.classList.toggle('off', off);
    this._b.style.setProperty('--c', mi.color);
    const icon = svg(off ? TP.thermo : mi.icon);
    if (this._icon !== icon) { this._icon = icon; this.shadowRoot.getElementById('ic').innerHTML = icon; }
    this.shadowRoot.getElementById('cur').textContent = `${fmtT(m.cur)}${m.unit}`;
    this.shadowRoot.getElementById('tg').textContent = off ? mi.label : (m.target.t != null || m.target.low != null ? `→ ${targetText(m.target)}°` : mi.label);
  }
  _openPopup() { openPopup(this, 'maestro-thermostat-card', this._config); }

}

const THERMO_TEXT = {
  source: 'Thermostat type', entity: 'Climate entity', name: 'Name',
  temperature_entity: 'Room temperature sensor', humidity_entity: 'Humidity sensor (optional)', target_entity: 'Target temperature (input_number / number)',
  heat_entity: 'Heating switch', cool_entity: 'Cooling switch', fan_entity: 'Fan switch',
  modes: 'Modes to show (empty = all supported)', unit: 'Temperature unit', hours: 'Graph period', show_multiroom: 'Other thermostats button', thermostats: 'Thermostats in that list (empty = all)',
  theme: 'Color scheme', custom_background: 'Background color', custom_accent: 'Accent color', custom_text: 'Text color',
  g_main: 'Thermostat', g_look: 'Appearance', g_more: 'Graph & other thermostats',
  h_temperature_entity: 'Used for the big number and the graph. For a climate entity it is optional (the thermostat\'s own reading is used).',
  h_target_entity: 'Without it the − / + buttons are hidden.',
};

const MODE_OPTIONS = [['heat', 'Heat'], ['cool', 'Cool'], ['heat_cool', 'Heat / Cool (auto)'], ['fan_only', 'Fan'], ['dry', 'Dry']];

class MaestroThermostatEditor extends HTMLElement {
  setConfig(config) { this._config = config; this._render(); }
  set hass(hass) { this._hass = hass; this._render(); }

  _schema(d) {
    const custom = d.source === 'custom';
    const ent = (name, domains, required, extra = {}) => ({ name, required, selector: { entity: { filter: [{ domain: domains, ...extra }] } } });
    const main = [
      { name: 'source', selector: { select: { mode: 'box', options: [{ value: 'climate', label: 'Climate entity (Nest, Ecobee, AC…)' }, { value: 'custom', label: 'Custom: own sensors & switches' }] } } },
      ...(custom ? [
        { name: 'name', selector: { text: {} } },
        ent('temperature_entity', 'sensor', true, { device_class: 'temperature' }),
        ent('humidity_entity', 'sensor', false, { device_class: 'humidity' }),
        ent('target_entity', ['input_number', 'number'], false),
        ent('heat_entity', ['switch', 'input_boolean', 'fan', 'light'], false),
        ent('cool_entity', ['switch', 'input_boolean', 'fan', 'light'], false),
        ent('fan_entity', ['switch', 'input_boolean', 'fan', 'light'], false),
      ] : [
        ent('entity', 'climate', true),
        ent('temperature_entity', 'sensor', false, { device_class: 'temperature' }),
        ent('humidity_entity', 'sensor', false, { device_class: 'humidity' }),
      ]),
      { name: 'modes', selector: { select: { multiple: true, mode: 'list', options: MODE_OPTIONS.map(([value, label]) => ({ value, label })) } } },
      { name: 'unit', selector: { select: { mode: 'box', options: [{ value: 'auto', label: 'Like Home Assistant' }, { value: 'C', label: '°C' }, { value: 'F', label: '°F' }] } } },
    ];
    const look = [
      { name: 'theme', selector: { select: { mode: 'dropdown', options: [{ value: 'auto', label: 'By mode (heat orange, cool blue, off grey)' }, ...THEME_NAMES.map((v) => ({ value: v, label: THEME_LABELS[v] }))] } } },
      ...(d.theme === 'custom' ? [{ type: 'grid', name: 'g_custom', flatten: true, schema: [
        { name: 'custom_background', selector: { color_rgb: {} } },
        { name: 'custom_accent', selector: { color_rgb: {} } },
        { name: 'custom_text', selector: { color_rgb: {} } },
      ] }] : []),
    ];
    const more = [
      { name: 'hours', selector: { number: { min: 1, max: 168, step: 1, mode: 'box', unit_of_measurement: 'h' } } },
      { name: 'show_multiroom', selector: { boolean: {} } },
      { name: 'thermostats', selector: { entity: { multiple: true, filter: [{ domain: 'climate' }] } } },
    ];
    return [
      ...main,
      { type: 'expandable', name: 'g_look', flatten: true, icon: 'mdi:palette', schema: look },
      ...(this.badge ? [] : [{ type: 'expandable', name: 'g_more', flatten: true, icon: 'mdi:chart-bell-curve', schema: more }]),
    ];
  }

  _render() {
    if (!this._hass || !this._config) return;
    if (!this._form) {
      this._form = document.createElement('ha-form');
      this._form.computeLabel = (s) => THERMO_TEXT[s.name] || s.name;
      this._form.computeHelper = (s) => THERMO_TEXT[`h_${s.name}`];
      this._form.addEventListener('value-changed', (e) => this._changed(e.detail.value));
      this.appendChild(this._form);
    }
    const d = { source: 'climate', theme: 'auto', hours: 24, show_multiroom: true, unit: 'auto', ...this._config };
    if (d.theme === 'custom') { d.custom_background ??= [28, 34, 51]; d.custom_accent ??= [120, 190, 255]; d.custom_text ??= [255, 255, 255]; }
    this._form.hass = this._hass;
    this._form.schema = this._schema(d);
    this._form.data = d;
  }

  _changed(v) {
    const custom = v.source === 'custom';
    const drop = new Set(custom ? ['entity'] : ['name', 'target_entity', 'heat_entity', 'cool_entity', 'fan_entity']);
    const out = { type: this._config.type };
    for (const [k, val] of Object.entries(v)) {
      if (k === 'type' || drop.has(k)) continue;
      if (val === '' || val == null || (Array.isArray(val) && !val.length)) continue;
      if ((k === 'source' && val === 'climate') || (k === 'theme' && val === 'auto') || (k === 'unit' && val === 'auto') || (k === 'hours' && val === 24) || (k === 'show_multiroom' && val === true)) continue;
      if (k.startsWith('custom_') && v.theme !== 'custom') continue;
      out[k] = val;
    }
    this._config = out;
    this.dispatchEvent(new CustomEvent('config-changed', { detail: { config: out }, bubbles: true, composed: true }));
  }
}

window.customBadges = window.customBadges || [];
window.customCards = window.customCards || [];
if (!window.customBadges.some((b) => b.type === 'maestro-thermostat-badge')) {
  window.customBadges.push({ type: 'maestro-thermostat-badge', name: 'MAestro Thermostat (badge)', description: 'Tiny pill thermostat. Works with any climate entity.', preview: true });
}
if (!customElements.get('maestro-thermostat-card')) customElements.define('maestro-thermostat-card', MaestroThermostatCard);
if (!customElements.get('maestro-thermostat-editor')) customElements.define('maestro-thermostat-editor', MaestroThermostatEditor);
if (!customElements.get('maestro-thermostat-badge')) customElements.define('maestro-thermostat-badge', MaestroThermostatBadge);
if (!window.customCards.some((c) => c.type === 'maestro-thermostat-card')) {
  window.customCards.push({ type: 'maestro-thermostat-card', name: 'MAestro Thermostat', description: 'Room temperature, target, history graph and modes. Works with any climate entity or your own sensors and switches.', preview: true });
}
