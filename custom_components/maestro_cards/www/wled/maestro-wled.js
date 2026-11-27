import { P, svg, clamp, esc, STYLE, THEME_NAMES, THEME_LABELS, resolveTheme, openPopup, loadSettings, withSettings, COLORS } from '../core/maestro-core.js?v=1.5.3';

const WP = {
  moon: 'M18.97,15.95C19.8,15.87 20.69,17.05 20.16,17.8C19.84,18.25 19.5,18.67 19.08,19.07C15.17,23 8.84,23 4.94,19.07C1.03,15.17 1.03,8.83 4.94,4.93C5.34,4.53 5.76,4.17 6.21,3.85C6.96,3.32 8.14,4.21 8.06,5.04C7.79,7.9 8.75,10.87 10.95,13.06C13.14,15.26 16.1,16.22 18.97,15.95Z',
  save: 'M17,3A2,2 0 0,1 19,5V21L12,18L5,21V5C5,3.89 5.9,3 7,3H17M11,7V9H9V11H11V13H13V11H15V9H13V7H11Z',
  playlist: 'M19,9H2V11H19V9M19,5H2V7H19V5M2,15H15V13H2V15M17,13V19L22,16L17,13Z',
  pencil: 'M20.71,7.04C21.1,6.65 21.1,6 20.71,5.63L18.37,3.29C18,2.9 17.35,2.9 16.96,3.29L15.12,5.12L18.87,8.87M3,17.25V21H6.75L17.81,9.93L14.06,6.18L3,17.25Z',
  search: 'M9.5,3A6.5,6.5 0 0,1 16,9.5C16,11.11 15.41,12.59 14.44,13.73L14.71,14H15.5L20.5,19L19,20.5L14,15.5V14.71L13.73,14.44C12.59,15.41 11.11,16 9.5,16A6.5,6.5 0 0,1 3,9.5A6.5,6.5 0 0,1 9.5,3M9.5,5C7,5 5,7 5,9.5C5,12 7,14 9.5,14C12,14 14,12 14,9.5C14,7 12,5 9.5,5Z',
  check: 'M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z',
  stop: 'M18,18H6V6H18V18Z',
  plus: 'M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z',
  back: 'M20,11V13H8L13.5,18.5L12.08,19.92L4.16,12L12.08,4.08L13.5,5.5L8,11H20Z',
  trash: 'M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z',
};

const SWATCHES = [[255, 0, 0], [255, 96, 0], [255, 180, 60], [255, 228, 180], [255, 255, 255], [0, 255, 60], [0, 220, 255], [0, 60, 255], [150, 0, 255], [255, 0, 160]];
const RANDOM = ['#ff3b30', '#ffcc00', '#34c759', '#0a84ff', '#bf5af2'];

const rgb = (c) => `rgb(${(c || [0, 0, 0]).slice(0, 3).map((x) => Math.round(+x || 0)).join(',')})`;
const pct = (v) => `${Math.round((v / 255) * 100)}%`;

function palGradient(stops, cols) {
  if (!Array.isArray(stops) || !stops.length) return null;
  const n = stops.length;
  const slot = (k) => rgb(cols?.[{ c1: 0, c2: 1, c3: 2 }[k]]);
  const parts = stops.map((s, i) => {
    if (Array.isArray(s)) return `rgb(${s[1]},${s[2]},${s[3]}) ${((s[0] / 255) * 100).toFixed(1)}%`;
    const pos = n === 1 ? 0 : (i / (n - 1)) * 100;
    return `${s === 'r' ? RANDOM[i % RANDOM.length] : slot(s)} ${pos.toFixed(1)}%`;
  });
  if (n === 1) parts.push(parts[0].replace(/ [\d.]+%$/, ' 100%'));
  return `linear-gradient(90deg,${parts.join(',')})`;
}

function segLook(seg, palx) {
  if (!seg) return { grad: 'linear-gradient(90deg,#555,#888)', color: [160, 160, 160] };
  const c1 = seg.col?.[0] || [255, 255, 255];
  const solid = `linear-gradient(90deg,${rgb(c1)},${rgb(c1)})`;
  if (!seg.fx) return { grad: solid, color: c1 };
  const stops = palx?.[String(seg.pal ?? 0)];
  const grad = palGradient(stops, seg.col) || solid;
  const first = Array.isArray(stops?.[0]) ? stops[Math.floor(stops.length / 2)].slice(1) : c1;
  return { grad, color: first };
}

function hsv2rgb(h, s, v = 1) {
  const f = (n) => { const k = (n + h / 60) % 6; return v - v * s * Math.max(0, Math.min(k, 4 - k, 1)); };
  return [f(5), f(3), f(1)].map((x) => Math.round(x * 255));
}

function rgb2hs(c) {
  const [r, g, b] = (c || [255, 255, 255]).map((x) => x / 255);
  const max = Math.max(r, g, b), min = Math.min(r, g, b), d = max - min;
  let h = 0;
  if (d) h = max === r ? ((g - b) / d) % 6 : max === g ? (b - r) / d + 2 : (r - g) / d + 4;
  return { h: (h * 60 + 360) % 360, s: max ? d / max : 0 };
}

function mergeCmd(a, b) {
  const out = { ...a };
  for (const [k, v] of Object.entries(b)) {
    if (k === 'seg' && Array.isArray(out.seg)) {
      const by = new Map(out.seg.map((s) => [s.id, { ...s }]));
      for (const s of v) by.set(s.id, { ...(by.get(s.id) || {}), ...s });
      out.seg = [...by.values()];
    } else if (v && typeof v === 'object' && !Array.isArray(v) && out[k] && typeof out[k] === 'object') out[k] = { ...out[k], ...v };
    else out[k] = v;
  }
  return out;
}

class WledStore {
  constructor(entity) {
    this.entity = entity;
    this.subs = new Set();
    this.st = null;
    this.data = null;
    this.error = null;
  }

  attach(hass, fn) {
    this.hass = hass;
    this.subs.add(fn);
    if (!this.started) this._start();
    else if (this.st || this.error) fn();
    return () => { this.subs.delete(fn); if (!this.subs.size) this._stop(); };
  }

  emit() { this.subs.forEach((f) => f()); }

  async _start() {
    this.started = true;
    if (!this.hass?.config?.components?.includes('maestro_cards')) {
      this.error = 'MAestro Cards integration is not set up';
      this.emit();
      return;
    }
    try {
      const r = await this.hass.callWS({ type: 'maestro_cards/wled/info', entity_id: this.entity });
      this.data = r;
      this.st = r.state;
      this.presets = r.presets || {};
      this.error = null;
    } catch (e) {
      this.error = e?.message || 'WLED is not reachable';
      this.started = false;
      this.emit();
      return;
    }
    this.emit();
    try {
      this.unsub = await this.hass.connection.subscribeMessage((m) => this._event(m), { type: 'maestro_cards/wled/subscribe', entity_id: this.entity });
      if (!this.subs.size) this._stop();
    } catch (e) { }
  }

  _stop() {
    const u = this.unsub;
    this.unsub = null;
    this.started = false;
    if (typeof u === 'function') u().catch?.(() => {});
  }

  _event(m) {
    if (!m?.state || this.busy || this.pend || Date.now() < (this.hold || 0)) return;
    const prevPs = this.st?.ps;
    this.st = m.state;
    if (m.state.ps > 0 && (m.state.ps !== prevPs) && !this.presets?.[m.state.ps]?.n) this.reloadPresets();
    this.emit();
  }

  send(cmd) {
    this.st = mergeCmd(this.st || {}, cmd);
    this.pend = this.pend ? mergeCmd(this.pend, cmd) : cmd;
    this.emit();
    if (!this.busy) this._flush();
  }

