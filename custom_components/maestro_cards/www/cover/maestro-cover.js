import { clamp, COLORS, COLOR_NAMES, COLOR_LABELS } from '../core/maestro-core.js?v=1.5.3';

const ICONS = {
  open: 'M7.41,15.41L12,10.83L16.59,15.41L18,14L12,8L6,14L7.41,15.41Z',
  stop: 'M7,7H17V17H7V7Z',
  close: 'M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z',
};
const btn = (k) => `<button class="cb" id="${k}" data-k="${k}"><svg viewBox="0 0 24 24"><path d="${ICONS[k]}"/></svg></button>`;

const C_STYLE = `
:host{display:block}
.cv{position:relative;display:flex;align-items:center;height:64px;padding:0 18px 0 8px;box-sizing:border-box;border-radius:999px;overflow:hidden;isolation:isolate;
  color:rgb(var(--fg));background:var(--off-bg);border:1px solid rgba(var(--fg),.2);box-shadow:0 4px 14px rgba(0,0,0,.2);
  font-family:var(--ha-font-family-body,inherit);user-select:none;-webkit-user-select:none;-webkit-tap-highlight-color:transparent;transition:color .35s,border-color .35s,box-shadow .35s}
.cv.open{border-color:rgba(var(--glow),.45);box-shadow:0 0 0 1px rgba(var(--glow),.2),0 4px 18px rgba(var(--glow),.3)}
.lvl{position:absolute;left:0;top:0;bottom:0;z-index:-1;width:0;background:var(--on-bg);transition:width .35s ease}
.drag .lvl{transition:none}
.btns{flex:none;display:flex;gap:6px}
.cb{display:grid;place-items:center;width:46px;height:46px;padding:0;border-radius:50%;cursor:pointer;color:#fff;
  background:radial-gradient(circle at 50% 35%,rgba(70,72,86,.95),rgba(34,35,44,.95));border:1.5px solid rgba(255,255,255,.28);
  box-shadow:inset 0 1px 2px rgba(255,255,255,.12),0 2px 8px rgba(0,0,0,.35);transition:transform .12s,opacity .2s,box-shadow .2s}
.cb:active{transform:scale(.92)}
.cb svg{width:26px;height:26px;fill:currentColor}
.cb#stop svg{width:20px;height:20px}
.cb:disabled{opacity:.35;pointer-events:none}
.cb.moving{box-shadow:0 0 0 2px rgba(var(--hi),.45),0 0 14px rgba(var(--hi),.6);animation:pulse 1s ease-in-out infinite}
@keyframes pulse{50%{opacity:.55}}
.div{flex:none;width:1.5px;height:56%;margin:0 14px;border-radius:1px;background:rgba(var(--fg),.55)}
.body{flex:1;min-width:0;align-self:stretch;display:flex;flex-direction:column;justify-content:center;cursor:pointer;touch-action:pan-y}
.row{display:flex;align-items:baseline;justify-content:center;gap:10px;min-width:0}
.name{min-width:0;font-size:16px;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;text-shadow:0 1px 3px rgba(0,0,0,.3)}
.pct{flex:none;display:none;font-size:15px;font-weight:600;font-variant-numeric:tabular-nums;text-shadow:0 1px 3px rgba(0,0,0,.3)}
.sl{position:relative;display:none;height:16px;margin-top:5px;touch-action:none}
.rail{position:absolute;left:0;right:0;top:50%;height:6px;margin-top:-3px;border-radius:3px;background:rgba(var(--fg),.22);overflow:hidden}
.fill{position:absolute;left:0;top:0;bottom:0;width:0;border-radius:3px;background:linear-gradient(90deg,rgba(var(--hi),.75),rgb(var(--hi)));box-shadow:0 0 8px rgba(var(--hi),.6)}
.knob{position:absolute;top:50%;left:0;width:16px;height:16px;margin:-8px 0 0 -8px;border-radius:50%;background:#fff;box-shadow:0 1px 5px rgba(0,0,0,.45);transition:transform .15s}
.drag .knob{transform:scale(1.15)}
.pos .row{justify-content:space-between}
.pos .pct,.pos .sl{display:block}
.na{opacity:.5;pointer-events:none}
@container (max-width:340px){.cb{width:38px;height:38px}.cb svg{width:22px;height:22px}.div{margin:0 10px}}
`;

const mixWhite = (rgb, k) => rgb.split(',').map((x) => Math.round(+x + (255 - +x) * k)).join(',');

class MaestroCoverCard extends HTMLElement {
  constructor() { super(); this.attachShadow({ mode: 'open' }); }

