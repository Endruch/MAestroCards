import { COLORS, COLOR_NAMES, COLOR_LABELS } from '../core/maestro-core.js?v=1.5.3';

const TOGGLE = ['switch', 'light', 'fan', 'input_boolean', 'automation', 'siren', 'humidifier', 'group', 'climate', 'media_player', 'vacuum', 'cover', 'valve', 'lock', 'water_heater'];
const PRESS = { script: ['script', 'turn_on'], scene: ['scene', 'turn_on'], button: ['button', 'press'], input_button: ['input_button', 'press'] };

const S_STYLE = `
:host{display:block}
.sw{position:relative;display:flex;align-items:center;justify-content:center;height:56px;padding:0 18px;box-sizing:border-box;border-radius:999px;cursor:pointer;
  color:rgb(var(--fg));background:var(--bg);border:1px solid rgba(var(--fg),.2);box-shadow:0 4px 14px rgba(0,0,0,.2);
  font-family:var(--ha-font-family-body,inherit);user-select:none;-webkit-user-select:none;-webkit-tap-highlight-color:transparent;outline:none;
  transition:background .35s,color .35s,border-color .35s,box-shadow .35s,transform .12s}
.sw:active{transform:scale(.98)}
.sw.on{box-shadow:0 0 0 1px rgba(var(--glow),.35),0 4px 18px rgba(var(--glow),.35)}
.sw:focus-visible{box-shadow:0 0 0 2px rgba(var(--fg),.6)}
.ic{flex:none;display:none;place-items:center;width:40px;height:40px;margin-left:-10px;border-radius:50%;background:rgba(var(--fg),.12);border:1px solid rgba(var(--fg),.2);transition:background .35s}
.ic ha-state-icon,.ic ha-icon{--mdc-icon-size:22px;color:rgb(var(--fg))}
.on .ic{background:rgba(var(--fg),.2)}
.div{flex:none;display:none;width:1.5px;height:56%;margin-left:12px;border-radius:1px;background:rgba(var(--fg),.55)}
.with-icon .ic{display:grid}
.with-icon .div{display:block}
.with-icon .name{flex:1;text-align:center;padding:0 12px}
.name{min-width:0;font-size:16px;font-weight:600;letter-spacing:.01em;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.pending{animation:pulse 1s ease-in-out infinite}
@keyframes pulse{50%{opacity:.6}}
.na{opacity:.5;cursor:default}
`;

const look = (name, d) => COLORS[name] || COLORS[d];

class MaestroSwitchCard extends HTMLElement {
  constructor() { super(); this.attachShadow({ mode: 'open' }); }

  static getConfigElement() { return document.createElement('maestro-switch-editor'); }
  static getStubConfig(hass) {
    const ids = Object.keys(hass?.states || {}).filter((id) => ['switch', 'light', 'input_boolean', 'fan'].includes(id.split('.')[0]));
    return { entity: ids.find((id) => !['unavailable', 'unknown'].includes(hass.states[id].state)) || ids[0] || 'switch.example' };
  }

  setConfig(c) {
    if (!c?.entity) throw new Error('Please define "entity"');
    this._config = c;
    this._build();
    if (this._hass) this._update();
  }

  set hass(h) {
    const old = this._hass?.states?.[this._config?.entity];
    this._hass = h;
    if (this._els && old !== h.states[this._config.entity]) this._update();
  }

  getCardSize() { return 1; }
  getGridOptions() { return { columns: 6, rows: 1, min_columns: 3, min_rows: 1 }; }