  async _flush() {
    const data = this.pend;
    this.pend = null;
    if (!data) return;
    this.busy = true;
    let res;
    try {
      res = await this.hass.callWS({ type: 'maestro_cards/wled/state', entity_id: this.entity, data });
    } catch (e) {
      this.lastError = e?.message;
    }
    this.busy = false;
    this.hold = Date.now() + 700;
    if (this.pend) { setTimeout(() => this._flush(), 40); return; }
    if (res && Array.isArray(res.seg)) { this.st = res; this.emit(); }
  }

  async reloadPresets(delay = 0) {
    if (delay) await new Promise((r) => setTimeout(r, delay));
    try {
      this.presets = (await this.hass.callWS({ type: 'maestro_cards/wled/presets', entity_id: this.entity })) || {};
      this.emit();
    } catch (e) { }
  }

  async command(cmd, presetsChanged) {
    this.hold = Date.now() + 700;
    try {
      const res = await this.hass.callWS({ type: 'maestro_cards/wled/state', entity_id: this.entity, data: cmd });
      if (res && Array.isArray(res.seg)) this.st = res;
    } catch (e) { this.lastError = e?.message; }
    this.emit();
    if (presetsChanged) this.reloadPresets(700);
  }
}

const STORES = new Map();
function wledStore(entity) {
  if (!STORES.has(entity)) STORES.set(entity, new WledStore(entity));
  return STORES.get(entity);
}

function presetList(presets) {
  return Object.entries(presets || {})
    .filter(([id, p]) => id !== '0' && p && p.n)
    .map(([id, p]) => ({ id: +id, name: p.n, playlist: !!p.playlist, p }))
    .sort((a, b) => a.id - b.id);
}

function presetLook(p, palx) {
  if (p.playlist) return 'linear-gradient(135deg,#7b5cff,#ff5ca8)';
  const segs = Array.isArray(p.seg) ? p.seg : p.seg ? [p.seg] : [];
  const main = segs.find((s) => s.id === p.mainseg) || segs[0];
  if (!main) return 'linear-gradient(135deg,#5a5f70,#8a90a3)';
  return segLook({ fx: 0, pal: 0, ...main }, palx).grad;
}

function freeSlot(presets) {
  for (let i = 1; i <= 250; i++) if (!presets?.[i]?.n && !presets?.[i]?.playlist) return i;
  return 250;
}

