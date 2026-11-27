import { esc, COLORS, COLOR_NAMES, COLOR_LABELS } from '../core/maestro-core.js?v=1.5.3';

const CHEV = '<svg viewBox="0 0 24 24"><path d="M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z"/></svg>';
const STATUS = { ok: '61,220,132', warn: '255,196,60', bad: '255,90,90' };

const BINARY_TEXT = {
  moisture: ['Leak', 'Detected', 'Dry'], smoke: ['Smoke', 'Detected', 'All clear'], gas: ['Gas', 'Detected', 'All clear'],
  carbon_monoxide: ['CO', 'Detected', 'All clear'], safety: ['Safety', 'Unsafe', 'Safe'], problem: ['Problem', 'Problem', 'OK'],
  door: ['Door', 'Open', 'Closed'], window: ['Window', 'Open', 'Closed'], garage_door: ['Garage', 'Open', 'Closed'], opening: ['Opening', 'Open', 'Closed'],
  motion: ['Motion', 'Detected', 'Clear'], occupancy: ['Occupancy', 'Detected', 'Clear'], presence: ['Presence', 'Home', 'Away'],
  vibration: ['Vibration', 'Detected', 'Clear'], tamper: ['Tamper', 'Detected', 'Clear'], battery: ['Battery', 'Low', 'Normal'],
  lock: ['Lock', 'Unlocked', 'Locked'], connectivity: ['Connection', 'Connected', 'Disconnected'], power: ['Power', 'On', 'Off'],
  plug: ['Plug', 'Plugged in', 'Unplugged'], heat: ['Heat', 'Hot', 'Normal'], cold: ['Cold', 'Cold', 'Normal'], sound: ['Sound', 'Detected', 'Clear'],
};
const DC_ICONS = {
  temperature: 'mdi:thermometer', humidity: 'mdi:water-percent', moisture: ['mdi:water-alert', 'mdi:water-check'], carbon_dioxide: 'mdi:molecule-co2',
  carbon_monoxide: ['mdi:molecule-co', 'mdi:molecule-co'], smoke: ['mdi:smoke-detector-variant-alert', 'mdi:smoke-detector-variant'], gas: ['mdi:gas-cylinder', 'mdi:gas-cylinder'],
  motion: ['mdi:motion-sensor', 'mdi:motion-sensor-off'], occupancy: ['mdi:home-account', 'mdi:home-outline'], presence: ['mdi:home', 'mdi:home-outline'],
  door: ['mdi:door-open', 'mdi:door-closed'], window: ['mdi:window-open-variant', 'mdi:window-closed-variant'], garage_door: ['mdi:garage-open', 'mdi:garage'],
  opening: ['mdi:square-outline', 'mdi:square'], illuminance: 'mdi:brightness-5', pressure: 'mdi:gauge', atmospheric_pressure: 'mdi:gauge', power: 'mdi:flash',
  energy: 'mdi:lightning-bolt', voltage: 'mdi:sine-wave', current: 'mdi:current-ac', battery: 'mdi:battery', pm25: 'mdi:blur', pm10: 'mdi:blur', volatile_organic_compounds: 'mdi:air-filter',
  aqi: 'mdi:air-filter', sound_pressure: 'mdi:ear-hearing', signal_strength: 'mdi:wifi', vibration: ['mdi:vibrate', 'mdi:crop-portrait'], problem: ['mdi:alert-circle', 'mdi:check-circle'],
  safety: ['mdi:alert-circle', 'mdi:check-circle'], tamper: ['mdi:alert-circle', 'mdi:check-circle'], connectivity: ['mdi:check-network-outline', 'mdi:close-network-outline'],
  heat: ['mdi:thermometer-alert', 'mdi:thermometer'], cold: ['mdi:snowflake-alert', 'mdi:thermometer'], lock: ['mdi:lock-open', 'mdi:lock'], plug: ['mdi:power-plug', 'mdi:power-plug-off'],
};

function iconFor(st, own) {
  if (own) return own;
  if (!st || st.attributes.icon) return null;
  const v = DC_ICONS[st.attributes.device_class];
  return Array.isArray(v) ? v[st.state === 'on' ? 0 : 1] : v || null;
}