  _build() {
    const withIcon = !!this._config.show_icon;
    this.shadowRoot.innerHTML = `<style>${S_STYLE}</style><div class="sw ${withIcon ? 'with-icon' : ''}" id="sw" role="switch" tabindex="0">
      ${withIcon ? '<div class="ic"><ha-state-icon id="icon"></ha-state-icon></div><div class="div"></div>' : ''}<div class="name" id="name"></div></div>`;
    const sw = this.shadowRoot.getElementById('sw');
    this._els = { sw, name: this.shadowRoot.getElementById('name'), icon: this.shadowRoot.getElementById('icon') };
    this._lookKey = null;
    let timer = null, held = false;
    sw.onpointerdown = () => { held = false; timer = setTimeout(() => { held = true; this._moreInfo(); }, 550); };
    const cancel = () => { clearTimeout(timer); timer = null; };
    sw.onpointerup = () => { if (timer) { cancel(); if (!held) this._toggle(); } };
    sw.onpointerleave = sw.onpointercancel = cancel;
    sw.oncontextmenu = (e) => e.preventDefault();
    sw.onkeydown = (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); this._toggle(); } };
  }

  _isOn(st) {
    if (!st) return false;
    const d = this._config.entity.split('.')[0];
    if (d === 'cover' || d === 'valve') return st.state === 'open' || st.state === 'opening';
    if (d === 'lock') return st.state === 'unlocked';
    if (d === 'media_player') return !['off', 'standby', 'unavailable', 'unknown'].includes(st.state);
    if (d === 'climate' || d === 'water_heater') return st.state !== 'off' && st.state !== 'unavailable';
    if (d === 'vacuum') return ['cleaning', 'on'].includes(st.state);
    return st.state === 'on';
  }

  _update() {
    const st = this._hass?.states?.[this._config.entity];
    const na = !st || st.state === 'unavailable';
    const on = !na && this._isOn(st);
    const e = this._els;
    const c = look(on ? this._config.on_color : this._config.off_color, on ? 'blue' : 'grey');
    const key = `${on}|${c.bg}`;
    if (key !== this._lookKey) { this._lookKey = key; e.sw.style.cssText = `--bg:${c.bg};--fg:${c.fg};--glow:${c.glow}`; }
    e.sw.classList.toggle('on', on);
    e.sw.classList.toggle('na', na);
    e.sw.setAttribute('aria-checked', String(on));
    if (this._pendingFrom !== undefined && on !== this._pendingFrom) { this._pendingFrom = undefined; e.sw.classList.remove('pending'); }
    e.name.textContent = this._config.name || st?.attributes.friendly_name || this._config.entity;
    if (e.icon) {
      e.icon.hass = this._hass;
      e.icon.stateObj = st;
      if (this._config.icon) e.icon.icon = this._config.icon;
    }
  }

  _toggle() {
    const id = this._config.entity, d = id.split('.')[0];
    const st = this._hass?.states?.[id];
    if (!st || st.state === 'unavailable') return;
    navigator.vibrate?.(10);
    if (PRESS[d]) { this._hass.callService(PRESS[d][0], PRESS[d][1], { entity_id: id }); return; }
    const on = this._isOn(st);
    this._pendingFrom = on;
    this._els.sw.classList.add('pending');
    clearTimeout(this._pt);
    this._pt = setTimeout(() => { this._pendingFrom = undefined; this._els?.sw.classList.remove('pending'); }, 8000);
    if (d === 'cover') this._hass.callService('cover', on ? 'close_cover' : 'open_cover', { entity_id: id });
    else if (d === 'valve') this._hass.callService('valve', on ? 'close_valve' : 'open_valve', { entity_id: id });
    else if (d === 'lock') this._hass.callService('lock', on ? 'lock' : 'unlock', { entity_id: id });
    else if (d === 'vacuum') this._hass.callService('vacuum', on ? 'return_to_base' : 'start', { entity_id: id });
    else this._hass.callService(TOGGLE.includes(d) ? d : 'homeassistant', on ? 'turn_off' : 'turn_on', { entity_id: id });
  }

  _moreInfo() {
    navigator.vibrate?.(20);
    this.dispatchEvent(new CustomEvent('hass-more-info', { detail: { entityId: this._config.entity }, bubbles: true, composed: true }));
  }
}

const SWITCH_TEXT = {
  entity: 'Entity', name: 'Name', on_color: 'Color when on', off_color: 'Color when off', show_icon: 'Icon on the left', icon: 'Icon (empty = the entity\'s own)',
  h_entity: 'Tap toggles, long press opens details.',
};

class MaestroSwitchEditor extends HTMLElement {
  setConfig(config) { this._config = config; this._render(); }
  set hass(hass) { this._hass = hass; this._render(); }

  _render() {
    if (!this._hass || !this._config) return;
    if (!this._form) {
      this._form = document.createElement('ha-form');
      this._form.computeLabel = (s) => SWITCH_TEXT[s.name] || s.name;
      this._form.computeHelper = (s) => SWITCH_TEXT[`h_${s.name}`];
      this._form.addEventListener('value-changed', (e) => this._changed(e.detail.value));
      this.appendChild(this._form);
    }
    const d = { on_color: 'blue', off_color: 'grey', ...this._config };
    this._form.hass = this._hass;
    this._form.schema = [
      { name: 'entity', required: true, selector: { entity: { filter: [{ domain: [...TOGGLE, ...Object.keys(PRESS)] }] } } },
      { name: 'name', selector: { text: {} } },
      { name: 'show_icon', selector: { boolean: {} } },
      ...(d.show_icon ? [{ name: 'icon', selector: { icon: {} }, context: { icon_entity: 'entity' } }] : []),
      { type: 'grid', name: 'g', flatten: true, schema: [
        { name: 'on_color', selector: { select: { mode: 'dropdown', options: COLOR_NAMES.map((v) => ({ value: v, label: COLOR_LABELS[v] })) } } },
        { name: 'off_color', selector: { select: { mode: 'dropdown', options: COLOR_NAMES.map((v) => ({ value: v, label: COLOR_LABELS[v] })) } } },
      ] },
    ];
    this._form.data = d;
  }

  _changed(v) {
    const out = { type: this._config.type };
    for (const [k, val] of Object.entries(v)) {
      if (k === 'type' || val === '' || val == null) continue;
      if ((k === 'on_color' && val === 'blue') || (k === 'off_color' && val === 'grey') || (k === 'show_icon' && val === false)) continue;
      if (k === 'icon' && !v.show_icon) continue;
      if (k === 'theme' || k.startsWith('custom_')) continue;
      out[k] = val;
    }
    this._config = out;
    this.dispatchEvent(new CustomEvent('config-changed', { detail: { config: out }, bubbles: true, composed: true }));
  }
}

window.customCards = window.customCards || [];
if (!customElements.get('maestro-switch-card')) customElements.define('maestro-switch-card', MaestroSwitchCard);
if (!customElements.get('maestro-switch-editor')) customElements.define('maestro-switch-editor', MaestroSwitchEditor);
if (!window.customCards.some((c) => c.type === 'maestro-switch-card')) {
  window.customCards.push({ type: 'maestro-switch-card', name: 'MAestro Switch', description: 'Pill on/off switch: tap anywhere to toggle, colors for on and off.', preview: true });
}