const W_STYLE = `
ha-card.wled{min-height:0;--mmp-blur:46px;overflow:clip}
.wled .bg{opacity:.85;transition:background .6s,opacity .4s}
.wled.off .bg{opacity:1}
.w-main{position:relative;padding:10px 12px 8px 16px;display:flex;flex-direction:column}
.w-head{display:flex;align-items:center;gap:12px;min-width:0}
.w-title{flex:1;min-width:0}
.w-top{display:flex;align-items:center;gap:10px;min-width:0;height:24px}
.w-name{flex:1;min-width:0;font-size:17px;font-weight:700;line-height:1.25;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.w-mode{flex:none;display:flex;align-items:center;gap:6px;max-width:55%;padding:0;border:0;background:none;color:inherit;font:inherit;font-size:13px;font-weight:600;opacity:.85;cursor:pointer}
.w-mode span:not(.sw){white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.w-mode .sw{width:14px;height:14px}
.off .w-mode{display:none}
.w-sub{flex:none;max-width:45%;font-size:12.5px;opacity:.65;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.w-line{display:flex;align-items:center;gap:10px;min-width:0;height:32px}
.w-line .btn.xs{margin-left:-4px}
.w-bri{flex:1;display:flex;align-items:center;gap:8px;min-width:0}
.w-bri .w-pct{width:36px}
.w-line .w-flex{display:none}
.off:not(.exp) .w-bri{display:none}
.off:not(.exp) .w-line .w-flex{display:block;flex:1}
.w-pw{width:42px;height:42px;border:1px solid rgba(var(--mmp-fg-rgb),.2);color:rgba(var(--mmp-fg-rgb),.85)}
.w-pw.on{color:#3ddc84;border-color:rgba(61,220,132,.55);box-shadow:0 0 16px rgba(61,220,132,.4),inset 0 0 10px rgba(61,220,132,.18)}
.theme-light .w-pw.on{color:#12884a}
.w-row{display:flex;align-items:center;gap:10px;min-width:0}
.w-row .lbl{flex:0 0 72px;font-size:13px;opacity:.8}
.wsl{position:relative;flex:1;height:28px;cursor:pointer;touch-action:none;min-width:40px}
.wsl .rail{position:absolute;left:0;right:0;top:50%;height:8px;margin-top:-4px;border-radius:4px;background:rgba(var(--mmp-fg-rgb),.16);overflow:hidden}
.wsl .fill{position:absolute;left:0;top:0;bottom:0;border-radius:4px;background:var(--w-fill,var(--mmp-accent))}
.wsl .knob{position:absolute;top:50%;width:18px;height:18px;margin:-9px 0 0 -9px;border-radius:50%;background:#fff;box-shadow:0 1px 6px rgba(0,0,0,.45);transition:transform .15s}
.wsl.drag .knob,.wsl:hover .knob{transform:scale(1.12)}
.w-pct{flex:none;width:40px;text-align:right;font-size:13px;font-variant-numeric:tabular-nums;opacity:.85}
.w-chip{display:flex;align-items:center;gap:8px;height:34px;min-width:0;max-width:75%;padding:0 10px 0 5px;border-radius:999px;cursor:pointer;
  border:1px solid rgba(var(--mmp-fg-rgb),.18);background:rgba(var(--mmp-fg-rgb),.08);color:inherit;font:inherit;font-size:13px;font-weight:600}
.w-chip span:not(.sw){white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.w-chip svg{flex:none;width:16px;height:16px;fill:currentColor;opacity:.7}
.sw{flex:none;width:24px;height:24px;border-radius:50%;background:#777;box-shadow:inset 0 0 0 1px rgba(255,255,255,.25)}
.w-flex{flex:1}
.btn.lit{color:#ffd76a;background:rgba(255,215,106,.14)}
.w-exp svg{transition:transform .25s}
.exp .w-exp svg{transform:rotate(180deg)}
.w-x{display:none;position:relative;border-top:1px solid rgba(var(--mmp-fg-rgb),.1);padding:10px 14px 12px 16px;box-sizing:border-box;transition:min-height .2s}
#body{height:176px;display:flex;flex-direction:column}
#body>.acts{margin-top:auto}
.w-x.ovopen{min-height:var(--ov-h,300px)}
.exp .w-x{display:block}
.w-bar{display:flex;align-items:center;gap:8px;margin-bottom:10px;min-width:0}
.w-tabs{display:flex;padding:3px;border-radius:999px;background:rgba(var(--mmp-fg-rgb),.08);min-width:0}
.w-tabs button{border:0;background:none;color:inherit;font:inherit;font-size:13px;padding:6px 13px;border-radius:999px;cursor:pointer;opacity:.75;white-space:nowrap}
.w-tabs button.on{background:var(--mmp-accent);color:var(--mmp-on-accent);opacity:1;font-weight:600}
.w-zone{margin-left:auto;max-width:45%}
.w-err{padding:14px 16px;font-size:13px;opacity:.8}
.c-wrap{display:flex;gap:16px;align-items:center;height:100%}
.wheel-box{flex:none;width:150px;height:150px;position:relative;touch-action:none;cursor:crosshair}
.cwheel{position:absolute;inset:0;border-radius:50%;
  background:radial-gradient(circle closest-side,#fff,rgba(255,255,255,0)),conic-gradient(red,#ff0,#0f0,#0ff,#00f,#f0f,red);
  box-shadow:0 0 0 1px rgba(var(--mmp-fg-rgb),.2),0 6px 20px rgba(0,0,0,.35)}
.cmark{position:absolute;width:20px;height:20px;margin:-10px 0 0 -10px;border-radius:50%;border:3px solid #fff;box-shadow:0 1px 6px rgba(0,0,0,.6);pointer-events:none}
.c-side{flex:1;min-width:0;display:flex;flex-direction:column;gap:12px}
.sws{display:grid;grid-template-columns:repeat(10,1fr);gap:6px}
.swb{aspect-ratio:1;border-radius:50%;border:0;cursor:pointer;box-shadow:inset 0 0 0 1px rgba(255,255,255,.25);transition:transform .1s}
.swb:active{transform:scale(.9)}
.dds{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:8px}
.dd{display:flex;flex-direction:column;align-items:flex-start;gap:3px;min-width:0;padding:8px 12px;border-radius:14px;cursor:pointer;text-align:left;
  border:1px solid rgba(var(--mmp-fg-rgb),.16);background:rgba(var(--mmp-fg-rgb),.07);color:inherit;font:inherit}
.dd-l{font-size:11px;opacity:.6;text-transform:uppercase;letter-spacing:.06em}
.dd-v{display:flex;align-items:center;gap:8px;width:100%;font-size:14px;font-weight:600;min-width:0}
.dd-v span{white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.dd-v svg{margin-left:auto;flex:none;width:18px;height:18px;fill:currentColor;opacity:.7}
.pbar{flex:none;width:44px;height:14px;border-radius:7px;box-shadow:inset 0 0 0 1px rgba(255,255,255,.2)}
.sliders{display:flex;flex-direction:column;gap:4px}
.acts{display:flex;gap:8px;margin-top:10px}
.act{display:flex;align-items:center;justify-content:center;gap:8px;flex:1;min-width:0;white-space:nowrap;height:38px;border-radius:12px;cursor:pointer;
  border:1px solid rgba(var(--mmp-fg-rgb),.18);background:rgba(var(--mmp-fg-rgb),.07);color:inherit;font:inherit;font-size:13px;font-weight:600}
.act svg{width:18px;height:18px;fill:currentColor}
.act.sm{flex:none;min-width:38px;width:38px;padding:0}
.act.on{background:var(--mmp-accent);color:var(--mmp-on-accent)}
.act:hover,.dd:hover,.w-chip:hover{background:rgba(var(--mmp-fg-rgb),.13)}
.act.on:hover{background:var(--mmp-accent)}
.pgrid{flex:1;min-height:0;align-content:start;display:grid;grid-template-columns:repeat(auto-fill,minmax(130px,1fr));gap:8px;overflow-y:auto;scrollbar-width:thin;scrollbar-color:rgba(var(--mmp-fg-rgb),.3) transparent;padding:2px}
.pc{position:relative;display:flex;align-items:center;gap:8px;height:40px;padding:0 8px 0 6px;border-radius:12px;cursor:pointer;min-width:0;
  border:1px solid rgba(var(--mmp-fg-rgb),.14);background:rgba(var(--mmp-fg-rgb),.06);color:inherit;font:inherit;font-size:13px;font-weight:500;text-align:left}
.pc span:not(.sw){flex:1;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.pc.on{border-color:var(--mmp-fg);background:rgba(var(--mmp-fg-rgb),.16);font-weight:700}
.pc .sw{width:28px;height:28px;border-radius:9px}
.pc svg{flex:none;width:16px;height:16px;fill:currentColor;opacity:.7}
.pc .del{display:none;color:#ff6b6b;opacity:1}
.editing .pc .del{display:block}
.editing .pc .pl-ic{display:none}
.pc.confirm{border-color:#ff6b6b;background:rgba(255,80,80,.18)}
.empty{padding:28px 10px;text-align:center;opacity:.65;font-size:13px}
.ov{position:absolute;inset:0;z-index:4;display:none;flex-direction:column;padding:10px 12px 12px;box-sizing:border-box;
  background:var(--mmp-panel);-webkit-backdrop-filter:blur(20px) saturate(1.3);backdrop-filter:blur(20px) saturate(1.3);border-radius:0 0 var(--ha-card-border-radius,24px) var(--ha-card-border-radius,24px)}
.ov.open{display:flex}
.ov-head{display:flex;align-items:center;gap:6px;margin-bottom:8px;min-height:36px}
.ov-t{font-size:15px;font-weight:700;flex:1;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.ov-search{flex:1;display:flex;align-items:center;gap:6px;height:34px;padding:0 10px;border-radius:999px;background:rgba(var(--mmp-fg-rgb),.1)}
.ov-search svg{width:18px;height:18px;fill:currentColor;opacity:.6}
.ov input[type=text],.ov input[type=number]{background:none;border:0;outline:0;color:inherit;font:inherit;font-size:14px;width:100%;min-width:0}
.field{box-sizing:border-box;display:flex;align-items:center;gap:10px;height:40px;padding:0 12px;border-radius:12px;background:rgba(var(--mmp-fg-rgb),.08);margin-bottom:8px}
.field label{flex:none;font-size:12px;opacity:.65;min-width:70px}
.ov-list{flex:1;overflow-y:auto;scrollbar-width:thin;scrollbar-color:rgba(var(--mmp-fg-rgb),.3) transparent;margin:0 -4px;padding:0 4px}
.oi{display:flex;align-items:center;gap:10px;width:100%;box-sizing:border-box;min-height:38px;padding:4px 10px;border:0;border-radius:10px;background:none;color:inherit;font:inherit;font-size:14px;cursor:pointer;text-align:left}
.oi:hover{background:rgba(var(--mmp-fg-rgb),.1)}
.oi.on{background:rgba(var(--mmp-fg-rgb),.16);font-weight:700}
.oi .grow{flex:1;min-width:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.oi .meta{font-size:12px;opacity:.55;flex:none}
.oi svg{flex:none;width:18px;height:18px;fill:currentColor}
.oi .pbar{width:70px}
.oi .num{flex:none;width:22px;height:22px;border-radius:50%;display:grid;place-items:center;font-size:11px;font-weight:700;border:1px solid rgba(var(--mmp-fg-rgb),.3)}
.oi.picked .num{background:var(--mmp-accent);color:var(--mmp-on-accent);border-color:transparent}
.tgl{flex:none;width:38px;height:22px;border-radius:11px;background:rgba(var(--mmp-fg-rgb),.2);position:relative;transition:background .2s}
.tgl::after{content:'';position:absolute;top:3px;left:3px;width:16px;height:16px;border-radius:50%;background:#fff;transition:transform .2s}
.tgl.on{background:#3ddc84}
.tgl.on::after{transform:translateX(16px)}
.ov-foot{display:flex;gap:8px;margin-top:10px}
.grid2{display:grid;grid-template-columns:1fr 1fr;gap:0 8px}
@container (max-width:460px){
  .wheel-box{width:128px;height:128px}
  .c-wrap{gap:12px}
  .w-tabs button{padding:6px 10px}
  .w-row .lbl{flex-basis:62px}
  .act svg{display:none}
}
@container (max-width:380px){
  .w-tabs button{padding:6px 8px;font-size:12px}
  .w-zone{max-width:38%}
  .sws{grid-template-columns:repeat(5,1fr);gap:5px}
  .sws .swb{width:auto;max-height:22px;justify-self:center}
}
`;

const sliderHtml = (id, cls = '') => `<div class="wsl ${cls}" id="${id}"><div class="rail"><div class="fill"></div></div><div class="knob"></div></div>`;

class MaestroWledCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._tab = 'effects';
    this._zone = 'all';
    this._slot = 0;
    this._expanded = null;
  }

  static getConfigElement() { return document.createElement('maestro-wled-editor'); }
  static getStubConfig(hass) {
    const ids = Object.keys(hass?.states || {}).filter((id) => id.startsWith('light.') && hass.entities?.[id]?.platform === 'wled');
    return { entity: ids.find((id) => hass.states[id].attributes.group_entities) || ids[0] || 'light.wled' };
  }

  setConfig(config) {
    if (!config?.entity) throw new Error('Please define "entity" (a WLED light)');
    this._raw = config;
    this._configure();
  }

  _configure() {
    this._config = { show_zones: true, ...withSettings(this._raw, this._settings, 'wled') };
    if (this._expanded === null) this._expanded = !!this._config.expanded;
    this._tab = this._config.tab || this._tab;
    this._themeKey = null;
    this._build();
    this._reattach();
  }

  set hass(h) {
    this._hass = h;
    if (!this._settingsReq) this._settingsReq = loadSettings(h).then((st) => { if (st) { this._settings = st; this._configure(); } });
    if (this._store) this._store.hass = h;
    else this._reattach();
    if (this._els) this._head();
  }

  connectedCallback() { this._reattach(); }
  disconnectedCallback() { this._detach?.(); this._detach = null; this._store = null; }

  _reattach() {
    if (!this.isConnected || !this._hass || !this._config) return;
    const store = wledStore(this._config.entity);
    if (this._store === store && this._detach) { this._render(); return; }
    this._detach?.();
    this._store = store;
    this._detach = store.attach(this._hass, () => this._render());
  }

  getCardSize() { return this._expanded ? 7 : 3; }
  getGridOptions() { return { columns: 'full', rows: 'auto', min_columns: 6, min_rows: 2 }; }

  get _st() { return this._store?.st; }
  get _palx() { return this._store?.data?.palx || {}; }
  _segsAll() { return (this._st?.seg || []).filter((s) => (s.stop ?? 1) > (s.start ?? 0)); }
  _mainSeg() {
    const segs = this._segsAll();
    if (this._zone !== 'all') return segs.find((s) => s.id === this._zone) || segs[0];
    return segs.find((s) => s.id === this._st?.mainseg) || segs[0];
  }
  _targets() { return this._zone === 'all' ? this._segsAll() : this._segsAll().filter((s) => s.id === this._zone); }
  _segCmd(fn) { this._store.send({ seg: this._targets().map((s) => ({ id: s.id, ...fn(s) })) }); }

  _name() {
    if (this._config.name) return this._config.name;
    const ent = this._hass?.entities?.[this._config.entity];
    const dev = ent?.device_id && this._hass?.devices?.[ent.device_id];
    return dev?.name_by_user || dev?.name || this._hass?.states?.[this._config.entity]?.attributes.friendly_name || 'WLED';
  }

  _build() {
    this.shadowRoot.innerHTML = `
      <style>${STYLE}${W_STYLE}</style>
      <ha-card id="card" class="wled">
        <div class="bg" id="bg"></div><div class="shade"></div>
        <div class="w-main">
          <div class="w-head">
            <div class="w-title">
              <div class="w-top"><div class="w-name" id="name"></div><button class="w-mode" id="chip"><span class="sw" id="chipSw"></span><span id="chipName"></span></button></div>
              <div class="w-line"><span class="w-sub" id="sub"></span><div class="w-bri">${sliderHtml('bri')}<span class="w-pct" id="briPct"></span></div><span class="w-flex"></span>
                <button class="btn xs" id="nl" title="Nightlight">${svg(WP.moon)}</button><button class="btn xs w-exp" id="expand">${svg(P.chevron)}</button></div>
            </div>
            <button class="btn w-pw" id="power">${svg(P.power)}</button>
          </div>
        </div>
        <div class="w-err" id="err" hidden></div>
        <div class="w-x" id="x">
          <div class="w-bar">
            <div class="w-tabs" id="tabs">
              <button data-t="color">Color</button><button data-t="effects">Effects</button><button data-t="presets">Presets</button>
            </div>
            <button class="w-chip w-zone" id="zone"><span id="zoneName">All zones</span>${svg(P.chevron)}</button>
          </div>
          <div id="body"></div>
          <div class="ov" id="ov"></div>
        </div>
      </ha-card>`;
    const $ = (id) => this.shadowRoot.getElementById(id);
    this._els = { card: $('card'), bg: $('bg'), name: $('name'), sub: $('sub'), power: $('power'), bri: $('bri'), briPct: $('briPct'), chip: $('chip'), chipSw: $('chipSw'), chipName: $('chipName'), nl: $('nl'), expand: $('expand'), x: $('x'), tabs: $('tabs'), zone: $('zone'), zoneName: $('zoneName'), body: $('body'), ov: $('ov'), err: $('err') };
    const e = this._els;
    e.power.onclick = () => this._st && this._store.send(this._powerCmd(!this._lit()));
    e.nl.onclick = () => this._st && this._store.send({ nl: { on: !this._st.nl?.on } });
    e.expand.onclick = () => this._setExpanded(!this._expanded);
    e.chip.onclick = () => { this._tab = 'presets'; this._setExpanded(true); };
    e.zone.onclick = () => this._openZones();
    e.tabs.querySelectorAll('button').forEach((b) => { b.onclick = () => { this._tab = b.dataset.t; this._closeOv(); this._renderBody(); }; });
    this._bindSlider(e.bri, (v) => {
      const bri = Math.max(1, Math.round(v * 255));
      e.briPct.textContent = pct(bri);
      this._store.send({ bri, ...(this._st.on && this._segsAll().some((x) => x.on) ? {} : this._powerCmd(true)) });
    });
    this._applyTheme();
    this._setExpanded(this._expanded, true);
  }

  _applyTheme() {
    const name = this._config.theme || 'auto';
    const th = resolveTheme({ ...this._config, theme: name === 'auto' ? 'dark' : name, artwork: false });
    this._theme = th;
    this._auto = name === 'auto';
    this._els.card.style.cssText = th.vars;
    this._els.card.classList.toggle('glass', th.glass);
    this._els.card.classList.toggle('theme-light', th.name === 'light');
  }

  _setExpanded(on, silent) {
    this._expanded = on;
    this._els.card.classList.toggle('exp', on);
    if (!on) this._closeOv();
    if (on) this._renderBody();
    this._els.card.scrollTop = 0;
    requestAnimationFrame(() => { if (this._els) this._els.card.scrollTop = 0; });
    if (!silent) this.dispatchEvent(new Event('iron-resize', { bubbles: true, composed: true }));
  }

  _lit() { return !!this._st?.on && this._segsAll().some((x) => x.on); }

  _powerCmd(on) {
    const segs = this._segsAll();
    if (!on || segs.some((x) => x.on)) return { on };
    return { on, seg: segs.map((x) => ({ id: x.id, on: true })) };
  }

  _bindSlider(el, onMove) {
    el.onpointerdown = (ev) => {
      if (!this._st) return;
      ev.preventDefault();
      el.setPointerCapture(ev.pointerId);
      el.classList.add('drag');
      this._drag = el;
      const r = el.getBoundingClientRect();
      const val = (x) => clamp((x.clientX - r.left) / r.width);
      const move = (x) => { const v = val(x); this._setSlider(el, v, true); onMove(v); };
      move(ev);
      el.onpointermove = move;
      el.onpointerup = el.onpointercancel = (x) => {
        el.onpointermove = el.onpointerup = el.onpointercancel = null;
        el.classList.remove('drag');
        this._drag = null;
        move(x);
      };
    };
  }

  _setSlider(el, v, force) {
    if (!el || (this._drag === el && !force)) return;
    el.querySelector('.fill').style.width = `${v * 100}%`;
    el.querySelector('.knob').style.left = `${v * 100}%`;
  }

  _render() {
    if (!this._els) return;
    const s = this._store;
    const err = !s?.st && s?.error;
    this._els.err.hidden = !err;
    if (err) this._els.err.textContent = s.error;
    this._head();
    if (this._expanded && s?.st) this._refreshBody();
  }

  _head() {
    const st = this._st, e = this._els;
    e.name.textContent = this._name();
    if (!st) { e.sub.textContent = this._store?.error ? 'Unavailable' : 'Connecting…'; e.card.classList.add('off'); if (this._auto) e.card.style.setProperty('--mmp-bg', COLORS.grey.bg); return; }
    const on = this._lit();
    e.card.classList.toggle('off', !on);
    e.power.classList.toggle('on', on);
    const seg = this._segsAll().find((x) => x.id === st.mainseg) || this._segsAll()[0];
    const look = segLook(seg, this._palx);
    e.card.style.setProperty('--w-led', rgb(look.color));
    e.card.style.setProperty('--w-fill', look.grad);
    if (this._auto) e.card.style.setProperty('--mmp-bg', on ? look.grad.replace('90deg', '120deg') : COLORS.grey.bg);
    const fxName = this._store.data?.effects?.[seg?.fx] || '';
    const palName = (this._store.data?.palettes?.[seg?.pal] || '').replace(/^\* /, '');
    const nl = st.nl?.on;
    e.nl.classList.toggle('lit', !!nl);
    e.nl.title = `Nightlight (${st.nl?.dur ?? 60} min)`;
    e.sub.textContent = !on ? 'Off' : nl ? `Nightlight ${st.nl?.rem > 0 ? Math.ceil(st.nl.rem / 60) : st.nl?.dur} min` : 'On';
    e.sub.title = [fxName, seg?.fx ? palName : ''].filter(Boolean).join(' · ');
    this._setSlider(e.bri, (st.bri || 0) / 255);
    if (this._drag !== e.bri) e.briPct.textContent = pct(st.bri || 0);
    const pr = this._store.presets || {};
    const cur = st.pl > 0 ? pr[st.pl] : st.ps > 0 ? pr[st.ps] : null;
    e.chipName.textContent = cur?.n || (st.ps > 0 ? `Preset ${st.ps}` : fxName || 'No preset');
    e.chipSw.style.background = cur ? presetLook(cur, this._palx) : look.grad;
    const segs = this._segsAll();
    e.zone.hidden = !this._config.show_zones || segs.length < 2;
    if (this._zone !== 'all' && !segs.some((x) => x.id === this._zone)) this._zone = 'all';
    e.zoneName.textContent = this._zone === 'all' ? 'All zones' : this._zoneLabel(segs.find((x) => x.id === this._zone));
  }

  _zoneLabel(s) { return s?.n || `Zone ${s.id + 1}`; }

  _renderBody() {
    const e = this._els;
    if (!e || !this._expanded) return;
    e.tabs.querySelectorAll('button').forEach((b) => b.classList.toggle('on', b.dataset.t === this._tab));
    const acts = `<div class="acts"><button class="act" id="savePreset">${svg(WP.save)}Save preset</button><button class="act" id="openPl">${svg(WP.playlist)}Playlist</button>${this._tab === 'presets' ? `<button class="act sm ${this._editing ? 'on' : ''}" id="editPresets" title="Edit">${svg(WP.pencil)}</button>` : ''}</div>`;
    if (this._tab === 'color') {
      e.body.innerHTML = `
        <div class="c-wrap">
          <div class="wheel-box" id="wheel"><div class="cwheel"></div><div class="cmark" id="cmark"></div></div>
          <div class="c-side">
            <div class="sws">${SWATCHES.map((c, i) => `<button class="swb" data-i="${i}" style="background:${rgb(c)}"></button>`).join('')}</div>
            <div class="w-row" id="wRow"><span class="lbl">White</span>${sliderHtml('white')}<span class="w-pct" id="whitePct"></span></div>
            <div class="w-row"><span class="lbl">Level</span>${sliderHtml('level')}<span class="w-pct" id="levelPct"></span></div>
          </div>
        </div>`;
      this._bindColor();
    } else if (this._tab === 'effects') {
      e.body.innerHTML = `
        <div class="dds">
          <button class="dd" id="ddFx"><span class="dd-l">Effect</span><span class="dd-v"><span id="fxName"></span>${svg(P.chevron)}</span></button>
          <button class="dd" id="ddPal"><span class="dd-l">Palette</span><span class="dd-v"><i class="pbar" id="palBar"></i><span id="palName"></span>${svg(P.chevron)}</span></button>
        </div>
        <div class="sliders">
          <div class="w-row"><span class="lbl">Speed</span>${sliderHtml('sx')}<span class="w-pct" id="sxPct"></span></div>
          <div class="w-row"><span class="lbl">Intensity</span>${sliderHtml('ix')}<span class="w-pct" id="ixPct"></span></div>
        </div>${acts}`;
      const $ = (id) => this.shadowRoot.getElementById(id);
      $('ddFx').onclick = () => this._openPicker('fx');
      $('ddPal').onclick = () => this._openPicker('pal');
      for (const k of ['sx', 'ix']) {
        this._bindSlider($(k), (v) => { const val = Math.round(v * 255); $(`${k}Pct`).textContent = pct(val); this._segCmd(() => ({ [k]: val })); });
      }
    } else {
      e.body.innerHTML = `<div class="pgrid ${this._editing ? 'editing' : ''}" id="pgrid"></div>${acts}`;
      this.shadowRoot.getElementById('editPresets').onclick = () => { this._editing = !this._editing; this._confirm = null; this._renderBody(); };
    }
    const sp = this.shadowRoot.getElementById('savePreset');
    if (sp) sp.onclick = () => this._openSave();
    const op = this.shadowRoot.getElementById('openPl');
    if (op) op.onclick = () => this._openPlaylists();
    this._refreshBody(true);
  }

  _bindColor() {
    const $ = (id) => this.shadowRoot.getElementById(id);
    const wheel = $('wheel');
    const setCol = (c) => {
      this._segCmd((s) => {
        const col = (s.col || [[0, 0, 0], [0, 0, 0], [0, 0, 0]]).map((x) => [...x]);
        while (col.length < 3) col.push([0, 0, 0]);
        const w = col[this._slot][3];
        col[this._slot] = [...c.slice(0, 3), ...(w != null ? [c[3] ?? w] : [])];
        return { col };
      });
    };
    wheel.onpointerdown = (ev) => {
      ev.preventDefault();
      wheel.setPointerCapture(ev.pointerId);
      this._drag = wheel;
      const pick = (x) => {
        const r = wheel.getBoundingClientRect();
        const dx = x.clientX - (r.left + r.width / 2), dy = x.clientY - (r.top + r.height / 2);
        const h = (Math.atan2(dx, -dy) * 180 / Math.PI + 360) % 360;
        const sat = clamp(Math.hypot(dx, dy) / (r.width / 2));
        this._placeMark(h, sat);
        setCol(hsv2rgb(h, sat));
      };
      pick(ev);
      wheel.onpointermove = pick;
      wheel.onpointerup = wheel.onpointercancel = (x) => { wheel.onpointermove = wheel.onpointerup = wheel.onpointercancel = null; this._drag = null; pick(x); };
    };
    this.shadowRoot.querySelectorAll('.swb').forEach((b) => { b.onclick = () => setCol(SWATCHES[+b.dataset.i]); });
    this._bindSlider($('white'), (v) => {
      const w = Math.round(v * 255);
      $('whitePct').textContent = pct(w);
      this._segCmd((s) => {
        const col = (s.col || [[0, 0, 0, 0]]).map((x) => [...x]);
        while (col.length <= this._slot) col.push([0, 0, 0, 0]);
        col[this._slot] = [...col[this._slot].slice(0, 3), w];
        return { col };
      });
    });
    this._bindSlider($('level'), (v) => {
      const bri = Math.max(1, Math.round(v * 255));
      $('levelPct').textContent = pct(bri);
      this._segCmd(() => ({ bri, on: true }));
    });
  }

  _placeMark(h, s) {
    const m = this.shadowRoot.getElementById('cmark');
    if (!m) return;
    const a = (h * Math.PI) / 180;
    m.style.left = `${50 + Math.sin(a) * s * 50}%`;
    m.style.top = `${50 - Math.cos(a) * s * 50}%`;
    m.style.background = rgb(hsv2rgb(h, s));
  }

  _refreshBody(force) {
    if (!this._expanded || !this._st) return;
    const $ = (id) => this.shadowRoot.getElementById(id);
    const seg = this._mainSeg();
    const data = this._store.data || {};
    if (this._tab === 'color' && seg) {
      const col = seg.col || [];
      if (this._drag !== $('wheel')) { const hs = rgb2hs(col[this._slot]); this._placeMark(hs.h, hs.s); }
      const hasW = (seg.lc ?? 1) & 2 || (col[0]?.length === 4 && this._store.data?.info?.leds?.rgbw);
      $('wRow').hidden = !hasW;
      const w = col[this._slot]?.[3] ?? 0;
      this._setSlider($('white'), w / 255);
      if (this._drag !== $('white')) $('whitePct').textContent = pct(w);
      this._setSlider($('level'), (seg.bri ?? 255) / 255);
      if (this._drag !== $('level')) $('levelPct').textContent = pct(seg.bri ?? 255);
    } else if (this._tab === 'effects' && seg) {
      $('fxName').textContent = data.effects?.[seg.fx] || `#${seg.fx}`;
      $('palName').textContent = (data.palettes?.[seg.pal] || `#${seg.pal}`).replace(/^\* /, '');
      $('palBar').style.background = palGradient(this._palx[String(seg.pal)], seg.col) || '#666';
      for (const k of ['sx', 'ix']) {
        this._setSlider($(k), (seg[k] ?? 128) / 255);
        if (this._drag !== $(k)) $(`${k}Pct`).textContent = pct(seg[k] ?? 128);
      }
    } else if (this._tab === 'presets') {
      const grid = $('pgrid');
      if (!grid) return;
      const list = presetList(this._store.presets);
      const key = JSON.stringify([list.map((p) => [p.id, p.name]), this._st.ps, this._st.pl, this._editing, this._confirm]);
      if (!force && key === this._pKey) return;
      this._pKey = key;
      grid.classList.toggle('editing', !!this._editing);
      grid.innerHTML = list.length ? list.map((p) => `
        <button class="pc ${(p.id === this._st.ps || p.id === this._st.pl) ? 'on' : ''} ${this._confirm === p.id ? 'confirm' : ''}" data-id="${p.id}" title="${esc(p.name)}">
          <span class="sw" style="background:${presetLook(p.p, this._palx)}"></span><span>${this._confirm === p.id ? 'Delete?' : esc(p.name)}</span>
          ${p.playlist ? `<i class="pl-ic">${svg(WP.playlist)}</i>` : ''}<i class="del">${svg(WP.trash)}</i>
        </button>`).join('') : '<div class="empty">No presets yet. Set up a look and tap “Save preset”.</div>';
      grid.querySelectorAll('.pc').forEach((b) => {
        b.onclick = () => {
          const id = +b.dataset.id;
          if (this._editing) {
            if (this._confirm === id) { this._confirm = null; this._store.command({ pdel: id }, true); }
            else this._confirm = id;
            this._refreshBody(true);
            return;
          }
          this._store.command({ ps: id });
        };
      });
    }
  }

  _ov(html, h = 0) {
    const ov = this._els.ov;
    this._els.x.style.setProperty('--ov-h', `${h}px`);
    ov.innerHTML = html;
    ov.classList.add('open');
    requestAnimationFrame(() => { this._els.card.scrollTop = 0; });
    this._els.x.classList.add('ovopen');
    ov.querySelector('[data-close]')?.addEventListener('click', () => this._closeOv());
    return ov;
  }

  _closeOv() {
    if (!this._els) return;
    this._els.ov.classList.remove('open');
    this._els.ov.innerHTML = '';
    this._els.x.classList.remove('ovopen');
  }

  _openPicker(kind) {
    const data = this._store.data || {};
    const seg = this._mainSeg();
    const names = kind === 'fx' ? data.effects || [] : data.palettes || [];
    const items = names.map((n, id) => ({ id, n: String(n).replace(/^\* /, '') })).filter((x) => x.n && x.n !== 'RSVD' && x.n !== '-');
    if (kind === 'fx') items.sort((a, b) => (a.id === 0 ? -1 : b.id === 0 ? 1 : a.n.localeCompare(b.n)));
    const cur = kind === 'fx' ? seg?.fx : seg?.pal;
    const ov = this._ov(`
      <div class="ov-head">
        <button class="btn sm" data-close>${svg(WP.back)}</button>
        <div class="ov-search">${svg(WP.search)}<input type="text" id="q" placeholder="${kind === 'fx' ? 'Search effects' : 'Search palettes'}"></div>
      </div>
      <div class="ov-list" id="list"></div>`);
    const list = ov.querySelector('#list');
    const draw = (q) => {
      const f = q.trim().toLowerCase();
      list.innerHTML = items.filter((x) => !f || x.n.toLowerCase().includes(f)).map((x) => `
        <button class="oi ${x.id === cur ? 'on' : ''}" data-id="${x.id}">
          ${kind === 'pal' ? `<i class="pbar" style="background:${palGradient(this._palx[String(x.id)], seg?.col) || '#666'}"></i>` : ''}
          <span class="grow">${esc(x.n)}</span>${x.id === cur ? svg(WP.check) : ''}
        </button>`).join('');
      list.querySelectorAll('.oi').forEach((b) => {
        b.onclick = () => { const id = +b.dataset.id; this._segCmd(() => (kind === 'fx' ? { fx: id } : { pal: id })); this._closeOv(); };
      });
    };
    const q = ov.querySelector('#q');
    q.oninput = () => draw(q.value);
    draw('');
    const on = list.querySelector('.oi.on');
    if (on) list.scrollTop = on.offsetTop - list.offsetTop - list.clientHeight / 2 + on.offsetHeight / 2;
  }

  _openZones() {
    if (!this._expanded) this._setExpanded(true);
    const segs = this._segsAll();
    const ov = this._ov(`
      <div class="ov-head"><button class="btn sm" data-close>${svg(WP.back)}</button><div class="ov-t">Zones</div></div>
      <div class="ov-list">
        <button class="oi ${this._zone === 'all' ? 'on' : ''}" data-z="all"><span class="grow">All zones</span><span class="meta">${segs.reduce((n, s) => n + (s.len ?? s.stop - s.start), 0)} LEDs</span></button>
        ${segs.map((s) => `
          <div class="oi ${this._zone === s.id ? 'on' : ''}" data-z="${s.id}">
            <span class="sw" style="width:20px;height:20px;background:${segLook(s, this._palx).grad}"></span>
            <span class="grow">${esc(this._zoneLabel(s))}</span><span class="meta">${s.start}–${s.stop}</span>
            <i class="tgl ${s.on ? 'on' : ''}" data-tgl="${s.id}"></i>
          </div>`).join('')}
      </div>`);
    ov.querySelectorAll('[data-z]').forEach((b) => {
      b.onclick = (ev) => {
        const t = ev.target.closest('[data-tgl]');
        if (t) {
          const id = +t.dataset.tgl, s = segs.find((x) => x.id === id);
          t.classList.toggle('on', !s.on);
          this._store.send({ seg: [{ id, on: !s.on }] });
          return;
        }
        this._zone = b.dataset.z === 'all' ? 'all' : +b.dataset.z;
        this._closeOv();
        this._head();
        this._renderBody();
      };
    });
  }

  _openSave() {
    const pr = this._store.presets || {};
    const curId = this._st?.ps > 0 && pr[this._st.ps]?.n && !pr[this._st.ps].playlist ? this._st.ps : null;
    const slot = freeSlot(pr);
    const ov = this._ov(`
      <div class="ov-head"><button class="btn sm" data-close>${svg(WP.back)}</button><div class="ov-t">Save preset</div></div>
      <div class="field"><label>Name</label><input type="text" id="pn" maxlength="32" value="${esc(curId ? pr[curId].n : `Preset ${slot}`)}"></div>
      <div class="ov-list">
        ${curId ? `<button class="oi" data-opt="over"><span class="grow">Update “${esc(pr[curId].n)}”</span><i class="tgl on" id="over"></i></button>` : ''}
        <button class="oi" data-opt="ib"><span class="grow">Include brightness</span><i class="tgl on" id="ib"></i></button>
        <button class="oi" data-opt="sb"><span class="grow">Save zone layout</span><i class="tgl on" id="sb"></i></button>
      </div>
      <div class="ov-foot"><button class="act on" id="doSave">${svg(WP.check)}Save</button></div>`, 280);
    ov.querySelectorAll('[data-opt]').forEach((b) => { b.onclick = () => b.querySelector('.tgl').classList.toggle('on'); });
    const on = (id) => ov.querySelector(`#${id}`)?.classList.contains('on');
    const input = ov.querySelector('#pn');
    input.focus({ preventScroll: true });
    input.select();
    const save = () => {
      const id = curId && on('over') ? curId : slot;
      const n = input.value.trim() || `Preset ${id}`;
      this._store.command({ psave: id, n, ib: !!on('ib'), sb: !!on('sb') }, true).then(() => { this._store.st.ps = id; this._store.emit(); });
      this._closeOv();
    };
    ov.querySelector('#doSave').onclick = save;
    input.onkeydown = (e) => { if (e.key === 'Enter') save(); };
  }

  _openPlaylists() {
    const pr = this._store.presets || {};
    const lists = presetList(pr).filter((p) => p.playlist);
    const running = this._st?.pl;
    const ov = this._ov(`
      <div class="ov-head"><button class="btn sm" data-close>${svg(WP.back)}</button><div class="ov-t">Playlists</div>
        <button class="act sm" id="newPl" title="New playlist">${svg(WP.plus)}</button></div>
      <div class="ov-list">
        ${lists.length ? lists.map((p) => `
          <button class="oi ${p.id === running ? 'on' : ''}" data-id="${p.id}">
            ${svg(p.id === running ? WP.stop : P.play)}<span class="grow">${esc(p.name)}</span>
            <span class="meta">${(p.p.playlist.ps || []).length} presets</span>
          </button>`).join('') : '<div class="empty">No playlists yet. Tap + to make one from your presets.</div>'}
      </div>`);
    ov.querySelector('#newPl').onclick = () => this._openNewPlaylist();
    ov.querySelectorAll('[data-id]').forEach((b) => {
      b.onclick = () => {
        const id = +b.dataset.id;
        if (id === running) {
          const seg = this._segsAll().find((x) => x.id === this._st.mainseg) || this._segsAll()[0];
          this._store.command(this._st.ps > 0 && this._st.ps !== id ? { ps: this._st.ps } : { seg: [{ id: seg.id, fx: seg.fx }] });
        } else this._store.command({ ps: id });
        this._closeOv();
      };
    });
  }

  _openNewPlaylist() {
    const pr = this._store.presets || {};
    const presets = presetList(pr).filter((p) => !p.playlist);
    const picked = [];
    const slot = freeSlot(pr);
    const ov = this._ov(`
      <div class="ov-head"><button class="btn sm" id="plBack">${svg(WP.back)}</button><div class="ov-t">New playlist</div></div>
      <div class="field"><label>Name</label><input type="text" id="pln" maxlength="32" value="Playlist ${slot}"></div>
      <div class="grid2">
        <div class="field"><label>Each, sec</label><input type="number" id="pld" min="1" max="6500" value="30"></div>
        <div class="field"><label>Fade, sec</label><input type="number" id="plt" min="0" max="60" step="0.1" value="0.7"></div>
        <div class="field"><label>Repeat</label><input type="number" id="plr" min="0" max="127" value="0" title="0 = forever"></div>
        <button class="oi field" id="plShuf"><span class="grow">Shuffle</span><i class="tgl"></i></button>
      </div>
      <div class="ov-list" id="plList">${presets.length ? presets.map((p) => `
        <button class="oi" data-id="${p.id}"><span class="num"></span><span class="sw" style="width:20px;height:20px;background:${presetLook(p.p, this._palx)}"></span><span class="grow">${esc(p.name)}</span></button>`).join('') : '<div class="empty">Save a few presets first.</div>'}
      </div>
      <div class="ov-foot"><button class="act on" id="plSave">${svg(WP.check)}Save playlist</button></div>`, 440);
    ov.querySelector('#plBack').onclick = () => this._openPlaylists();
    ov.querySelector('#plShuf').onclick = (e) => e.currentTarget.querySelector('.tgl').classList.toggle('on');
    const draw = () => ov.querySelectorAll('#plList .oi').forEach((b) => {
      const i = picked.indexOf(+b.dataset.id);
      b.classList.toggle('picked', i >= 0);
      b.querySelector('.num').textContent = i >= 0 ? i + 1 : '';
    });
    ov.querySelectorAll('#plList .oi').forEach((b) => {
      b.onclick = () => { const id = +b.dataset.id, i = picked.indexOf(id); if (i >= 0) picked.splice(i, 1); else picked.push(id); draw(); };
    });
    ov.querySelector('#plSave').onclick = () => {
      if (!picked.length) { ov.querySelector('#plList').animate([{ transform: 'translateX(-6px)' }, { transform: 'translateX(6px)' }, { transform: 'none' }], 240); return; }
      const num = (id, d) => { const v = parseFloat(ov.querySelector(id).value); return Number.isFinite(v) ? v : d; };
      const dur = Math.round(clamp(num('#pld', 30), 1, 6500) * 10);
      const tr = Math.round(clamp(num('#plt', 0.7), 0, 60) * 10);
      const n = ov.querySelector('#pln').value.trim() || `Playlist ${slot}`;
      this._store.command({
        psave: slot, n, o: true, on: true,
        playlist: { ps: picked, dur: picked.map(() => dur), transition: picked.map(() => tr), repeat: Math.round(clamp(num('#plr', 0), 0, 127)), r: ov.querySelector('#plShuf .tgl').classList.contains('on'), end: 0 },
      }, true);
      this._closeOv();
    };
  }
}