  static getConfigElement() { return document.createElement('maestro-cover-editor'); }
  static getStubConfig(hass) {
    const ids = Object.keys(hass?.states || {}).filter((id) => id.startsWith('cover.'));
    return { entity: ids.find((id) => hass.states[id].state !== 'unavailable') || ids[0] || 'cover.example' };
  }

  setConfig(c) {
    if (!c?.entity) throw new Error('Please define "entity" (a cover)');
    this._config = c;
    this._build();
    if (this._hass) this._update();
  }

  set hass(h) {
    const old = this._hass?.states?.[this._config?.entity];
    this._hass = h;
    if (this._els && old !== h.states[this._config.entity]) this._update();
  }

  connectedCallback() {
    this._ro?.disconnect();
    this._ro = new ResizeObserver(() => this._paint());
    if (this._els) this._ro.observe(this._els.cv);
  }

  disconnectedCallback() { this._ro?.disconnect(); }

  getCardSize() { return 1; }
  getGridOptions() { return { columns: 6, rows: 1, min_columns: 4, min_rows: 1 }; }

  _build() {
    const on = COLORS[this._config.open_color] || COLORS.blue;
    const off = COLORS[this._config.closed_color] || COLORS.grey;
    this.shadowRoot.innerHTML = `<style>${C_STYLE}</style>
      <div class="cv" id="cv" style="container-type:inline-size;--on-bg:${on.bg};--off-bg:${off.bg};--glow:${on.glow};--hi:${mixWhite(on.glow, 0.55)};--fg-on:${on.fg};--fg-off:${off.fg};--fg:${off.fg}">
        <div class="lvl" id="lvl"></div>
        <div class="btns">${btn('open')}${btn('stop')}${btn('close')}</div><div class="div"></div>
        <div class="body" id="body">
          <div class="row"><span class="name" id="name"></span><span class="pct" id="pct"></span></div>
          <div class="sl" id="sl"><div class="rail"><div class="fill" id="fill"></div></div><div class="knob" id="knob"></div></div>
        </div>
      </div>`;
    const $ = (id) => this.shadowRoot.getElementById(id);
    this._els = { cv: $('cv'), lvl: $('lvl'), body: $('body'), name: $('name'), pct: $('pct'), sl: $('sl'), fill: $('fill'), knob: $('knob'), open: $('open'), stop: $('stop'), close: $('close') };
    const svc = { open: 'open_cover', stop: 'stop_cover', close: 'close_cover' };
    for (const k of Object.keys(svc)) this._els[k].onclick = () => { navigator.vibrate?.(10); this._hass.callService('cover', svc[k], { entity_id: this._config.entity }); };
    this._ro?.disconnect();
    this._ro?.observe(this._els.cv);
    this._bindBody();
  }

  _bindBody() {
    const e = this._els;
    let timer = null, start = null;
    const value = (x) => { const r = e.sl.getBoundingClientRect(); return clamp((x - r.left) / r.width); };
    e.body.onpointerdown = (ev) => {
      start = ev;
      timer = setTimeout(() => { if (!this._drag) this._moreInfo(); }, 550);
      if (this._hasPos && ev.target.closest('.sl')) this._beginDrag(ev, value, () => clearTimeout(timer));
    };
    e.body.onpointermove = (ev) => {
      if (!start || this._drag || !this._hasPos) return;
      const dx = Math.abs(ev.clientX - start.clientX);
      if (dx > 8 && dx > Math.abs(ev.clientY - start.clientY)) this._beginDrag(ev, value, () => clearTimeout(timer));
    };
    e.body.onpointerup = e.body.onpointercancel = e.body.onpointerleave = () => { clearTimeout(timer); start = null; };
    e.body.oncontextmenu = (ev) => ev.preventDefault();
  }

  _beginDrag(ev, value, cancelHold) {
    const e = this._els;
    if (this._drag) return;
    cancelHold();
    this._drag = true;
    e.body.setPointerCapture(ev.pointerId);
    e.cv.classList.add('drag');
    const move = (x) => this._show(Math.round(value(x.clientX) * 100));
    move(ev);
    e.body.onpointermove = move;
    e.body.onpointerup = e.body.onpointercancel = (x) => {
      if (x.type === 'pointerup') move(x);
      e.cv.classList.remove('drag');
      this._drag = false;
      this._hold = Date.now() + 2500;
      this._hass.callService('cover', 'set_cover_position', { entity_id: this._config.entity, position: this._p });
      this._bindBody();
    };
  }

  _show(p) {
    this._p = p;
    const e = this._els;
    e.pct.textContent = `${p}%`;
    e.fill.style.width = `${p}%`;
    e.knob.style.left = `${p}%`;
    this._paint();
  }

