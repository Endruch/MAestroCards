import { P, svg, clamp, COLORS, COLOR_NAMES, COLOR_LABELS } from '../core/maestro-core.js?v=1.5.3';

const D_STYLE = `
:host{display:block}
.dm{position:relative;display:flex;align-items:center;height:64px;padding:0 18px 0 8px;box-sizing:border-box;border-radius:999px;overflow:hidden;isolation:isolate;
  color:rgb(var(--fg));background:var(--off-bg);border:1px solid rgba(var(--fg),.2);box-shadow:0 4px 14px rgba(0,0,0,.2);
  font-family:var(--ha-font-family-body,inherit);user-select:none;-webkit-user-select:none;-webkit-tap-highlight-color:transparent;
  transition:color .35s,border-color .35s,box-shadow .35s}
.dm.on{border-color:rgba(var(--glow),.45);box-shadow:0 0 0 1px rgba(var(--glow),.2),0 4px 18px rgba(var(--glow),.3)}
.lvl{position:absolute;left:0;top:0;bottom:0;z-index:-1;width:0;background:var(--on-bg);transition:width .25s ease}
.dm.drag .lvl{transition:none}
.pw{flex:none;display:grid;place-items:center;width:46px;height:46px;padding:0;border-radius:50%;cursor:pointer;color:#fff;
  background:radial-gradient(circle at 50% 35%,rgba(70,72,86,.95),rgba(34,35,44,.95));border:1.5px solid rgba(255,255,255,.28);
  box-shadow:inset 0 1px 2px rgba(255,255,255,.12),0 2px 8px rgba(0,0,0,.35);transition:background .35s,border-color .35s,box-shadow .35s,transform .12s}
.pw:active{transform:scale(.93)}
.pw svg{width:24px;height:24px;fill:currentColor}
.on .pw{background:radial-gradient(circle at 50% 35%,#1fbf5a,#0b7a35);border-color:#5dff9a;
  box-shadow:0 0 0 2px rgba(61,220,132,.3),0 0 16px rgba(61,220,132,.7),inset 0 1px 3px rgba(255,255,255,.35)}
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
.on .row{justify-content:space-between}
.on .pct,.on .sl{display:block}
.pending .pw{animation:pulse 1s ease-in-out infinite}
@keyframes pulse{50%{opacity:.5}}
.na{opacity:.5;pointer-events:none}
`;

const mixWhite = (rgb, k) => rgb.split(',').map((x) => Math.round(+x + (255 - +x) * k)).join(',');

class MaestroDimmerCard extends HTMLElement {
  constructor() { super(); this.attachShadow({ mode: 'open' }); }

  static getConfigElement() { return document.createElement('maestro-dimmer-editor'); }
  static getStubConfig(hass) {
    const ids = Object.keys(hass?.states || {}).filter((id) => id.startsWith('light.') && (hass.states[id].attributes.supported_color_modes || []).some((m) => m !== 'onoff'));
    return { entity: ids.find((id) => hass.states[id].state !== 'unavailable') || ids[0] || 'light.example' };
  }

  setConfig(c) {
    if (!c?.entity) throw new Error('Please define "entity" (a dimmable light)');
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
    this._ro = new ResizeObserver(() => { if (this._p != null) this._show(this._p); });
    if (this._els) this._ro.observe(this._els.dm);
  }

  disconnectedCallback() { this._ro?.disconnect(); }

  getCardSize() { return 1; }
  getGridOptions() { return { columns: 6, rows: 1, min_columns: 4, min_rows: 1 }; }