const W_BADGE_STYLE = `
:host{display:inline-block}
.b{display:flex;align-items:center;gap:7px;height:36px;padding:0 12px 0 5px;box-sizing:border-box;border-radius:18px;cursor:pointer;
  color:var(--mmp-fg);background:var(--mmp-card-bg);border:1px solid rgba(var(--mmp-fg-rgb),.18);font-family:var(--ha-font-family-body,inherit);user-select:none}
.b.glass{-webkit-backdrop-filter:blur(16px) saturate(1.5);backdrop-filter:blur(16px) saturate(1.5)}
.dot{width:26px;height:26px;border-radius:50%;background:var(--g,#666);box-shadow:0 0 10px -1px var(--c,transparent),inset 0 0 0 1px rgba(255,255,255,.25)}
.off .dot{background:rgba(var(--mmp-fg-rgb),.18);box-shadow:inset 0 0 0 1px rgba(255,255,255,.2)}
.n{font-size:13px;font-weight:600;max-width:120px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.v{font-size:12px;opacity:.65;font-variant-numeric:tabular-nums}
`;

class MaestroWledBadge extends HTMLElement {
  constructor() { super(); this.attachShadow({ mode: 'open' }); }
  static getConfigElement() { const e = document.createElement('maestro-wled-editor'); e.badge = true; return e; }
  static getStubConfig(hass) { return MaestroWledCard.getStubConfig(hass); }
  setConfig(c) {
    if (!c?.entity) throw new Error('Please define "entity" (a WLED light)');
    this._raw = c;
    this._config = withSettings({ ...c }, null, 'wled');
    const name = c.theme && c.theme !== 'auto' ? c.theme : 'dark';
    const th = resolveTheme({ ...c, theme: name, artwork: false });
    this.shadowRoot.innerHTML = `<style>${W_BADGE_STYLE}</style><div class="b off" id="b" style="${th.vars}"><span class="dot" id="dot"></span><span class="n" id="n"></span><span class="v" id="v"></span></div>`;
    this._b = this.shadowRoot.getElementById('b');
    this._b.classList.toggle('glass', th.glass);
    this._b.onclick = (e) => {
      if (e.composedPath().some((x) => x.id === 'dot')) { const st = this._store?.st; if (st) { const segs = (st.seg || []).filter((x) => (x.stop ?? 1) > (x.start ?? 0)); const lit = st.on && segs.some((x) => x.on); this._store.send(lit ? { on: false } : segs.some((x) => x.on) ? { on: true } : { on: true, seg: segs.map((x) => ({ id: x.id, on: true })) }); } return; }
      this._openPopup();
    };
    this._attach();
  }
  set hass(h) {
    this._hass = h;
    if (this._store) this._store.hass = h; else this._attach();
    if (this._popup) this._popup.card.hass = h;
  }
  connectedCallback() { this._attach(); }
  disconnectedCallback() { this._detach?.(); this._detach = null; this._store = null; this._popup?.close(); }
  _attach() {
    if (!this.isConnected || !this._hass || !this._config || this._detach) return;
    this._store = wledStore(this._config.entity);
    this._detach = this._store.attach(this._hass, () => this._update());
  }
  _update() {
    const st = this._store?.st, $ = (id) => this.shadowRoot.getElementById(id);
    const ent = this._hass?.entities?.[this._config.entity];
    const dev = ent?.device_id && this._hass?.devices?.[ent.device_id];
    $('n').textContent = this._config.name || dev?.name_by_user || dev?.name || 'WLED';
    if (!st) { $('v').textContent = '—'; return; }
    const segs = (st.seg || []).filter((s) => (s.stop ?? 1) > (s.start ?? 0));
    const look = segLook(segs.find((s) => s.id === st.mainseg) || segs[0], this._store.data?.palx);
    const lit = st.on && segs.some((x) => x.on);
    this._b.classList.toggle('off', !lit);
    this._b.style.setProperty('--g', look.grad.replace('90deg', '135deg'));
    this._b.style.setProperty('--c', rgb(look.color));
    $('v').textContent = lit ? pct(st.bri || 0) : 'Off';
  }
  _openPopup() { openPopup(this, 'maestro-wled-card', { ...this._raw, expanded: true }); }

}