function syncIcons(root, hass, cfg) {
  root.querySelectorAll('ha-state-icon').forEach((el) => {
    const st = hass.states[el.dataset.e];
    el.hass = hass;
    el.stateObj = st;
    const icon = iconFor(st, el.dataset.own || '');
    if (icon) el.icon = icon; else el.removeAttribute('icon');
  });
}

const ALARM_CLASSES = ['moisture', 'smoke', 'gas', 'carbon_monoxide', 'safety', 'problem', 'tamper', 'battery', 'heat', 'cold'];

const S_STYLE = `
:host{display:block;height:100%}
.c{position:relative;box-sizing:border-box;height:100%;min-height:var(--min-h,0);padding:14px 16px;border-radius:var(--ha-card-border-radius,22px);overflow:hidden;cursor:pointer;
  color:rgb(var(--fg));background:var(--bg);border:1px solid rgba(var(--fg),.2);box-shadow:0 6px 20px rgba(0,0,0,.22);
  font-family:var(--ha-font-family-body,inherit);user-select:none;-webkit-user-select:none;-webkit-tap-highlight-color:transparent;
  display:flex;flex-direction:column;transition:background .4s,border-color .4s}
.c.alarm{border-color:rgba(255,120,120,.55);box-shadow:0 0 0 1px rgba(255,90,90,.2),0 6px 24px rgba(255,60,60,.25)}
.head{display:flex;align-items:center;gap:10px;min-width:0}
.ic{flex:none;display:grid;place-items:center;width:28px;height:28px}
.ic ha-state-icon,.ic ha-icon{--mdc-icon-size:26px;color:rgb(var(--fg))}
.title{flex:1;min-width:0;font-size:16px;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.dot{flex:none;display:none;width:12px;height:12px;border-radius:50%;background:rgb(var(--st));box-shadow:0 0 8px rgba(var(--st),.8)}
.has-dot .dot{display:block}
.chev{flex:none;width:20px;height:20px;opacity:.75}
.chev svg{width:20px;height:20px;fill:currentColor}
.val{display:flex;align-items:baseline;justify-content:center;gap:6px;margin-top:6px;min-width:0;white-space:nowrap}
.num{font-size:40px;font-weight:700;line-height:1.1;font-variant-numeric:tabular-nums;letter-spacing:-.01em;text-shadow:0 2px 8px rgba(0,0,0,.25)}
.unit{font-size:20px;font-weight:600;opacity:.9}
.graph{position:relative;flex:1;min-height:44px;margin:6px -16px -14px}
.graph svg{position:absolute;inset:0;width:100%;height:100%;overflow:visible}
.duo{flex:1;display:flex;align-items:center;margin-top:8px;min-width:0;container-type:inline-size}
.part{flex:1 1 0;display:flex;align-items:center;justify-content:center;gap:6px;min-width:0;overflow:hidden}
.part .val2{display:flex;align-items:baseline;gap:2px;white-space:nowrap}
.part .ic{width:26px;height:26px}
.part .ic ha-state-icon,.part .ic ha-icon{--mdc-icon-size:26px}
.part .num{font-size:clamp(20px,9cqi,30px)}
.part .unit{font-size:clamp(13px,5cqi,18px)}
.vsep{flex:none;width:1.5px;align-self:stretch;margin:6px 4px;border-radius:1px;background:rgba(var(--fg),.4)}
.alert{flex:1;display:flex;align-items:center;gap:16px;min-width:0}
.aic{position:relative;flex:none;display:grid;place-items:center;width:52px;height:52px}
.aic ha-state-icon,.aic ha-icon{--mdc-icon-size:46px;color:rgb(var(--fg))}
.bang{position:absolute;right:0;bottom:2px;display:none;width:18px;height:18px;border-radius:50%;background:#ff5a5a;color:#fff;font-size:13px;font-weight:800;line-height:18px;text-align:center;box-shadow:0 0 8px rgba(255,90,90,.8)}
.alarm .bang{display:block}
.alert .vsep{margin:4px 0}
.atext{flex:1;min-width:0}
.at{font-size:19px;font-weight:700;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.as{font-size:16px;font-weight:600;opacity:.75;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.alarm .as{color:#ff7a7a;opacity:1}
.asub{font-size:14px;opacity:.6;margin-top:1px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.alert-l .dot{position:absolute;top:14px;right:16px}
.na .num,.na .as{opacity:.5}
`;