  _build() {
    const on = COLORS[this._config.on_color] || COLORS.blue;
    const off = COLORS[this._config.off_color] || COLORS.grey;
    this.shadowRoot.innerHTML = `<style>${D_STYLE}</style>
      <div class="dm" id="dm" style="--on-bg:${on.bg};--off-bg:${off.bg};--glow:${on.glow};--hi:${mixWhite(on.glow, 0.55)};--fg-on:${on.fg};--fg-off:${off.fg};--fg:${off.fg}">
        <div class="lvl" id="lvl"></div>
        <button class="pw" id="pw">${svg(P.power)}</button><div class="div"></div>
        <div class="body" id="body">
          <div class="row"><span class="name" id="name"></span><span class="pct" id="pct"></span></div>
          <div class="sl" id="sl"><div class="rail"><div class="fill" id="fill"></div></div><div class="knob" id="knob"></div></div>
        </div>
      </div>`;
    const $ = (id) => this.shadowRoot.getElementById(id);
    this._els = { dm: $('dm'), lvl: $('lvl'), pw: $('pw'), body: $('body'), name: $('name'), pct: $('pct'), sl: $('sl'), fill: $('fill'), knob: $('knob') };
    const e = this._els;
    e.pw.onclick = () => this._toggle();
    this._ro?.disconnect();
    this._ro?.observe(e.dm);
    this._bindBody();
  }

  _bindBody() {
    const e = this._els;
    let timer = null, held = false, start = null, dragging = false;
    const value = (x) => { const r = e.sl.getBoundingClientRect(); return clamp((x - r.left) / r.width); };
    e.body.onpointerdown = (ev) => {
      held = false; dragging = false; start = ev;
      timer = setTimeout(() => { if (!dragging) { held = true; this._moreInfo(); } }, 550);
      if (this._on && ev.target.closest('.sl')) this._beginDrag(ev, value);
    };
    e.body.onpointermove = (ev) => {
      if (!start || dragging || !this._on) return;
      if (Math.abs(ev.clientX - start.clientX) > 8 && Math.abs(ev.clientX - start.clientX) > Math.abs(ev.clientY - start.clientY)) {
        clearTimeout(timer);
        this._beginDrag(ev, value);
      }
    };
    e.body.onpointerup = () => {
      clearTimeout(timer);
      if (start && !held && !this._drag && !this._on) this._toggle();
      start = null;
    };
    e.body.onpointercancel = e.body.onpointerleave = () => { clearTimeout(timer); };
    e.body.oncontextmenu = (ev) => ev.preventDefault();
    this._dragStarted = () => { dragging = true; clearTimeout(timer); };
  }

  _beginDrag(ev, value) {
    const e = this._els;
    if (this._drag) return;
    this._dragStarted();
    this._drag = true;
    e.body.setPointerCapture(ev.pointerId);
    e.dm.classList.add('drag');
    const move = (x) => { const p = Math.max(1, Math.round(value(x.clientX) * 100)); this._show(p); this._queue(p); };
    move(ev);
    e.body.onpointermove = move;
    const end = (x) => {
      e.body.onpointermove = null;
      e.dm.classList.remove('drag');
      move(x);
      this._drag = false;
      this._bindBody();
    };
    e.body.onpointerup = end;
    e.body.onpointercancel = end;
  }

  _queue(p) {
    this._want = p;
    this._hold = Date.now() + 1500;
    if (this._sending) return;
    const send = () => {
      if (this._want == null) { this._sending = false; return; }
      const v = this._want;
      this._want = null;
      this._sending = true;
      this._hass.callService('light', 'turn_on', { entity_id: this._config.entity, brightness_pct: v }).finally(() => setTimeout(send, 150));
    };
    send();
  }

  _show(p) {
    const e = this._els;
    this._p = p;
    e.pct.textContent = `${p}%`;
    const W = e.dm.clientWidth, sl = e.sl.offsetWidth ? e.sl.getBoundingClientRect().left - e.dm.getBoundingClientRect().left : 0;
    e.lvl.style.width = p ? `${Math.round(sl + (p / 100) * (W - sl))}px` : '0';
    e.fill.style.width = `${p}%`;
    e.knob.style.left = `${p}%`;
  }