const WLED_TEXT = {
  entity: 'WLED light', name: 'Name', expanded: 'Open expanded', tab: 'Start tab', show_zones: 'Zone selector',
  theme: 'Color scheme', custom_background: 'Background color', custom_accent: 'Accent color', custom_text: 'Text color',
  g_look: 'Appearance', h_entity: 'Any light of the WLED device; the whole device is controlled.',
};

class MaestroWledEditor extends HTMLElement {
  setConfig(config) { this._config = config; this._render(); }
  set hass(hass) { this._hass = hass; this._render(); }

  _schema(d) {
    const look = [
      { name: 'theme', selector: { select: { mode: 'dropdown', options: [{ value: 'auto', label: 'By LED colors' }, ...THEME_NAMES.map((v) => ({ value: v, label: THEME_LABELS[v] }))] } } },
      ...(d.theme === 'custom' ? [{ type: 'grid', name: 'g_custom', flatten: true, schema: [
        { name: 'custom_background', selector: { color_rgb: {} } },
        { name: 'custom_accent', selector: { color_rgb: {} } },
        { name: 'custom_text', selector: { color_rgb: {} } },
      ] }] : []),
    ];
    return [
      { name: 'entity', required: true, selector: { entity: { filter: [{ domain: 'light', integration: 'wled' }] } } },
      { name: 'name', selector: { text: {} } },
      ...(this.badge ? [] : [
        { type: 'grid', name: 'g_view', flatten: true, schema: [
          { name: 'expanded', selector: { boolean: {} } },
          { name: 'show_zones', selector: { boolean: {} } },
        ] },
        { name: 'tab', selector: { select: { mode: 'box', options: [{ value: 'color', label: 'Color' }, { value: 'effects', label: 'Effects' }, { value: 'presets', label: 'Presets' }] } } },
      ]),
      { type: 'expandable', name: 'g_look', flatten: true, icon: 'mdi:palette', schema: look },
    ];
  }