const num = (v) => { const n = parseFloat(v); return Number.isFinite(n) ? n : null; };

function fmt(hass, id, st, decimals) {
  const n = num(st?.state);
  if (n == null) return st ? (hass.formatEntityState ? hass.formatEntityState(st) : st.state) : '—';
  const d = decimals ?? hass.entities?.[id]?.display_precision;
  const lang = hass.locale?.language || hass.language || 'en';
  return n.toLocaleString(lang, d != null ? { minimumFractionDigits: d, maximumFractionDigits: d } : { maximumFractionDigits: Math.abs(n) >= 100 ? 0 : 1 });
}

function areaName(hass, id) {
  const ent = hass.entities?.[id];
  const area = ent?.area_id || (ent?.device_id && hass.devices?.[ent.device_id]?.area_id);
  return area ? hass.areas?.[area]?.name : '';
}

function statusOf(c, v) {
  if (v == null || (c.warning == null && c.critical == null)) return null;
  const worse = c.lower_is_worse ? (a, b) => a <= b : (a, b) => a >= b;
  if (c.critical != null && worse(v, +c.critical)) return 'bad';
  if (c.warning != null && worse(v, +c.warning)) return 'warn';
  return 'ok';
}

function binaryInfo(st) {
  const dc = st?.attributes.device_class;
  const t = BINARY_TEXT[dc] || [null, 'On', 'Off'];
  const on = st?.state === 'on';
  return { title: t[0], text: st?.state === 'unavailable' ? 'Unavailable' : on ? t[1] : t[2], on, alarm: on && ALARM_CLASSES.includes(dc), dc };
}

