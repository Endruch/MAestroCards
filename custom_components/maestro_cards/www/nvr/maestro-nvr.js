import { esc, clamp, P } from '../core/maestro-core.js?v=1.5.3';

const I = {
  left: 'M15.41,16.58L10.83,12L15.41,7.41L14,6L8,12L14,18L15.41,16.58Z',
  right: 'M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z',
  chevron: 'M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z',
  up: 'M7.41,15.41L12,10.83L16.59,15.41L18,14L12,8L6,14L7.41,15.41Z',
  g1: 'M4,5H20A1,1 0 0,1 21,6V18A1,1 0 0,1 20,19H4A1,1 0 0,1 3,18V6A1,1 0 0,1 4,5M5,7V17H19V7H5Z',
  g4: 'M3,5H11V11H3V5M13,5H21V11H13V5M3,13H11V19H3V13M13,13H21V19H13V13M5,7V9H9V7H5M15,7V9H19V7H15M5,15V17H9V15H5M15,15V17H19V15H15Z',
  g9: 'M3,4H8V9H3V4M9.5,4H14.5V9H9.5V4M16,4H21V9H16V4M3,10H8V14H3V10M9.5,10H14.5V14H9.5V10M16,10H21V14H16V10M3,15H8V20H3V15M9.5,15H14.5V20H9.5V15M16,15H21V20H16V15Z',
  bird: 'M3,4H21V20H3V4M5,6V18H19V6H5M7,8H11V12H7V8M13,8H17V10H13V8M13,12H17V16H13V12M7,14H11V16H7V14Z',
  rec: 'M18,4L20,8H17L15,4H13L15,8H12L10,4H8L10,8H7L5,4H4A2,2 0 0,0 2,6V18A2,2 0 0,0 4,20H20A2,2 0 0,0 22,18V4H18Z',
  check: 'M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z',
  play: 'M8,5.14V19.14L19,12.14L8,5.14Z',
  pause: 'M14,19H18V5H14M6,19H10V5H6V19Z',
  stop: 'M18,18H6V6H18V18Z',
  back: 'M10,9V5L3,12L10,19V14.9C15,14.9 18.5,16.5 21,20C20,15 17,10 10,9Z',
  cal: 'M19,19H5V8H19M16,1V3H8V1H6V3H5C3.89,3 3,3.89 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5C21,3.89 20.1,3 19,3H18V1M17,12H12V17H17V12Z',
  clock: 'M12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22C6.47,22 2,17.5 2,12A10,10 0 0,1 12,2M12.5,7V12.25L17,14.92L16.25,16.15L11,13V7H12.5Z',
  dl: 'M5,20H19V18H5M19,9H15V3H9V9H5L12,16L19,9Z',
};
const svg = (d, cls = '') => `<svg class="${cls}" viewBox="0 0 24 24"><path d="${d}"/></svg>`;
const LAYOUTS = [['1', 'g1', 1], ['4', 'g4', 4], ['9', 'g9', 9], ['birdseye', 'bird', 1]];
const SPEEDS = [0.5, 1, 2, 4, 8];
const SPANS = [[3600, '1h'], [10800, '3h'], [21600, '6h'], [43200, '12h'], [86400, '24h']];
const parse = (r) => (typeof r === 'string' ? JSON.parse(r) : r);
const pad = (n) => String(n).padStart(2, '0');
const hm = (t) => { const d = new Date(t * 1000); return `${pad(d.getHours())}:${pad(d.getMinutes())}`; };
const hms = (t) => { const d = new Date(t * 1000); return `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`; };
const ymd = (t) => { const d = new Date(t * 1000); return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`; };

const BIRD = new Map();
let JSMPEG_P = null;
function loadJsmpeg() {
  if (window.JSMpeg) return Promise.resolve(window.JSMpeg);
  if (!JSMPEG_P) {
    JSMPEG_P = new Promise((res, rej) => {
      const s = document.createElement('script');
      s.src = new URL('./jsmpeg.min.js', import.meta.url).href;
      s.onload = () => res(window.JSMpeg);
      s.onerror = () => { JSMPEG_P = null; rej(new Error('JSMpeg failed to load')); };
      document.head.appendChild(s);
    });
  }
  return JSMPEG_P;
}

const N_STYLE = `
:host{display:block}
ha-card{display:block;position:relative;overflow:hidden;border-radius:var(--ha-card-border-radius,20px);background:#05070d;border:1px solid rgba(255,255,255,.12);
  color:#fff;font-family:var(--ha-font-family-body,inherit);user-select:none;-webkit-user-select:none;-webkit-tap-highlight-color:transparent}
.stage{position:relative;aspect-ratio:var(--ar,16/9);width:100%;overflow:hidden;touch-action:pan-y}
.grid{position:absolute;inset:0;display:grid;gap:2px;background:#000;transition:transform .3s ease}
.tile{position:relative;overflow:hidden;background:#0b0e16 center/cover no-repeat;cursor:pointer}
.tile canvas,.tile img.live{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;display:block}
.tile .ph{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;filter:saturate(.8) brightness(.8)}
.lbl{position:absolute;left:8px;top:8px;z-index:2;max-width:70%;padding:3px 9px;border-radius:8px;font-size:13px;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;
  background:rgba(10,12,20,.62);-webkit-backdrop-filter:blur(8px);backdrop-filter:blur(8px)}
.nolbl .lbl{display:none}
.g4 .lbl,.g9 .lbl{font-size:12px;padding:2px 7px;left:6px;top:6px}
.live-b{position:absolute;right:10px;top:10px;z-index:2;display:flex;align-items:center;gap:6px;padding:3px 10px;border-radius:8px;font-size:13px;font-weight:700;letter-spacing:.04em;
  background:rgba(10,12,20,.62);-webkit-backdrop-filter:blur(8px);backdrop-filter:blur(8px)}
.live-b i{width:8px;height:8px;border-radius:50%;background:#3ddc84;box-shadow:0 0 8px #3ddc84}
.snd{position:absolute;right:10px;top:44px;z-index:3;width:34px;height:34px;border-radius:50%;display:grid;place-items:center;color:#fff;cursor:pointer;padding:0}
.snd svg{width:20px;height:20px;fill:currentColor}
.snd.on{background:rgba(40,110,255,.85)}
.off{position:absolute;inset:0;display:grid;place-items:center;font-size:13px;opacity:.7}
.ui{position:absolute;inset:0;z-index:5;pointer-events:none;opacity:0;transition:opacity .25s}
.show .ui,.ui.pin{opacity:1}
.show .ui>*,.ui.pin>*{pointer-events:auto}
.glass{background:rgba(14,18,30,.72);-webkit-backdrop-filter:blur(14px) saturate(1.3);backdrop-filter:blur(14px) saturate(1.3);border:1px solid rgba(255,255,255,.14)}
.side{position:absolute;top:50%;width:44px;height:44px;margin-top:-22px;border-radius:50%;display:grid;place-items:center;cursor:pointer;color:#fff;padding:0}
.side svg{width:28px;height:28px;fill:currentColor}
.side.l{left:12px}.side.r{right:12px}
.bar{position:absolute;left:50%;bottom:14px;transform:translateX(-50%);display:flex;align-items:center;gap:10px;white-space:nowrap}
.pill{display:flex;align-items:center;gap:8px;height:40px;padding:0 14px;border-radius:12px;color:#fff;font:inherit;font-size:14px;font-weight:600;cursor:pointer}
.pill svg{width:20px;height:20px;fill:currentColor}
.pill.on{background:rgba(40,110,255,.85);border-color:rgba(140,180,255,.6)}
.pager{display:flex;align-items:center;gap:4px;height:40px;padding:0 6px;border-radius:12px}
.pager button{width:32px;height:32px;border:0;border-radius:8px;background:none;color:#fff;cursor:pointer;display:grid;place-items:center;padding:0}
.pager button:hover{background:rgba(255,255,255,.12)}
.pager button svg{width:22px;height:22px;fill:currentColor}
.pager span{min-width:44px;text-align:center;font-size:14px;font-weight:600;font-variant-numeric:tabular-nums}
.menu{position:absolute;bottom:62px;min-width:170px;padding:6px;border-radius:14px;display:none}
.menu.open{display:block}
.mi{display:flex;align-items:center;gap:12px;width:100%;height:38px;padding:0 10px;border:0;border-radius:9px;background:none;color:#fff;font:inherit;font-size:14px;font-weight:600;cursor:pointer;text-align:left}
.mi:hover{background:rgba(255,255,255,.1)}
.mi.on{background:rgba(40,110,255,.85)}
.mi svg{width:20px;height:20px;fill:currentColor}
.mi .ck{margin-left:auto}
.rec{position:absolute;inset:0;z-index:6;display:none;background:#000}
.recmode .rec{display:block}
.recmode .grid,.recmode .ui{display:none}
.rv{position:absolute;inset:0;width:100%;height:100%}
.rv ha-hls-player,.rv video{width:100%;height:100%;display:block;object-fit:cover;background:#000;--video-max-height:100%}
.rmsg{position:absolute;inset:0;display:grid;place-items:center;font-size:14px;opacity:.75;pointer-events:none}
.rtop{position:absolute;left:12px;right:12px;top:12px;display:flex;gap:8px;align-items:center;flex-wrap:wrap}
.rtop .sp{flex:1}
.rtop .pill{height:36px;padding:0 12px;font-size:13px;position:relative}
.rtop input{position:absolute;left:0;bottom:0;width:100%;height:100%;opacity:0;pointer-events:none;color-scheme:dark;border:0;padding:0}
.rec .glass{background:rgba(10,14,24,.4);-webkit-backdrop-filter:blur(8px) saturate(1.2);backdrop-filter:blur(8px) saturate(1.2);border-color:rgba(255,255,255,.12)}
.rtop,.rbot{transition:opacity .3s}
.rec.idle .rtop,.rec.idle .rbot{opacity:0;pointer-events:none}
.rec.idle{cursor:none}
.rbot{position:absolute;left:10px;right:10px;bottom:10px;padding:6px 8px;border-radius:14px}
.rctl{display:flex;align-items:center;gap:8px}
.rbtn{width:32px;height:30px;flex:none;border:0;border-radius:8px;display:grid;place-items:center;color:#fff;cursor:pointer;background:rgba(255,255,255,.12);padding:0}
.rbtn.prim{background:rgba(40,110,255,.85)}
.rbtn svg{width:18px;height:18px;fill:currentColor}
.rt{flex:none;font-size:13px;font-weight:600;font-variant-numeric:tabular-nums;min-width:62px}
.rctl .pill{flex:none;height:30px;padding:0 8px;gap:4px;font-size:12px;border-radius:8px;position:relative}
.rctl .pill svg{width:16px;height:16px}
.tl{position:relative;flex:1;min-width:80px;height:30px;cursor:pointer;touch-action:none}
.track{position:absolute;left:0;right:0;top:4px;height:8px;border-radius:4px;background:rgba(255,255,255,.14);overflow:hidden}
.seg{position:absolute;top:0;bottom:0;background:linear-gradient(90deg,#2b6bff,#4d8dff)}
.evm{position:absolute;top:2px;width:3px;height:12px;margin-left:-1.5px;border-radius:2px;background:#ffad33;box-shadow:0 0 5px rgba(255,173,51,.7)}
.cur{position:absolute;top:-1px;width:2px;height:18px;margin-left:-1px;background:#fff;box-shadow:0 0 5px rgba(0,0,0,.6)}
.cur::after{content:'';position:absolute;left:-5px;top:2px;width:12px;height:12px;border-radius:50%;background:#fff}
.ticks{position:absolute;left:0;right:0;top:16px;height:13px;font-size:10px;opacity:.7}
.ticks span{position:absolute;transform:translateX(-50%);font-variant-numeric:tabular-nums}
.ticks span:first-child{transform:none}.ticks span:last-child{transform:translateX(-100%)}
.prev{position:absolute;bottom:34px;width:150px;margin-left:-75px;border-radius:10px;overflow:hidden;display:none;pointer-events:none}
.prev img{width:100%;aspect-ratio:16/9;object-fit:cover;display:block;background:#111}
.prev div{text-align:center;font-size:12px;font-weight:700;padding:3px 0}
.prev.on{display:block}
.drop{position:absolute;z-index:9;min-width:160px;max-height:220px;overflow-y:auto;padding:6px;border-radius:12px;display:none;scrollbar-width:thin}
.drop.open{display:block}
.drop .mi{height:34px;font-size:13px}
.drop .mi small{margin-left:auto;opacity:.6;font-weight:500}
.nav{width:24px;height:30px;border:0;border-radius:7px;background:rgba(255,255,255,.1);color:#fff;display:grid;place-items:center;cursor:pointer;padding:0;flex:none}
.nav svg{width:18px;height:18px;fill:currentColor}
@container (max-width:560px){
  .pill span.t{display:none}
  .rtop .pill{padding:0 9px}
  .rt,#stopB{display:none}
  .rctl .pill span.t{display:none}
  .side{width:36px;height:36px;margin-top:-18px}
}
`;

class MaestroNvrCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._layout = null;
    this._page = 0;
    this._focus = null;
    this._players = new Map();
    this._rec = null;
  }

  static getConfigElement() { return document.createElement('maestro-nvr-editor'); }
  static getStubConfig(hass) {
    const all = Object.keys(hass?.states || {}).filter((id) => id.startsWith('camera.'));
    const frig = all.filter((id) => hass.states[id].attributes.camera_name && hass.states[id].attributes.client_id);
    return { cameras: (frig.length ? frig : all).slice(0, 9) };
  }

  setConfig(c) {
    if (!c?.cameras?.length && !c?.camera) throw new Error('Please add cameras');
    this._config = { live: 'jsmpeg', ...c, cameras: c.cameras?.length ? c.cameras : [c.camera] };
    const auto = String(this._config.cameras.length >= 5 ? 9 : this._config.cameras.length >= 2 ? 4 : 1);
    this._layout = this._layout || (LAYOUTS.some((l) => l[0] === String(c.layout)) ? String(c.layout) : auto);
    this._built = false;
    if (this._hass) this._build();
  }

  set hass(h) {
    this._hass = h;
    if (!this._config) return;
    if (!this._built) this._build();
    else this._refreshLabels();
  }

  connectedCallback() {
    if (this._hass && this._config && !this._built) this._build();
    else if (this._built) this._renderGrid();
  }
  disconnectedCallback() { this._stopAll(); this._closeRec(true); }

  getCardSize() { return 6; }
  getGridOptions() { return { columns: 'full', rows: 'auto', min_columns: 6 }; }

  _cams() { return this._config.cameras.filter((id) => this._hass.states[id]); }
  _info(id) { const a = this._hass.states[id]?.attributes || {}; return { name: a.camera_name || id.split('.')[1], inst: a.client_id || 'frigate', title: this._config.names?.[id] || a.friendly_name || id, token: a.access_token, frigate: !!(a.camera_name && a.client_id) }; }
  _recCams() { return this._cams().filter((id) => this._info(id).frigate); }
  _hasBirdseye() { return this._config.birdseye !== false && this._birdOk === true; }
  _probeBird() {
    const f = this._recCams()[0];
    if (!f) return Promise.resolve(false);
    const inst = this._info(f).inst;
    if (!BIRD.has(inst)) {
      BIRD.set(inst, (async () => {
        try {
          const sp = await this._hass.callWS({ type: 'auth/sign_path', path: `/api/frigate/${inst}/jsmpeg/birdseye`, expires: 60 });
          return await new Promise((res) => {
            const ws = new WebSocket(`${location.origin.replace(/^http/, 'ws')}${sp.path}`);
            ws.binaryType = 'arraybuffer';
            const t = setTimeout(() => { ws.close(); res(false); }, 5000);
            ws.onmessage = () => { clearTimeout(t); ws.close(); res(true); };
            ws.onerror = () => { clearTimeout(t); res(false); };
          });
        } catch (_) { return false; }
      })());
    }
    return BIRD.get(inst);
  }
  _perPage() { return LAYOUTS.find((l) => l[0] === this._layout)?.[2] || 1; }
  _pages() { return this._layout === 'birdseye' ? 1 : Math.max(1, Math.ceil(this._cams().length / this._perPage())); }

  _build() {
    this._built = true;
    this._stopAll();
    this._closeRec(true);
    this._gridKey = null;
    this.shadowRoot.innerHTML = `<style>${N_STYLE}</style>
      <ha-card id="card" class="${this._config.show_names === false ? 'nolbl' : ''}" style="container-type:inline-size;${this._config.aspect_ratio ? `--ar:${esc(this._config.aspect_ratio)}` : ''}">
        <div class="stage" id="stage">
          <div class="grid" id="grid"></div>
          <div class="ui" id="ui">
            <button class="side l glass" id="prevP">${svg(I.left)}</button>
            <button class="side r glass" id="nextP">${svg(I.right)}</button>
            <div class="bar">
              <div style="position:relative">
                <button class="pill glass" id="layBtn">${svg(I.g9)}${svg(I.up)}</button>
                <div class="menu glass" id="layMenu"></div>
              </div>
              <div class="pager glass" id="pager"><button id="pPrev">${svg(I.left)}</button><span id="pNum">1 / 1</span><button id="pNext">${svg(I.right)}</button></div>
              <button class="pill glass" id="recBtn">${svg(I.rec)}<span class="t">Recordings</span></button>
            </div>
          </div>
          <div class="rec" id="rec"></div>
        </div>
      </ha-card>`;
    const $ = (id) => this.shadowRoot.getElementById(id);
    this._els = { card: $('card'), stage: $('stage'), grid: $('grid'), ui: $('ui'), layBtn: $('layBtn'), layMenu: $('layMenu'), pNum: $('pNum'), pager: $('pager'), prevP: $('prevP'), nextP: $('nextP'), rec: $('rec') };
    const e = this._els;
    const go = (d) => { this._page = (this._page + d + this._pages()) % this._pages(); this._focus = null; this._renderGrid(); };
    $('pPrev').onclick = () => go(-1); $('pNext').onclick = () => go(1); e.prevP.onclick = () => go(-1); e.nextP.onclick = () => go(1);
    e.layBtn.onclick = (ev) => { ev.stopPropagation(); this._renderLayoutMenu(); e.layMenu.classList.toggle('open'); this._pin(true); };
    $('recBtn').onclick = () => { const f = this._focus || this._pageCams()[0]; this._openRec(this._info(f || '').frigate ? f : this._recCams()[0]); };
    this._els.recBtn = $('recBtn');
    this._bindStage();
    this._renderGrid();
    if (this._config.birdseye !== false) this._probeBird().then((ok) => { this._birdOk = ok; if (!ok && this._layout === 'birdseye') { this._layout = '1'; this._renderGrid(); } });
  }

  _pin(on) {
    clearTimeout(this._hideT);
    this._els.ui.classList.toggle('pin', on);
    if (!on) this._els.layMenu.classList.remove('open');
  }

  _bindStage() {
    const e = this._els;
    const show = () => { e.stage.classList.add('show'); clearTimeout(this._idleT); this._idleT = setTimeout(() => { if (!e.ui.classList.contains('pin')) e.stage.classList.remove('show'); }, 2800); };
    e.stage.addEventListener('mousemove', show);
    e.stage.addEventListener('mouseleave', () => { if (!e.ui.classList.contains('pin')) e.stage.classList.remove('show'); });
    let sx = null, sy = null, moved = false;
    e.stage.addEventListener('pointerdown', (ev) => { sx = ev.clientX; sy = ev.clientY; moved = false; });
    e.stage.addEventListener('pointermove', (ev) => { if (sx != null && Math.abs(ev.clientX - sx) > 10) moved = true; });
    e.stage.addEventListener('pointerup', (ev) => {
      if (sx == null || this._rec) { sx = null; return; }
      const dx = ev.clientX - sx, dy = ev.clientY - sy;
      sx = null;
      if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.5 && this._pages() > 1) {
        this._page = (this._page + (dx < 0 ? 1 : -1) + this._pages()) % this._pages();
        this._focus = null;
        this._renderGrid();
        return;
      }
      if (!moved && ev.pointerType !== 'mouse' && !ev.target.closest('.ui>*')) { if (e.stage.classList.contains('show')) e.stage.classList.remove('show'); else show(); }
    });
    this.shadowRoot.addEventListener('click', (ev) => { if (!ev.composedPath().some((x) => x === e.layMenu || x === e.layBtn)) this._pin(false); });
  }

  _renderLayoutMenu() {
    const e = this._els;
    const opts = LAYOUTS.filter((l) => l[0] !== 'birdseye' || this._hasBirdseye());
    e.layMenu.innerHTML = opts.map(([k, ic]) => `<button class="mi ${this._layout === k && !this._focus ? 'on' : ''}" data-l="${k}">${svg(I[ic])}<span>${k === 'birdseye' ? 'Birdseye' : k}</span>${this._layout === k && !this._focus ? svg(I.check, 'ck') : ''}</button>`).join('');
    e.layMenu.querySelectorAll('[data-l]').forEach((b) => {
      b.onclick = (ev) => { ev.stopPropagation(); this._layout = b.dataset.l; this._page = 0; this._focus = null; this._pin(false); this._renderGrid(); };
    });
  }

  _pageCams() {
    if (this._focus) return [this._focus];
    if (this._layout === 'birdseye') return ['birdseye'];
    const n = this._perPage(), cams = this._cams();
    return cams.slice(this._page * n, this._page * n + n);
  }

  _renderGrid() {
    const e = this._els;
    if (!e || !this._hass) return;
    const n = this._focus ? 1 : this._perPage();
    const cols = Math.sqrt(n) | 0 || 1;
    const cams = this._pageCams();
    const key = `${n}|${cams.join(',')}`;
    e.layBtn.innerHTML = `${svg(I[this._focus ? 'g1' : (LAYOUTS.find((l) => l[0] === this._layout)?.[1] || 'g1')])}${svg(I.up)}`;
    const pages = this._pages();
    e.pNum.textContent = `${this._page + 1} / ${pages}`;
    e.pager.style.display = pages > 1 && !this._focus ? '' : 'none';
    e.prevP.style.display = e.nextP.style.display = pages > 1 && !this._focus ? '' : 'none';
    if (e.recBtn) e.recBtn.style.display = this._recCams().length ? '' : 'none';
    if (key === this._gridKey) return;
    this._gridKey = key;
    this._stopAll();
    e.grid.className = `grid g${n}`;
    e.grid.style.gridTemplateColumns = `repeat(${cols},1fr)`;
    e.grid.style.gridTemplateRows = `repeat(${cols},1fr)`;
    e.grid.innerHTML = '';
    for (let i = 0; i < n; i++) {
      const id = cams[i];
      const tile = document.createElement('div');
      tile.className = 'tile';
      if (id) {
        const bird = id === 'birdseye';
        const info = bird ? { title: 'Birdseye' } : this._info(id);
        const pic = bird ? '' : this._hass.states[id]?.attributes.entity_picture;
        tile.innerHTML = `${pic ? `<img class="ph" src="${esc(pic)}">` : ''}<span class="lbl" data-id="${esc(id)}">${esc(info.title)}</span>${n === 1 ? '<span class="live-b"><i></i>LIVE</span>' : ''}`;
        tile.ondblclick = () => this._toggleFocus(id);
        tile.onclick = (ev) => { if (ev.detail === 1 && n > 1) this._clickT = setTimeout(() => this._toggleFocus(id), 220); else clearTimeout(this._clickT); };
        this._startLive(id, tile, n);
      }
      e.grid.appendChild(tile);
    }
  }

  _toggleFocus(id) {
    if (id === 'birdseye') return;
    this._focus = this._focus ? null : id;
    this._renderGrid();
  }

  _refreshLabels() {
    this.shadowRoot.querySelectorAll('.lbl[data-id]').forEach((l) => { if (l.dataset.id !== 'birdseye') l.textContent = this._info(l.dataset.id).title; });
  }

  async _startLive(id, tile, n) {
    const mode = this._config.live;
    const bird = id === 'birdseye';
    const info = bird ? { name: 'birdseye', inst: this._info(this._recCams()[0] || '').inst } : this._info(id);
    if (!bird && !info.frigate) {
      const st = this._hass.states[id];
      if (customElements.get('ha-camera-stream') && (st?.attributes.supported_features & 2)) {
        const cs = document.createElement('ha-camera-stream');
        cs.hass = this._hass; cs.stateObj = st; cs.muted = !(n === 1 && this._sound); cs.controls = false; cs.allowExoPlayer = false; cs.fitMode = 'cover';
        cs.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;--video-max-height:100%;object-fit:cover';
        tile.appendChild(cs);
        if (n === 1) {
          const b = document.createElement('button');
          b.className = `snd glass ${this._sound ? 'on' : ''}`;
          b.title = 'Sound';
          b.innerHTML = svg(this._sound ? P.volume : P.mute);
          b.onclick = (ev) => {
            ev.stopPropagation();
            this._sound = !this._sound;
            cs.muted = !this._sound;
            const v = cs.shadowRoot?.querySelector('ha-web-rtc-player, ha-hls-player');
            const vid = v?.shadowRoot?.querySelector('video') || cs.shadowRoot?.querySelector('video');
            if (vid) { vid.muted = !this._sound; if (this._sound) vid.play().catch(() => {}); }
            b.classList.toggle('on', this._sound);
            b.innerHTML = svg(this._sound ? P.volume : P.mute);
          };
          tile.appendChild(b);
        }
        this._players.set(tile, { destroy: () => cs.remove() });
        return;
      }
      const img = document.createElement('img');
      img.className = 'live';
      img.src = `/api/camera_proxy_stream/${id}?token=${info.token}`;
      tile.appendChild(img);
      this._players.set(tile, { destroy: () => { img.src = ''; img.remove(); } });
      return;
    }
    if (mode === 'mjpeg' && !bird) {
      const img = document.createElement('img');
      img.className = 'live';
      img.src = `/api/camera_proxy_stream/${id}?token=${info.token}`;
      tile.appendChild(img);
      this._players.set(tile, { destroy: () => { img.src = ''; img.remove(); } });
      return;
    }
    try {
      const JSMpeg = await loadJsmpeg();
      if (!tile.isConnected) return;
      const signed = await this._hass.callWS({ type: 'auth/sign_path', path: `/api/frigate/${info.inst}/jsmpeg/${info.name}`, expires: 86400 });
      if (!tile.isConnected) return;
      const canvas = document.createElement('canvas');
      tile.appendChild(canvas);
      const url = `${location.origin.replace(/^http/, 'ws')}${signed.path}`;
      const player = new JSMpeg.Player(url, { canvas, audio: false, videoBufferSize: 1024 * 1024 * 4, pauseWhenHidden: true, disableGl: false, preserveDrawingBuffer: true, reconnectInterval: 3 });
      this._players.set(tile, { destroy: () => { try { player.destroy(); } catch (_) {} } });
    } catch (err) {
      const d = document.createElement('div');
      d.className = 'off';
      d.textContent = 'Live view unavailable';
      tile.appendChild(d);
    }
  }

  _stopAll() {
    this._players.forEach((p) => p.destroy());
    this._players.clear();
  }

  async _openRec(id) {
    if (!id || id === 'birdseye' || !this._info(id).frigate) id = this._recCams()[0];
    if (!id) return;
    this._pin(false);
    this._stopAll();
    this._gridKey = null;
    const now = Date.now() / 1000;
    this._rec = { cam: id, span: Number(this._config.timeline_hours) * 3600 || 21600, t: now - 120, rate: 1, segs: [], events: [], thumbs: new Map() };
    this._placeWin(this._rec.t);
    this._els.card.classList.add('recmode');
    this._renderRec();
    await this._loadWindow();
    await this._findRecent();
    this._play(this._rec.t);
  }

  async _findRecent() {
    const r = this._rec;
    if (!r || r.segs.some((x) => x.e > r.t)) return;
    if (r.segs.length) { r.t = Math.max(r.segs[r.segs.length - 1].s, r.segs[r.segs.length - 1].e - 60); this._drawCursor(); return; }
    const info = this._info(r.cam);
    try {
      const days = parse(await this._hass.callWS({ type: 'frigate/recordings/summary', instance_id: info.inst, camera: info.name, timezone: this._hass.config.time_zone }));
      for (const d of days || []) {
        const hours = (d.hours || []).map((h) => +h.hour).sort((x, y) => y - x);
        if (!hours.length) continue;
        const [y, m, dd] = d.day.split('-').map(Number);
        const start = new Date(y, m - 1, dd, hours[0]).getTime() / 1000;
        this._placeWin(start + 1800);
        await this._loadWindow();
        if (r.segs.length) { r.t = Math.max(r.segs[r.segs.length - 1].s, r.segs[r.segs.length - 1].e - 60); this._drawCursor(); }
        return;
      }
    } catch (_) {}
  }

  _closeRec(silent) {
    if (!this._rec) return;
    this._rec = null;
    if (this._els) {
      this._els.card.classList.remove('recmode');
      this._els.rec.innerHTML = '';
    }
    if (!silent) this._renderGrid();
  }

  _renderRec() {
    const r = this._rec, e = this._els;
    const info = this._info(r.cam);
    e.rec.innerHTML = `
      <div class="rv" id="rv"></div><div class="rmsg" id="rmsg">Loading…</div>
      <div class="rtop">
        <span class="pill glass">Archive</span>
        <button class="pill glass" id="camBtn"><span>Camera: ${esc(info.title)}</span>${svg(I.chevron)}</button>
        <button class="pill glass" id="dateB">${svg(I.cal)}<span id="dateL">${ymd(r.t)}</span><input type="date" id="dateI" tabindex="-1"></button>
        <button class="pill glass" id="timeB">${svg(I.clock)}<span id="timeL">${hm(r.t)}</span><input type="time" id="timeI" tabindex="-1"></button>
        <button class="pill glass" id="evBtn"><span>Events</span>${svg(I.chevron)}</button>
        <span class="sp"></span>
        <button class="pill glass" id="liveBtn">${svg(I.back)}<span>LIVE</span></button>
      </div>
      <div class="rbot glass" id="rbot">
        <div class="rctl">
          <button class="rbtn prim" id="playB">${svg(I.pause)}</button>
          <button class="rbtn" id="stopB">${svg(I.stop)}</button>
          <span class="rt" id="rt">--:--:--</span>
          <button class="nav" id="winPrev">${svg(I.left)}</button>
          <div class="tl" id="tl"><div class="track" id="track"></div><div class="ticks" id="ticks"></div><div class="cur" id="cur"></div><div class="prev glass" id="prev"><img id="prevI"><div id="prevT"></div></div></div>
          <button class="nav" id="winNext">${svg(I.right)}</button>
          <button class="pill glass" id="zoomB"><span id="zoomL">${SPANS.find((x) => x[0] === r.span)?.[1] || '1h'}</span>${svg(I.chevron)}</button>
          <button class="pill glass" id="sndB" title="Sound">${svg(this._sound ? P.volume : P.mute)}</button>
          <button class="pill glass" id="spdB"><span id="spdL">${r.rate}×</span>${svg(I.chevron)}</button>
          <button class="pill glass" id="dlB" title="Download 5 minutes">${svg(I.dl)}</button>
        </div>
      </div>
      <div class="drop glass" id="drop"></div>`;
    const $ = (x) => this.shadowRoot.getElementById(x);
    $('liveBtn').onclick = () => this._closeRec();
    $('playB').onclick = () => { const v = this._video(); if (!v) return; if (v.paused) v.play(); else v.pause(); this._syncPlay(); };
    $('stopB').onclick = () => { const v = this._video(); if (v) { v.pause(); this._seekWall(this._rec.win); } this._syncPlay(); };
    $('camBtn').onclick = (ev) => this._drop(ev.currentTarget, this._recCams().map((id) => [id, this._info(id).title, id === this._rec.cam]), (id) => { this._rec.cam = id; this._renderRec(); this._loadWindow().then(() => this._play(this._rec.t)); });
    $('sndB').onclick = () => {
      this._sound = !this._sound;
      $('sndB').innerHTML = svg(this._sound ? P.volume : P.mute);
      $('sndB').classList.toggle('on', this._sound);
      const v = this._video();
      if (v) { v.muted = !this._sound; if (this._sound && v.paused) v.play().catch(() => {}); }
    };
    $('zoomB').onclick = (ev) => this._drop(ev.currentTarget, SPANS.map(([v, l]) => [v, l, v === this._rec.span]), (v) => this._zoom(+v));
    $('spdB').onclick = (ev) => this._drop(ev.currentTarget, SPEEDS.map((s) => [s, `${s}×`, s === this._rec.rate]), (s) => { this._rec.rate = +s; $('spdL').textContent = `${s}×`; const v = this._video(); if (v) v.playbackRate = +s; });
    $('evBtn').onclick = (ev) => this._eventsDrop(ev.currentTarget);
    $('dlB').onclick = () => this._download();
    $('dateI').onchange = (ev) => { const [y, m, d] = ev.target.value.split('-').map(Number); if (!y) return; const old = new Date(this._rec.t * 1000); this._jump(new Date(y, m - 1, d, old.getHours(), old.getMinutes()).getTime() / 1000); };
    $('timeI').onchange = (ev) => { const [hh, mm] = ev.target.value.split(':').map(Number); const d = new Date(this._rec.t * 1000); d.setHours(hh, mm, 0, 0); this._jump(d.getTime() / 1000); };
    const pick = (inp, val) => {
      inp.value = val();
      inp.max = inp.type === 'date' ? ymd(Date.now() / 1000) : '';
      try { inp.showPicker(); } catch (_) { inp.style.pointerEvents = 'auto'; inp.focus(); inp.click(); }
    };
    $('dateB').onclick = () => pick($('dateI'), () => ymd(this._rec.t));
    $('timeB').onclick = () => pick($('timeI'), () => hm(this._rec.t));
    $('winPrev').onclick = () => this._shiftWin(-1);
    $('winNext').onclick = () => this._shiftWin(1);
    this._bindTimeline($('tl'));
    this.shadowRoot.addEventListener('click', (ev) => { const d = $('drop'); if (d && !ev.composedPath().some((x) => x === d || (x.id && ['camBtn', 'spdB', 'evBtn', 'zoomB'].includes(x.id)))) d.classList.remove('open'); });
    this._bindIdle();
  }

  _drop(anchor, items, pick) {
    const d = this.shadowRoot.getElementById('drop');
    const box = this._els.stage.getBoundingClientRect(), a = anchor.getBoundingClientRect();
    d.innerHTML = items.map(([v, label, on, extra]) => `<button class="mi ${on ? 'on' : ''}" data-v="${esc(v)}"><span>${esc(label)}</span>${extra ? `<small>${esc(extra)}</small>` : ''}</button>`).join('') || '<div class="mi" style="opacity:.6">Nothing here</div>';
    d.style.left = `${Math.min(a.left - box.left, box.width - 180)}px`;
    const below = a.top - box.top < box.height / 2;
    d.style.top = below ? `${a.bottom - box.top + 6}px` : '';
    d.style.bottom = below ? '' : `${box.bottom - a.top + 6}px`;
    d.classList.add('open');
    d.querySelectorAll('[data-v]').forEach((b) => { b.onclick = (ev) => { ev.stopPropagation(); d.classList.remove('open'); pick(b.dataset.v); }; });
  }

  async _eventsDrop(anchor) {
    const r = this._rec, info = this._info(r.cam);
    const day = new Date(r.t * 1000); day.setHours(0, 0, 0, 0);
    let evs = [];
    try { evs = parse(await this._hass.callWS({ type: 'frigate/events/get', instance_id: info.inst, cameras: [info.name], after: Math.floor(day / 1000), before: Math.floor(day / 1000) + 86400, limit: 100 })) || []; } catch (_) {}
    this._drop(anchor, evs.map((ev) => [ev.start_time, ev.sub_label || ev.label, false, hm(ev.start_time)]), (t) => this._jump(+t - 3));
  }

  async _loadWindow() {
    const r = this._rec;
    if (!r) return;
    const info = this._info(r.cam);
    const after = r.win, before = r.win + r.span;
    const [segs, evs] = await Promise.all([
      this._hass.callWS({ type: 'frigate/recordings/get', instance_id: info.inst, camera: info.name, after: Math.floor(after), before: Math.ceil(before) }).then(parse).catch(() => []),
      this._hass.callWS({ type: 'frigate/events/get', instance_id: info.inst, cameras: [info.name], after: Math.floor(after), before: Math.ceil(before), limit: 500 }).then(parse).catch(() => []),
    ]);
    if (this._rec !== r) return;
    r.segs = (segs || []).map((s) => ({ s: s.start_time, e: s.end_time })).sort((a, b) => a.s - b.s);
    r.events = (evs || []).sort((a, b) => a.start_time - b.start_time);
    this._drawTimeline();
  }

  _drawTimeline() {
    const r = this._rec;
    const $ = (x) => this.shadowRoot.getElementById(x);
    if (!r || !$('track')) return;
    const x = (t) => `${clamp((t - r.win) / r.span) * 100}%`;
    const merged = [];
    for (const s of r.segs) { const last = merged[merged.length - 1]; if (last && s.s - last.e < 3) last.e = s.e; else merged.push({ ...s }); }
    $('track').innerHTML = merged.map((s) => `<div class="seg" style="left:${x(s.s)};width:${clamp((Math.min(s.e, r.win + r.span) - Math.max(s.s, r.win)) / r.span) * 100}%"></div>`).join('')
      + r.events.map((ev) => `<div class="evm" style="left:${x(ev.start_time)}"></div>`).join('');
    const ticks = [];
    for (let i = 0; i <= 4; i++) ticks.push(`<span style="left:${i * 25}%">${hm(r.win + (r.span * i) / 4)}</span>`);
    $('ticks').innerHTML = ticks.join('');
    this._drawCursor();
  }

  _thumb(ev) {
    const r = this._rec, info = this._info(r.cam);
    if (!r.thumbs.has(ev.id)) r.thumbs.set(ev.id, this._hass.callWS({ type: 'auth/sign_path', path: `/api/frigate/${info.inst}/thumbnail/${ev.id}`, expires: 3600 }).then((x) => x.path).catch(() => ''));
    return r.thumbs.get(ev.id);
  }

  _placeWin(t) {
    const r = this._rec, now = Date.now() / 1000;
    if (r.span >= 86400) { const d = new Date(t * 1000); d.setHours(0, 0, 0, 0); r.win = d.getTime() / 1000; }
    else { const al = Math.min(r.span / 4, 3600); r.win = Math.floor((t - r.span / 2) / al) * al; }
    r.win = Math.min(r.win, Math.ceil((now - r.span * 0.9) / 900) * 900);
  }

  _zoom(span) {
    const r = this._rec;
    if (!r || span === r.span) return;
    r.span = span;
    const zl = this.shadowRoot.getElementById('zoomL'); if (zl) zl.textContent = SPANS.find((x) => x[0] === span)?.[1];
    this._placeWin(r.t);
    const t = r.t;
    this._loadWindow().then(() => this._seekWall(t));
  }

  _bindIdle() {
    const rec = this._els.rec;
    let over = false;
    const wake = () => {
      rec.classList.remove('idle');
      clearTimeout(this._recIdleT);
      this._recIdleT = setTimeout(() => {
        const v = this._video();
        const open = this.shadowRoot.getElementById('drop')?.classList.contains('open');
        if (this._rec && v && !v.paused && !over && !open && !this._scrub) rec.classList.add('idle');
      }, 3000);
    };
    rec.onpointermove = wake;
    rec.onpointerdown = wake;
    ['rbot'].forEach((id) => { const el = this.shadowRoot.getElementById(id); if (el) { el.onmouseenter = () => { over = true; wake(); }; el.onmouseleave = () => { over = false; wake(); }; } });
    this.shadowRoot.querySelector('.rtop').onmouseenter = () => { over = true; wake(); };
    this.shadowRoot.querySelector('.rtop').onmouseleave = () => { over = false; wake(); };
    wake();
  }

  _drawCursor() {
    const r = this._rec, cur = this.shadowRoot.getElementById('cur');
    if (!r || !cur) return;
    cur.style.left = `${clamp((r.t - r.win) / r.span) * 100}%`;
    const rt = this.shadowRoot.getElementById('rt');
    if (rt) rt.textContent = hms(r.t);
    const tl = this.shadowRoot.getElementById('timeL'); if (tl) tl.textContent = hm(r.t);
    const dl = this.shadowRoot.getElementById('dateL'); if (dl) dl.textContent = ymd(r.t);
  }

  _bindTimeline(tl) {
    const r = () => this._rec;
    const at = (ev) => { const b = tl.getBoundingClientRect(); return r().win + clamp((ev.clientX - b.left) / b.width) * r().span; };
    const prev = this.shadowRoot.getElementById('prev');
    tl.onpointermove = (ev) => {
      if (!r()) return;
      const t = at(ev), b = tl.getBoundingClientRect();
      prev.style.left = `${clamp((ev.clientX - b.left) / b.width) * 100}%`;
      this.shadowRoot.getElementById('prevT').textContent = hm(t);
      const near = r().events.reduce((best, e2) => (Math.abs(e2.start_time - t) < Math.abs((best?.start_time ?? Infinity) - t) ? e2 : best), null);
      const img = this.shadowRoot.getElementById('prevI');
      if (near && Math.abs(near.start_time - t) < r().span / 40) {
        img.style.display = '';
        this._thumb(near).then((u) => { if (u && img.dataset.ev !== near.id) { img.dataset.ev = near.id; img.src = u; } });
      } else img.style.display = 'none';
      prev.classList.add('on');
      if (this._scrub) { r().t = t; this._drawCursor(); }
    };
    tl.onpointerleave = () => prev.classList.remove('on');
    tl.onwheel = (ev) => {
      ev.preventDefault();
      if (this._wheelT) return;
      this._wheelT = setTimeout(() => { this._wheelT = null; }, 350);
      const i = SPANS.findIndex((x) => x[0] === r().span);
      const ni = clamp(i + (ev.deltaY > 0 ? 1 : -1), 0, SPANS.length - 1);
      if (ni !== i) { r().t = at(ev); this._zoom(SPANS[ni][0]); }
    };
    tl.onpointerdown = (ev) => { this._scrub = true; tl.setPointerCapture(ev.pointerId); r().t = at(ev); this._drawCursor(); };
    tl.onpointerup = (ev) => { if (!this._scrub) return; this._scrub = false; this._seekWall(at(ev)); };
  }

  _shiftWin(dir) {
    const r = this._rec;
    const now = Date.now() / 1000;
    r.win = Math.min(r.win + dir * r.span, Math.ceil((now - r.span * 0.9) / 900) * 900);
    r.t = clamp(r.t + dir * r.span, r.win, Math.min(r.win + r.span, now));
    this._loadWindow().then(() => this._play(r.t));
  }

  _jump(t) {
    const r = this._rec;
    const now = Date.now() / 1000;
    t = Math.min(t, now - 30);
    if (t < r.win || t > r.win + r.span) {
      this._placeWin(t);
      r.t = t;
      this._loadWindow().then(() => this._play(t));
    } else this._seekWall(t);
  }

  _video() { const p = this.shadowRoot.getElementById('rv')?.firstElementChild; return p?.tagName === 'VIDEO' ? p : p?.shadowRoot?.querySelector('video') || p?.querySelector?.('video') || null; }

  _seekWall(t) {
    const r = this._rec;
    r.t = t;
    this._drawCursor();
    if (r.loadedFrom != null && t >= r.loadedFrom && t <= r.win + r.span) {
      const v = this._video(), off = this._wallToVideo(t);
      if (v && off != null) { v.currentTime = off; v.play().catch(() => {}); this._syncPlay(); return; }
    }
    this._play(t);
  }

  _wallToVideo(t) {
    const r = this._rec;
    let acc = 0;
    for (const s of r.segs) {
      if (s.e <= r.loadedFrom) continue;
      const st = Math.max(s.s, r.loadedFrom);
      if (t < st) return acc;
      if (t <= s.e) return acc + (t - st);
      acc += s.e - st;
    }
    return acc;
  }

  _videoToWall(v) {
    const r = this._rec;
    let acc = 0;
    for (const s of r.segs) {
      if (s.e <= r.loadedFrom) continue;
      const st = Math.max(s.s, r.loadedFrom), d = s.e - st;
      if (v <= acc + d) return st + (v - acc);
      acc += d;
    }
    return r.loadedFrom + v;
  }

  async _play(t) {
    const r = this._rec;
    if (!r) return;
    const info = this._info(r.cam);
    const first = r.segs.find((s) => s.e > t);
    const msg = this.shadowRoot.getElementById('rmsg');
    const rv = this.shadowRoot.getElementById('rv');
    if (!first) { rv.innerHTML = ''; msg.textContent = 'No recording here'; msg.style.display = ''; return; }
    const start = Math.max(t, first.s);
    r.loadedFrom = start;
    r.t = start;
    this._drawCursor();
    const end = Math.min(r.win + r.span, Date.now() / 1000);
    msg.textContent = 'Loading…'; msg.style.display = '';
    let path;
    try { path = (await this._hass.callWS({ type: 'auth/sign_path', path: `/api/frigate/${info.inst}/vod/${info.name}/start/${Math.floor(start)}/end/${Math.ceil(end)}/index.m3u8`, expires: 3600 })).path; } catch (_) { msg.textContent = 'Recording unavailable'; return; }
    if (this._rec !== r) return;
    rv.innerHTML = '';
    let player;
    if (customElements.get('ha-hls-player')) {
      player = document.createElement('ha-hls-player');
      player.hass = this._hass;
      player.url = path;
      player.autoplay = true;
      player.muted = !this._sound;
      player.playsInline = true;
      player.controls = false;
    } else {
      player = document.createElement('video');
      player.src = path; player.autoplay = true; player.muted = true; player.playsInline = true;
    }
    rv.appendChild(player);
    const hook = () => {
      const v = this._video();
      if (!v) { setTimeout(hook, 200); return; }
      v.playbackRate = r.rate;
      v.muted = !this._sound;
      v.style.cssText += ';width:100%;height:100%;max-height:none;object-fit:cover';
      const kick = () => { if (v.paused && this._rec === r) v.play().catch(() => { v.muted = true; v.play().catch(() => {}); }); };
      v.addEventListener('canplay', kick, { once: true });
      setTimeout(kick, 1500);
      v.onplaying = () => { msg.style.display = 'none'; this._syncPlay(); v.playbackRate = r.rate; };
      v.onpause = () => this._syncPlay();
      v.ontimeupdate = () => { if (this._rec !== r || this._scrub) return; r.t = this._videoToWall(v.currentTime); this._drawCursor(); };
      v.onended = () => this._syncPlay();
    };
    hook();
  }

  _syncPlay() {
    const b = this.shadowRoot.getElementById('playB'), v = this._video();
    if (b) b.innerHTML = svg(v && !v.paused ? I.pause : I.play);
  }

  async _download() {
    const r = this._rec, info = this._info(r.cam);
    const s = Math.floor(r.t), e = Math.ceil(Math.min(r.t + 300, Date.now() / 1000));
    try {
      const path = (await this._hass.callWS({ type: 'auth/sign_path', path: `/api/frigate/${info.inst}/recording/${info.name}/start/${s}/end/${e}`, expires: 300 })).path;
      const a = document.createElement('a');
      a.href = path; a.download = `${info.name}-${ymd(s)}-${hm(s).replace(':', '')}.mp4`;
      document.body.appendChild(a); a.click(); a.remove();
    } catch (_) {}
  }
}

const NVR_TEXT = {
  cameras: 'Cameras', h_cameras: 'Frigate cameras get the low-delay stream and recordings; other cameras (Ring, ONVIF…) show live only.', layout: 'Start layout', live: 'Live stream', aspect_ratio: 'Aspect ratio', birdseye: 'Birdseye in the layout menu', show_names: 'Camera names',
  h_live: 'JSMpeg: lowest delay, light enough for many cameras. MJPEG: fallback.',
  h_birdseye: 'Shown in the menu when Birdseye is enabled in Frigate.',
  h_aspect_ratio: 'For example 16/9 or 4/3.',
};

const ED_STYLE = `
.cams{margin-bottom:16px}
.cams h4{margin:0 0 8px;font-size:14px;font-weight:500;color:var(--secondary-text-color)}
.row{display:flex;align-items:center;gap:6px;min-height:48px;padding:0 6px;margin-bottom:6px;border-radius:10px;background:var(--secondary-background-color,rgba(127,127,127,.12));cursor:grab}
.row.drag{opacity:.4}
.row.over{outline:2px dashed var(--primary-color)}
.row .h{display:grid;place-items:center;width:24px;opacity:.6}
.row .n{flex:1;min-width:0}
.row .n div{white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.row .n small{opacity:.6}
.row button{width:34px;height:34px;border:0;border-radius:50%;background:none;color:var(--primary-text-color);cursor:pointer;display:grid;place-items:center;padding:0}
.row button:hover{background:rgba(127,127,127,.18)}
.row button:disabled{opacity:.25;pointer-events:none}
.row svg{width:20px;height:20px;fill:currentColor}
.tag{font-size:11px;padding:1px 6px;border-radius:6px;background:rgba(40,110,255,.18);margin-left:6px}
`;
const E_ICON = {
  drag: 'M9,3H11V5H9V3M13,3H15V5H13V3M9,7H11V9H9V7M13,7H15V9H13V7M9,11H11V13H9V11M13,11H15V13H13V11M9,15H11V17H9V15M13,15H15V17H13V15M9,19H11V21H9V19M13,19H15V21H13V19Z',
  up: 'M7.41,15.41L12,10.83L16.59,15.41L18,14L12,8L6,14L7.41,15.41Z',
  down: 'M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z',
  del: 'M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z',
};

class MaestroNvrEditor extends HTMLElement {
  setConfig(config) { this._config = config; this._render(); }
  set hass(hass) { this._hass = hass; this._render(); }

  _render() {
    if (!this._hass || !this._config) return;
    if (!this._form) {
      const st = document.createElement('style'); st.textContent = ED_STYLE; this.appendChild(st);
      this._list = document.createElement('div'); this._list.className = 'cams'; this.appendChild(this._list);
      this._form = document.createElement('ha-form');
      this._form.computeLabel = (s) => NVR_TEXT[s.name] || s.name;
      this._form.computeHelper = (s) => NVR_TEXT[`h_${s.name}`];
      this._form.addEventListener('value-changed', (e) => this._changed({ ...e.detail.value, cameras: this._cams() }));
      this.appendChild(this._form);
    }
    this._renderList();
    this._form.hass = this._hass;
    this._form.schema = [
      { type: 'grid', name: 'g', flatten: true, schema: [
        { name: 'layout', selector: { select: { mode: 'dropdown', options: [{ value: 'auto', label: 'Auto' }, { value: '1', label: '1 camera' }, { value: '4', label: '4 cameras' }, { value: '9', label: '9 cameras' }, { value: 'birdseye', label: 'Birdseye' }] } } },
        { name: 'live', selector: { select: { mode: 'dropdown', options: [{ value: 'jsmpeg', label: 'JSMpeg (low delay)' }, { value: 'mjpeg', label: 'MJPEG' }] } } },
      ] },
      { name: 'aspect_ratio', selector: { text: {} } },
      { type: 'grid', name: 'g2', flatten: true, schema: [
        { name: 'show_names', selector: { boolean: {} } },
        { name: 'birdseye', selector: { boolean: {} } },
      ] },
    ];
    const { cameras, ...rest } = this._config;
    this._form.data = { layout: 'auto', live: 'jsmpeg', birdseye: true, show_names: true, ...rest };
  }

  _cams() { return [...(this._config.cameras || (this._config.camera ? [this._config.camera] : []))]; }

  _renderList() {
    const cams = this._cams();
    const key = JSON.stringify(cams);
    if (key === this._listKey && this._list.querySelector('ha-entity-picker')) { this._list.querySelector('ha-entity-picker').hass = this._hass; return; }
    this._listKey = key;
    const sv = (d) => `<svg viewBox="0 0 24 24"><path d="${d}"/></svg>`;
    this._list.innerHTML = `<h4>${NVR_TEXT.cameras}</h4>` + cams.map((id, i) => {
      const st = this._hass.states[id];
      const frig = !!(st?.attributes.camera_name && st?.attributes.client_id);
      return `<div class="row" draggable="true" data-i="${i}"><span class="h">${sv(E_ICON.drag)}</span>
        <div class="n"><div>${esc(st?.attributes.friendly_name || id)}${frig ? '<span class="tag">Frigate</span>' : ''}</div><small>${esc(id)}</small></div>
        <button data-a="up" ${i === 0 ? 'disabled' : ''}>${sv(E_ICON.up)}</button><button data-a="down" ${i === cams.length - 1 ? 'disabled' : ''}>${sv(E_ICON.down)}</button><button data-a="del">${sv(E_ICON.del)}</button></div>`;
    }).join('');
    const picker = document.createElement('ha-entity-picker');
    picker.hass = this._hass;
    picker.includeDomains = ['camera'];
    picker.excludeEntities = cams;
    picker.label = 'Add camera';
    picker.addEventListener('value-changed', (e) => { const v = e.detail.value; if (v && !cams.includes(v)) this._setCams([...cams, v]); });
    this._list.appendChild(picker);
    let from = null;
    this._list.querySelectorAll('.row').forEach((row) => {
      const i = +row.dataset.i;
      row.querySelectorAll('button').forEach((b) => {
        b.onclick = () => {
          const c = [...cams];
          if (b.dataset.a === 'del') c.splice(i, 1);
          else { const j = b.dataset.a === 'up' ? i - 1 : i + 1; [c[i], c[j]] = [c[j], c[i]]; }
          this._setCams(c);
        };
      });
      row.ondragstart = (e) => { from = i; row.classList.add('drag'); e.dataTransfer.effectAllowed = 'move'; };
      row.ondragend = () => row.classList.remove('drag');
      row.ondragover = (e) => { e.preventDefault(); row.classList.add('over'); };
      row.ondragleave = () => row.classList.remove('over');
      row.ondrop = (e) => {
        e.preventDefault(); row.classList.remove('over');
        if (from == null || from === i) return;
        const c = [...cams]; const [m] = c.splice(from, 1); c.splice(i, 0, m); from = null;
        this._setCams(c);
      };
    });
  }

  _setCams(cams) {
    this._changed({ ...this._form.data, cameras: cams });
  }

  _changed(v) {
    const out = { type: this._config.type };
    for (const [k, val] of Object.entries(v)) {
      if (k === 'type' || val === '' || val == null || (Array.isArray(val) && !val.length && k !== 'cameras')) continue;
      if ((k === 'layout' && val === 'auto') || (k === 'live' && val === 'jsmpeg') || (k === 'birdseye' && val === true) || (k === 'show_names' && val === true)) continue;
      out[k] = val;
    }
    for (const k of ['names', 'timeline_hours']) if (this._config[k] !== undefined && out[k] === undefined) out[k] = this._config[k];
    this._config = out;
    this._render();
    this.dispatchEvent(new CustomEvent('config-changed', { detail: { config: out }, bubbles: true, composed: true }));
  }
}

window.customCards = window.customCards || [];
if (!customElements.get('maestro-nvr-card')) customElements.define('maestro-nvr-card', MaestroNvrCard);
if (!customElements.get('maestro-nvr-editor')) customElements.define('maestro-nvr-editor', MaestroNvrEditor);
if (!window.customCards.some((c) => c.type === 'maestro-nvr-card')) {
  window.customCards.push({ type: 'maestro-nvr-card', name: 'MAestro NVR', description: 'Cameras with minimal delay: 1, 4 or 9 on screen, pages, and a recordings timeline for Frigate. Other cameras show live.', preview: true });
}