  _paint() {
    const e = this._els;
    if (!e) return;
    if (!this._hasPos) { e.lvl.style.width = this._open ? '100%' : '0'; return; }
    e.lvl.style.width = `${this._p || 0}%`;
  }

  _update() {
    const st = this._hass?.states?.[this._config.entity];
    const e = this._els;
    const na = !st || st.state === 'unavailable';
    const f = st?.attributes.supported_features ?? 15;
    this._hasPos = !na && (f & 4) !== 0 && st.attributes.current_position != null && this._config.show_position !== false;
    this._open = !na && (st.state === 'open' || st.state === 'opening' || (st.attributes.current_position ?? 0) > 0 && st.state !== 'closed');
    e.cv.classList.toggle('na', na);
    e.cv.classList.toggle('pos', this._hasPos);
    e.cv.classList.toggle('open', this._open);
    e.cv.style.setProperty('--fg', `var(${this._open ? '--fg-on' : '--fg-off'})`);
    e.open.disabled = !(f & 1) || (this._hasPos ? st?.attributes.current_position >= 100 : st?.state === 'open');
    e.close.disabled = !(f & 2) || (this._hasPos ? st?.attributes.current_position <= 0 : st?.state === 'closed');
    e.stop.disabled = !(f & 8);
    e.open.classList.toggle('moving', st?.state === 'opening');
    e.close.classList.toggle('moving', st?.state === 'closing');
    e.name.textContent = this._config.name || st?.attributes.friendly_name || this._config.entity;
    if (this._drag || Date.now() < (this._hold || 0)) return;
    this._show(this._hasPos ? Math.round(st.attributes.current_position) : this._open ? 100 : 0);
  }

  _moreInfo() {
    navigator.vibrate?.(20);
    this.dispatchEvent(new CustomEvent('hass-more-info', { detail: { entityId: this._config.entity }, bubbles: true, composed: true }));
  }
}

const COVER_TEXT = {
  entity: 'Cover', name: 'Name', open_color: 'Color when open', closed_color: 'Color when closed', show_position: 'Position slider',
  h_entity: 'Buttons open, stop and close; slide to set the position; long press opens details.',
  h_show_position: 'Shown only when the cover supports positions.',
};

class MaestroCoverEditor extends HTMLElement {
  setConfig(config) { this._config = config; this._render(); }
  set hass(hass) { this._hass = hass; this._render(); }

  _render() {
    if (!this._hass || !this._config) return;
    if (!this._form) {
      this._form = document.createElement('ha-form');
      this._form.computeLabel = (s) => COVER_TEXT[s.name] || s.name;
      this._form.computeHelper = (s) => COVER_TEXT[`h_${s.name}`];
      this._form.addEventListener('value-changed', (e) => this._changed(e.detail.value));
      this.appendChild(this._form);
    }
    const colors = COLOR_NAMES.map((v) => ({ value: v, label: COLOR_LABELS[v] }));
    this._form.hass = this._hass;
    this._form.schema = [
      { name: 'entity', required: true, selector: { entity: { filter: [{ domain: 'cover' }] } } },
      { name: 'name', selector: { text: {} } },
      { type: 'grid', name: 'g', flatten: true, schema: [
        { name: 'open_color', selector: { select: { mode: 'dropdown', options: colors } } },
        { name: 'closed_color', selector: { select: { mode: 'dropdown', options: colors } } },
      ] },
      { name: 'show_position', selector: { boolean: {} } },
    ];
    this._form.data = { open_color: 'blue', closed_color: 'grey', show_position: true, ...this._config };
  }

  _changed(v) {
    const out = { type: this._config.type };
    for (const [k, val] of Object.entries(v)) {
      if (k === 'type' || val === '' || val == null) continue;
      if ((k === 'open_color' && val === 'blue') || (k === 'closed_color' && val === 'grey') || (k === 'show_position' && val === true)) continue;
      out[k] = val;
    }
    this._config = out;
    this.dispatchEvent(new CustomEvent('config-changed', { detail: { config: out }, bubbles: true, composed: true }));
  }
}

window.customCards = window.customCards || [];
if (!customElements.get('maestro-cover-card')) customElements.define('maestro-cover-card', MaestroCoverCard);
if (!customElements.get('maestro-cover-editor')) customElements.define('maestro-cover-editor', MaestroCoverEditor);
if (!window.customCards.some((c) => c.type === 'maestro-cover-card')) {
  window.customCards.push({ type: 'maestro-cover-card', name: 'MAestro Cover', description: 'Open, stop, close and a position slider. Works with any cover: shades, blinds, shutters, garage doors.', preview: true });
}