function smoothPath(pts) {
  if (pts.length < 2) return '';
  let d = `M${pts[0][0]},${pts[0][1]}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] || pts[i], p1 = pts[i], p2 = pts[i + 1], p3 = pts[i + 2] || p2;
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += ` C${c1[0].toFixed(1)},${c1[1].toFixed(1)} ${c2[0].toFixed(1)},${c2[1].toFixed(1)} ${p2[0].toFixed(1)},${p2[1].toFixed(1)}`;
  }
  return d;
}

function bucket(series, from, to, n) {
  const step = (to - from) / n, out = [];
  let i = 0, last = null;
  while (i < series.length && series[i].t < from) last = series[i++].v;
  for (let b = 0; b < n; b++) {
    const end = from + (b + 1) * step;
    let sum = 0, cnt = 0;
    while (i < series.length && series[i].t < end) { sum += series[i].v; cnt++; i++; }
    if (cnt) last = sum / cnt;
    if (last != null) out.push({ t: from + (b + 0.5) * step, v: last });
  }
  return out;
}

const lift = (rgb, k) => rgb.split(',').map((x) => Math.round(+x + (255 - +x) * k)).join(',');

function layoutOf(c, hass) {
  if (c.layout && c.layout !== 'auto') return c.layout;
  if (c.entity?.startsWith('binary_sensor.')) return 'alert';
  if (c.secondary_entity) return 'dual';
  return num(hass?.states?.[c.entity]?.state) != null || !hass ? 'value' : 'alert';
}

class MaestroSensorCard extends HTMLElement {
  constructor() { super(); this.attachShadow({ mode: 'open' }); this._hist = []; }

  static getConfigElement() { return document.createElement('maestro-sensor-editor'); }
  static getStubConfig(hass) {
    const ids = Object.keys(hass?.states || {}).filter((id) => id.startsWith('sensor.') && hass.states[id].attributes.device_class === 'temperature');
    return { entity: ids[0] || Object.keys(hass?.states || {}).find((id) => id.startsWith('sensor.')) || 'sensor.temperature' };
  }

  setConfig(c) {
    if (!c?.entity) throw new Error('Please define "entity"');
    this._config = { hours: 24, ...c };
    this._layout = null;
    this._histAt = 0;
    if (this._hass) this._render();
  }

  set hass(h) {
    const c = this._config;
    const prev = this._hass;
    this._hass = h;
    if (!c) return;
    const layout = layoutOf(c, h);
    if (layout !== this._layout) { this._render(); return; }
    const changed = !prev || prev.states[c.entity] !== h.states[c.entity] || (c.secondary_entity && prev.states[c.secondary_entity] !== h.states[c.secondary_entity]);
    if (changed) this._update();
    if (this._wantGraph() && Date.now() - this._histAt > 10 * 60 * 1000) this._loadHistory();
  }

  connectedCallback() { this._observe(); }
  disconnectedCallback() { this._ro?.disconnect(); }

  getCardSize() { return this._layout === 'value' ? 3 : 2; }
  getGridOptions() { return { columns: 6, rows: this._layout === 'value' && this._wantGraph() ? 3 : 2, min_columns: 4, min_rows: 2 }; }

  _wantGraph() { return this._layout === 'value' && this._config.show_graph !== false; }

  _icon(cls, id, icon) { return `<div class="${cls}"><ha-state-icon data-e="${esc(id)}" data-own="${esc(icon || '')}"></ha-state-icon></div>`; }

  _render() {
    const c = this._config, h = this._hass;
    this._layout = layoutOf(c, h);
    const head = (dot = true) => `<div class="head">${this._icon('ic', c.entity, c.icon)}<div class="title" id="title"></div>${dot ? '<span class="dot"></span>' : ''}<span class="chev">${CHEV}</span></div>`;
    let body = '';
    if (this._layout === 'value') {
      body = `${head()}<div class="val"><span class="num" id="num">—</span><span class="unit" id="unit"></span></div>${this._wantGraph() ? '<div class="graph" id="graph"></div>' : ''}`;
    } else if (this._layout === 'dual') {
      body = `${head(false)}<div class="duo">
        <div class="part">${this._icon('ic', c.entity, c.primary_icon)}<span class="val2"><span class="num" id="num">—</span><span class="unit" id="unit"></span></span></div>
        <div class="vsep"></div>
        <div class="part">${this._icon('ic', c.secondary_entity || c.entity, c.secondary_icon)}<span class="val2"><span class="num" id="num2">—</span><span class="unit" id="unit2"></span></span></div>
      </div>`;
    } else {
      body = `<div class="alert">${this._icon('aic', c.entity, c.icon).replace('</div>', '<span class="bang">!</span></div>')}<div class="vsep"></div>
        <div class="atext"><div class="at" id="title"></div><div class="as" id="state"></div><div class="asub" id="sub"></div></div></div><span class="dot"></span>`;
    }
    this.shadowRoot.innerHTML = `<style>${S_STYLE}</style><div class="c ${this._layout}-l" id="c">${body}</div>`;
    const $ = (id) => this.shadowRoot.getElementById(id);
    this._els = { c: $('c'), title: $('title'), num: $('num'), unit: $('unit'), num2: $('num2'), unit2: $('unit2'), state: $('state'), sub: $('sub'), graph: $('graph') };
    this._els.c.onclick = () => this.dispatchEvent(new CustomEvent('hass-more-info', { detail: { entityId: c.entity }, bubbles: true, composed: true }));
    this._lookKey = null;
    this._observe();
    this._update();
    if (this._wantGraph()) this._loadHistory();
  }

  _observe() {
    this._ro?.disconnect();
    if (!this.isConnected || !this._els?.graph) return;
    this._ro = new ResizeObserver(() => this._draw());
    this._ro.observe(this._els.graph);
  }

  _update() {
    const c = this._config, h = this._hass, e = this._els;
    if (!e || !h) return;
    const st = h.states[c.entity];
    syncIcons(this.shadowRoot, h);
    e.c.classList.toggle('na', !st || st.state === 'unavailable');
    let alarm = false, status = null;
    if (this._layout === 'alert') {
      const b = binaryInfo(st);
      alarm = c.alarm === false ? false : b.alarm || (c.alarm === true && b.on);
      e.title.textContent = c.name || b.title || st?.attributes.friendly_name || c.entity;
      e.state.textContent = st && !st.entity_id.startsWith('binary_sensor.') ? fmt(h, c.entity, st, c.decimals) : b.text;
      e.sub.textContent = c.subtitle ?? areaName(h, c.entity) ?? '';
      status = !st || st.state === 'unavailable' ? null : alarm ? null : (ALARM_CLASSES.includes(b.dc) || c.alarm === true ? 'ok' : null);
    } else {
      e.title.textContent = c.name || st?.attributes.friendly_name || c.entity;
      e.num.textContent = fmt(h, c.entity, st, c.decimals);
      e.unit.textContent = st?.attributes.unit_of_measurement || '';
      if (this._layout === 'dual') {
        const s2 = h.states[c.secondary_entity];
        e.num2.textContent = fmt(h, c.secondary_entity, s2, c.secondary_decimals);
        e.unit2.textContent = s2?.attributes.unit_of_measurement || '';
        e.title.textContent = c.name || areaName(h, c.entity) || st?.attributes.friendly_name || c.entity;
      } else {
        status = statusOf(c, num(st?.state));
        if (this._hist.length && num(st?.state) != null) { this._hist.push({ t: Date.now(), v: num(st.state) }); this._draw(); }
      }
    }
    this._status = status;
    e.c.classList.toggle('has-dot', !!status);
    e.c.classList.toggle('alarm', alarm);
    const look = COLORS[alarm ? c.alarm_color || 'red' : c.color || 'blue'] || COLORS.blue;
    const key = `${look.bg}|${status}`;
    if (key !== this._lookKey) {
      this._lookKey = key;
      e.c.style.cssText = `--bg:${look.bg};--fg:${look.fg};--st:${STATUS[status] || STATUS.ok}`;
      this._draw();
    }
  }

  async _loadHistory() {
    const c = this._config;
    this._histAt = Date.now();
    try {
      const hours = Math.max(1, Number(c.hours) || 24);
      const res = await this._hass.callWS({ type: 'history/history_during_period', start_time: new Date(Date.now() - hours * 3600e3).toISOString(), entity_ids: [c.entity], minimal_response: true, no_attributes: true, significant_changes_only: false });
      this._hist = (res?.[c.entity] || []).map((r) => ({ t: r.lu ? r.lu * 1000 : Date.parse(r.last_updated || r.last_changed), v: num(r.s ?? r.state) })).filter((p) => p.v != null && Number.isFinite(p.t));
    } catch (_) { this._hist = []; }
    const cur = num(this._hass.states[c.entity]?.state);
    if (cur != null) this._hist.push({ t: Date.now(), v: cur });
    this._draw();
  }

  _lineColor() {
    const c = this._config;
    if (!c.graph_color || c.graph_color === 'auto') return this._status ? STATUS[this._status] : '120,175,255';
    return lift((COLORS[c.graph_color] || COLORS.blue).glow, 0.35);
  }

  _draw() {
    const g = this._els?.graph;
    if (!g) return;
    const w = g.clientWidth, h = g.clientHeight;
    const hours = Math.max(1, Number(this._config.hours) || 24);
    const to = Date.now(), from = to - hours * 3600e3;
    const pts = bucket(this._hist, from, to, Math.max(12, Math.min(64, Math.round(w / 8))));
    if (!w || !h || pts.length < 2) { g.innerHTML = ''; return; }
    let min = Math.min(...pts.map((p) => p.v)), max = Math.max(...pts.map((p) => p.v));
    if (max - min < 1e-6) { min -= 1; max += 1; }
    const pad = 8, top = 6, bottom = h - 14;
    const xy = pts.map((p) => [pad + ((p.t - from) / (to - from)) * (w - pad * 2 - 6), bottom - ((p.v - min) / (max - min)) * (bottom - top)]);
    xy[xy.length - 1][0] = w - pad - 6;
    const line = smoothPath(xy);
    const col = this._lineColor();
    const last = xy[xy.length - 1];
    g.innerHTML = `<svg viewBox="0 0 ${w} ${h}" preserveAspectRatio="none">
      <defs><linearGradient id="gf" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="rgb(${col})" stop-opacity=".35"/><stop offset="1" stop-color="rgb(${col})" stop-opacity="0"/></linearGradient></defs>
      <path d="${line} L${last[0]},${h} L${xy[0][0]},${h} Z" fill="url(#gf)"/>
      <path d="${line}" fill="none" stroke="rgb(${col})" stroke-width="2.5" stroke-linecap="round" style="filter:drop-shadow(0 0 4px rgba(${col},.6))"/>
      <circle cx="${last[0]}" cy="${last[1]}" r="5" fill="rgb(${col})" stroke="rgba(255,255,255,.85)" stroke-width="1.5"/></svg>`;
  }
}

const B_STYLE = `
:host{display:inline-block}
.b{display:flex;align-items:center;gap:7px;height:36px;padding:0 12px 0 6px;box-sizing:border-box;border-radius:18px;cursor:pointer;
  color:rgb(var(--fg));background:var(--bg);border:1px solid rgba(var(--fg),.2);font-family:var(--ha-font-family-body,inherit);user-select:none;white-space:nowrap}
.b.alarm{border-color:rgba(255,120,120,.6);box-shadow:0 0 10px rgba(255,60,60,.35)}
.ic{position:relative;width:26px;height:26px;border-radius:50%;display:grid;place-items:center;background:rgba(var(--fg),.14)}
.ic ha-state-icon,.ic ha-icon{--mdc-icon-size:16px;color:rgb(var(--fg))}
.v{font-size:14px;font-weight:700;font-variant-numeric:tabular-nums}
.u{font-size:12px;opacity:.75;margin-left:1px;font-weight:600}
.sep{width:1px;height:16px;background:rgba(var(--fg),.35)}
.dot{width:8px;height:8px;border-radius:50%;background:rgb(var(--st));box-shadow:0 0 6px rgba(var(--st),.8)}
.alarm .v{color:#ffb0b0}
`;

class MaestroSensorBadge extends HTMLElement {
  constructor() { super(); this.attachShadow({ mode: 'open' }); }
  static getConfigElement() { const e = document.createElement('maestro-sensor-editor'); e.badge = true; return e; }
  static getStubConfig(hass) { return MaestroSensorCard.getStubConfig(hass); }
  setConfig(c) { if (!c?.entity) throw new Error('Please define "entity"'); this._config = c; this._key = null; if (this._hass) this._update(); }
  set hass(h) {
    const c = this._config, prev = this._hass;
    this._hass = h;
    if (c && (!prev || prev.states[c.entity] !== h.states[c.entity] || (c.secondary_entity && prev.states[c.secondary_entity] !== h.states[c.secondary_entity]))) this._update();
  }
  _update() {
    const c = this._config, h = this._hass, st = h.states[c.entity];
    const binary = c.entity.startsWith('binary_sensor.');
    let html = `<span class="ic"><ha-state-icon data-e="${esc(c.entity)}" data-own="${esc(c.icon || '')}"></ha-state-icon></span>`;
    let alarm = false, status = null;
    if (binary) {
      const b = binaryInfo(st);
      alarm = c.alarm === false ? false : b.alarm || (c.alarm === true && b.on);
      html += `<span class="v">${esc(c.name ? `${c.name}: ${b.text}` : b.text)}</span>`;
    } else {
      const part = (id, s, d) => `<span class="v">${esc(fmt(h, id, s, d))}<span class="u">${esc(s?.attributes.unit_of_measurement || '')}</span></span>`;
      if (c.name) html += `<span class="v" style="font-weight:600;opacity:.8">${esc(c.name)}</span>`;
      html += part(c.entity, st, c.decimals);
      if (c.secondary_entity) html += `<span class="sep"></span>${part(c.secondary_entity, h.states[c.secondary_entity], c.secondary_decimals)}`;
      status = statusOf(c, num(st?.state));
      if (status) html += '<span class="dot"></span>';
    }
    const look = COLORS[alarm ? c.alarm_color || 'red' : c.color || 'grey'] || COLORS.grey;
    this.shadowRoot.innerHTML = `<style>${B_STYLE}</style><div class="b ${alarm ? 'alarm' : ''}" style="--bg:${look.bg};--fg:${look.fg};--st:${STATUS[status] || STATUS.ok}">${html}</div>`;
    syncIcons(this.shadowRoot, h);
    this.shadowRoot.querySelector('.b').onclick = () => this.dispatchEvent(new CustomEvent('hass-more-info', { detail: { entityId: c.entity }, bubbles: true, composed: true }));
  }
}

const SENSOR_TEXT = {
  entity: 'Entity', name: 'Title', icon: 'Icon', layout: 'Layout', subtitle: 'Subtitle (empty = area)',
  secondary_entity: 'Second entity', primary_icon: 'First value icon', secondary_icon: 'Second value icon', decimals: 'Decimals', secondary_decimals: 'Second value decimals',
  color: 'Card color', alarm_color: 'Alarm color', alarm: 'Alarm look',
  show_graph: 'Show graph', hours: 'Graph period', graph_color: 'Graph color',
  warning: 'Warning level (yellow)', critical: 'Critical level (red)', lower_is_worse: 'Lower values are worse',
  g_two: 'Second value', g_look: 'Colors', g_graph: 'Graph', g_status: 'Status dot',
  h_layout: 'Auto: on/off sensors as an alert, two entities side by side, otherwise a value with a graph.',
  h_warning: 'With levels set, a status dot appears and the graph can follow its color.',
};

class MaestroSensorEditor extends HTMLElement {
  setConfig(config) { this._config = config; this._render(); }
  set hass(hass) { this._hass = hass; this._render(); }

  _schema(d) {
    const colors = COLOR_NAMES.map((v) => ({ value: v, label: COLOR_LABELS[v] }));
    const layout = layoutOf({ ...d, layout: d.layout }, this._hass);
    const numSel = { number: { mode: 'box', step: 'any' } };
    const main = [
      { name: 'entity', required: true, selector: { entity: { filter: [{ domain: ['sensor', 'binary_sensor', 'input_number', 'number', 'counter'] }] } } },
      { type: 'grid', name: 'g_main', flatten: true, schema: [
        { name: 'name', selector: { text: {} } },
        { name: 'icon', selector: { icon: {} }, context: { icon_entity: 'entity' } },
      ] },
    ];
    if (this.badge) {
      return [...main,
        ...(d.entity?.startsWith('binary_sensor.') ? [] : [{ name: 'secondary_entity', selector: { entity: { filter: [{ domain: ['sensor', 'input_number', 'number'] }] } } }]),
        { type: 'grid', name: 'g_c', flatten: true, schema: [{ name: 'color', selector: { select: { mode: 'dropdown', options: colors } } }, { name: 'alarm_color', selector: { select: { mode: 'dropdown', options: colors } } }] },
        { type: 'expandable', name: 'g_status', flatten: true, icon: 'mdi:circle-medium', schema: [
          { type: 'grid', name: 'g_s', flatten: true, schema: [{ name: 'warning', selector: numSel }, { name: 'critical', selector: numSel }] },
          { name: 'lower_is_worse', selector: { boolean: {} } },
        ] },
      ];
    }
    return [
      ...main,
      { name: 'layout', selector: { select: { mode: 'box', options: [{ value: 'auto', label: 'Auto' }, { value: 'value', label: 'Value + graph' }, { value: 'dual', label: 'Two values' }, { value: 'alert', label: 'Alert / state' }] } } },
      ...(layout === 'alert' ? [
        { name: 'subtitle', selector: { text: {} } },
        { name: 'alarm', selector: { select: { mode: 'dropdown', options: [{ value: 'auto', label: 'Auto (leak, smoke, gas…)' }, { value: 'on', label: 'Always when on' }, { value: 'off', label: 'Never' }] } } },
      ] : []),
      ...(layout === 'dual' ? [{ type: 'expandable', name: 'g_two', flatten: true, expanded: true, icon: 'mdi:numeric-2-box-outline', schema: [
        { name: 'secondary_entity', selector: { entity: { filter: [{ domain: ['sensor', 'input_number', 'number', 'counter'] }] } } },
        { type: 'grid', name: 'g_i', flatten: true, schema: [
          { name: 'primary_icon', selector: { icon: {} }, context: { icon_entity: 'entity' } },
          { name: 'secondary_icon', selector: { icon: {} }, context: { icon_entity: 'secondary_entity' } },
        ] },
        { type: 'grid', name: 'g_d', flatten: true, schema: [{ name: 'decimals', selector: { number: { min: 0, max: 4, mode: 'box' } } }, { name: 'secondary_decimals', selector: { number: { min: 0, max: 4, mode: 'box' } } }] },
      ] }] : layout === 'value' ? [{ name: 'decimals', selector: { number: { min: 0, max: 4, mode: 'box' } } }] : []),
      { type: 'expandable', name: 'g_look', flatten: true, icon: 'mdi:palette', schema: [
        { type: 'grid', name: 'g_c', flatten: true, schema: [{ name: 'color', selector: { select: { mode: 'dropdown', options: colors } } }, { name: 'alarm_color', selector: { select: { mode: 'dropdown', options: colors } } }] },
      ] },
      ...(layout === 'value' ? [
        { type: 'expandable', name: 'g_graph', flatten: true, icon: 'mdi:chart-bell-curve', schema: [
          { name: 'show_graph', selector: { boolean: {} } },
          { type: 'grid', name: 'g_g', flatten: true, schema: [
            { name: 'hours', selector: { number: { min: 1, max: 168, mode: 'box', unit_of_measurement: 'h' } } },
            { name: 'graph_color', selector: { select: { mode: 'dropdown', options: [{ value: 'auto', label: 'Auto (status color)' }, ...colors] } } },
          ] },
        ] },
        { type: 'expandable', name: 'g_status', flatten: true, icon: 'mdi:circle-medium', schema: [
          { type: 'grid', name: 'g_s', flatten: true, schema: [{ name: 'warning', selector: numSel }, { name: 'critical', selector: numSel }] },
          { name: 'lower_is_worse', selector: { boolean: {} } },
        ] },
      ] : []),
    ];
  }

  _render() {
    if (!this._hass || !this._config) return;
    if (!this._form) {
      this._form = document.createElement('ha-form');
      this._form.computeLabel = (s) => SENSOR_TEXT[s.name] || s.name;
      this._form.computeHelper = (s) => SENSOR_TEXT[`h_${s.name}`];
      this._form.addEventListener('value-changed', (e) => this._changed(e.detail.value));
      this.appendChild(this._form);
    }
    const c = this._config;
    const d = { layout: 'auto', color: this.badge ? 'grey' : 'blue', alarm_color: 'red', show_graph: true, hours: 24, graph_color: 'auto', lower_is_worse: false, ...c, alarm: c.alarm === true ? 'on' : c.alarm === false ? 'off' : 'auto' };
    this._form.hass = this._hass;
    this._form.schema = this._schema(d);
    this._form.data = d;
  }

  _changed(v) {
    const defaults = { layout: 'auto', color: this.badge ? 'grey' : 'blue', alarm_color: 'red', show_graph: true, hours: 24, graph_color: 'auto', lower_is_worse: false, alarm: 'auto' };
    const out = { type: this._config.type };
    for (const [k, val] of Object.entries(v)) {
      if (k === 'type' || val === '' || val == null || defaults[k] === val) continue;
      if (k === 'alarm') { out.alarm = val === 'on'; continue; }
      out[k] = val;
    }
    this._config = out;
    this.dispatchEvent(new CustomEvent('config-changed', { detail: { config: out }, bubbles: true, composed: true }));
  }
}

window.customCards = window.customCards || [];
window.customBadges = window.customBadges || [];
if (!customElements.get('maestro-sensor-card')) customElements.define('maestro-sensor-card', MaestroSensorCard);
if (!customElements.get('maestro-sensor-badge')) customElements.define('maestro-sensor-badge', MaestroSensorBadge);
if (!customElements.get('maestro-sensor-editor')) customElements.define('maestro-sensor-editor', MaestroSensorEditor);
if (!window.customCards.some((x) => x.type === 'maestro-sensor-card')) {
  window.customCards.push({ type: 'maestro-sensor-card', name: 'MAestro Sensor', description: 'Info card: value with graph, two values side by side, or an alert (leak, smoke, doors…).', preview: true });
}
if (!window.customBadges.some((x) => x.type === 'maestro-sensor-badge')) {
  window.customBadges.push({ type: 'maestro-sensor-badge', name: 'MAestro Sensor (badge)', description: 'Pill with a sensor value or state.', preview: true });
}