  _render() {
    if (!this._hass || !this._config) return;
    if (!this._form) {
      this._form = document.createElement('ha-form');
      this._form.computeLabel = (s) => WLED_TEXT[s.name] || s.name;
      this._form.computeHelper = (s) => WLED_TEXT[`h_${s.name}`];
      this._form.addEventListener('value-changed', (e) => this._changed(e.detail.value));
      this.appendChild(this._form);
    }
    const d = { theme: 'auto', expanded: false, show_zones: true, tab: 'effects', ...this._config };
    if (d.theme === 'custom') { d.custom_background ??= [28, 34, 51]; d.custom_accent ??= [120, 190, 255]; d.custom_text ??= [255, 255, 255]; }
    this._form.hass = this._hass;
    this._form.schema = this._schema(d);
    this._form.data = d;
  }

  _changed(v) {
    const out = { type: this._config.type };
    for (const [k, val] of Object.entries(v)) {
      if (k === 'type' || val === '' || val == null) continue;
      if ((k === 'theme' && val === 'auto') || (k === 'expanded' && val === false) || (k === 'show_zones' && val === true) || (k === 'tab' && val === 'effects')) continue;
      if (k.startsWith('custom_') && v.theme !== 'custom') continue;
      out[k] = val;
    }
    this._config = out;
    this.dispatchEvent(new CustomEvent('config-changed', { detail: { config: out }, bubbles: true, composed: true }));
  }
}

window.customBadges = window.customBadges || [];
window.customCards = window.customCards || [];
if (!customElements.get('maestro-wled-card')) customElements.define('maestro-wled-card', MaestroWledCard);
if (!customElements.get('maestro-wled-editor')) customElements.define('maestro-wled-editor', MaestroWledEditor);
if (!customElements.get('maestro-wled-badge')) customElements.define('maestro-wled-badge', MaestroWledBadge);
if (!window.customBadges.some((b) => b.type === 'maestro-wled-badge')) {
  window.customBadges.push({ type: 'maestro-wled-badge', name: 'MAestro WLED (badge)', description: 'Tiny pill for a WLED strip.', preview: true });
}
if (!window.customCards.some((c) => c.type === 'maestro-wled-card')) {
  window.customCards.push({ type: 'maestro-wled-card', name: 'MAestro WLED', description: 'WLED control in the MAestro style: power, brightness, colors, effects, palettes, zones, presets and playlists.', preview: true });
}