  _update() {
    const st = this._hass?.states?.[this._config.entity];
    const e = this._els;
    const na = !st || st.state === 'unavailable';
    const on = !na && st.state === 'on';
    this._on = on;
    e.dm.classList.toggle('on', on);
    e.dm.classList.toggle('na', na);
    e.dm.style.setProperty('--fg', `var(${on ? '--fg-on' : '--fg-off'})`);
    if (this._pendingFrom !== undefined && on !== this._pendingFrom) { this._pendingFrom = undefined; e.dm.classList.remove('pending'); }
    e.name.textContent = this._config.name || st?.attributes.friendly_name || this._config.entity;
    if (this._drag || Date.now() < (this._hold || 0)) return;
    const b = st?.attributes.brightness;
    this._show(on ? Math.max(1, Math.round(((b ?? 255) / 255) * 100)) : 0);
  }

  _toggle() {
    const st = this._hass?.states?.[this._config.entity];
    if (!st || st.state === 'unavailable') return;
    navigator.vibrate?.(10);
    const on = st.state === 'on';
    this._pendingFrom = on;
    this._els.dm.classList.add('pending');
    clearTimeout(this._pt);
    this._pt = setTimeout(() => { this._pendingFrom = undefined; this._els?.dm.classList.remove('pending'); }, 8000);
    this._hass.callService('light', on ? 'turn_off' : 'turn_on', { entity_id: this._config.entity });
  }

  _moreInfo() {
    navigator.vibrate?.(20);
    this.dispatchEvent(new CustomEvent('hass-more-info', { detail: { entityId: this._config.entity }, bubbles: true, composed: true }));
  }
}

const DIMMER_TEXT = {
  entity: 'Dimmable light', name: 'Name', on_color: 'Color when on', off_color: 'Color when off',
  h_entity: 'Power button toggles, slide to dim, long press opens details.',
};

class MaestroDimmerEditor extends HTMLElement {
  setConfig(config) { this._config = config; this._render(); }
  set hass(hass) { this._hass = hass; this._render(); }

  _render() {
    if (!this._hass || !this._config) return;
    if (!this._form) {
      this._form = document.createElement('ha-form');
      this._form.computeLabel = (s) => DIMMER_TEXT[s.name] || s.name;
      this._form.computeHelper = (s) => DIMMER_TEXT[`h_${s.name}`];
      this._form.addEventListener('value-changed', (e) => this._changed(e.detail.value));
      this.appendChild(this._form);
    }
    const colors = COLOR_NAMES.map((v) => ({ value: v, label: COLOR_LABELS[v] }));
    this._form.hass = this._hass;
    this._form.schema = [
      { name: 'entity', required: true, selector: { entity: { filter: [{ domain: 'light' }] } } },
      { name: 'name', selector: { text: {} } },
      { type: 'grid', name: 'g', flatten: true, schema: [
        { name: 'on_color', selector: { select: { mode: 'dropdown', options: colors } } },
        { name: 'off_color', selector: { select: { mode: 'dropdown', options: colors } } },
      ] },
    ];
    this._form.data = { on_color: 'blue', off_color: 'grey', ...this._config };
  }

  _changed(v) {
    const out = { type: this._config.type };
    for (const [k, val] of Object.entries(v)) {
      if (k === 'type' || val === '' || val == null) continue;
      if ((k === 'on_color' && val === 'blue') || (k === 'off_color' && val === 'grey')) continue;
      out[k] = val;
    }
    this._config = out;
    this.dispatchEvent(new CustomEvent('config-changed', { detail: { config: out }, bubbles: true, composed: true }));
  }
}

window.customCards = window.customCards || [];
if (!customElements.get('maestro-dimmer-card')) customElements.define('maestro-dimmer-card', MaestroDimmerCard);
if (!customElements.get('maestro-dimmer-editor')) customElements.define('maestro-dimmer-editor', MaestroDimmerEditor);
if (!window.customCards.some((c) => c.type === 'maestro-dimmer-card')) {
  window.customCards.push({ type: 'maestro-dimmer-card', name: 'MAestro Dimmer', description: 'Pill dimmer: power button, brightness slider, the card fills with color by level.', preview: true });
}
