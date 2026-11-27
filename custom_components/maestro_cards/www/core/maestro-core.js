const VERSION = '1.5.3';

const P = {
  play: 'M8,5.14V19.14L19,12.14L8,5.14Z',
  pause: 'M14,19H18V5H14M6,19H10V5H6V19Z',
  next: 'M16,18H18V6H16M6,18L14.5,12L6,6V18Z',
  previous: 'M6,18V6H8V18H6M9.5,12L18,6V18L9.5,12Z',
  shuffle: 'M14.83,13.41L13.42,14.82L16.55,17.95L14.5,20H20V14.5L17.96,16.54L14.83,13.41M14.5,4L16.54,6.04L4,18.59L5.41,20L17.96,7.46L20,9.5V4M10.59,9.17L5.41,4L4,5.41L9.17,10.58L10.59,9.17Z',
  repeat: 'M17,17H7V14L3,18L7,22V19H19V13H17M7,7H17V10L21,6L17,2V5H5V11H7V7Z',
  repeat_one: 'M13,15V9H12L10,10V11H11.5V15M17,17H7V14L3,18L7,22V19H19V13H17M7,7H17V10L21,6L17,2V5H5V11H7V7Z',
  chevron: 'M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z',
  volume: 'M14,3.23V5.29C16.89,6.15 19,8.83 19,12C19,15.17 16.89,17.84 14,18.7V20.77C18,19.86 21,16.28 21,12C21,7.72 18,4.14 14,3.23M16.5,12C16.5,10.23 15.5,8.71 14,7.97V16C15.5,15.29 16.5,13.76 16.5,12M3,9V15H7L12,20V4L7,9H3Z',
  mute: 'M12,4L9.91,6.09L12,8.18M4.27,3L3,4.27L7.73,9H3V15H7L12,20V13.27L16.25,17.53C15.58,18.04 14.83,18.46 14,18.7V20.77C15.38,20.45 16.63,19.82 17.68,18.96L19.73,21L21,19.73L12,10.73M19,12C19,12.94 18.8,13.82 18.46,14.64L19.97,16.15C20.62,14.91 21,13.5 21,12C21,7.72 18,4.14 14,3.23V5.29C16.89,6.15 19,8.83 19,12M16.5,12C16.5,10.23 15.5,8.71 14,7.97V10.18L16.45,12.63C16.5,12.43 16.5,12.21 16.5,12Z',
  note: 'M12,3V13.55C11.41,13.21 10.73,13 10,13C7.79,13 6,14.79 6,17C6,19.21 7.79,21 10,21C12.21,21 14,19.21 14,17V7H18V3H12Z',
  link: 'M3.9,12C3.9,10.29 5.29,8.9 7,8.9H11V7H7A5,5 0 0,0 2,12A5,5 0 0,0 7,17H11V15.1H7C5.29,15.1 3.9,13.71 3.9,12M8,13H16V11H8V13M17,7H13V8.9H17C18.71,8.9 20.1,10.29 20.1,12C20.1,13.71 18.71,15.1 17,15.1H13V17H17A5,5 0 0,0 22,12A5,5 0 0,0 17,7Z',
  power: 'M16.56,5.44L15.11,6.89C16.84,7.94 18,9.83 18,12A6,6 0 0,1 12,18A6,6 0 0,1 6,12C6,9.83 7.16,7.94 8.88,6.88L7.44,5.44C5.36,6.88 4,9.28 4,12A8,8 0 0,0 12,20A8,8 0 0,0 20,12C20,9.28 18.64,6.88 16.56,5.44M13,3H11V13H13',
  info: 'M11,9H13V7H11M12,20C7.59,20 4,16.41 4,12C4,7.59 7.59,4 12,4C16.41,4 20,7.59 20,12C20,16.41 16.41,20 12,20M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M11,17H13V11H11V17Z',
  star: 'M12,17.27L18.18,21L16.54,13.97L22,9.24L14.81,8.62L12,2L9.19,8.62L2,9.24L7.45,13.97L5.82,21L12,17.27Z',
};

const svg = (d) => `<svg viewBox="0 0 24 24"><path d="${d}"/></svg>`;

const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));

const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

const STYLE_BASE = `
:host{--mmp-fg-rgb:255,255,255;--mmp-fg:rgb(var(--mmp-fg-rgb));--mmp-accent-rgb:255,255,255;--mmp-accent:rgb(var(--mmp-accent-rgb));--mmp-on-accent:#111;--mmp-bg:linear-gradient(135deg,#3a4a7a,#1d2340 60%,#4b3a5e);--mmp-card-bg:#1c2233;--mmp-shade-rgb:12,16,32;--mmp-panel:rgba(14,17,30,.72);--mmp-art:1}
:host{display:block}
ha-card{position:relative;display:block;overflow:hidden;isolation:isolate;container-type:inline-size;
  border-radius:var(--ha-card-border-radius,24px);border:1px solid rgba(var(--mmp-fg-rgb),.22);
  color:var(--mmp-fg);background:var(--mmp-card-bg);min-height:212px;box-shadow:0 10px 40px rgba(0,0,0,.25);
  user-select:none;-webkit-user-select:none;-webkit-tap-highlight-color:transparent}
.bg{position:absolute;inset:calc(var(--mmp-blur) * -2 - 2px);z-index:-2;
  background:var(--mmp-bg) center/cover no-repeat;
  filter:blur(var(--mmp-blur)) saturate(1.1);transition:background-image .6s}
.shade{position:absolute;inset:0;z-index:-1;
  background:linear-gradient(180deg,rgba(var(--mmp-shade-rgb),var(--mmp-shade-top)) 0%,rgba(var(--mmp-shade-rgb),var(--mmp-shade-bottom)) 100%)}
.content{position:relative;padding:14px 18px 10px;display:flex;flex-direction:column}
.divider{width:1px;height:22px;background:rgba(var(--mmp-fg-rgb),.35);margin:0 6px}
.btn{display:grid;place-items:center;width:40px;height:40px;border-radius:50%;border:0;padding:0;flex:none;
  background:none;color:inherit;cursor:pointer;transition:background .15s,opacity .15s,transform .1s;position:relative}
.btn:hover{background:rgba(var(--mmp-fg-rgb),.12)}
.btn:active{transform:scale(.92)}
.btn svg{width:24px;height:24px;fill:currentColor}
.btn img{width:24px;height:24px;object-fit:contain}
.btn.sm{width:34px;height:34px}
.btn.sm svg,.btn.sm img{width:20px;height:20px}
.btn.xs{width:28px;height:28px}
.btn.xs svg,.btn.xs img{width:17px;height:17px}
.rail{position:absolute;left:0;right:0;top:50%;height:4px;margin-top:-2px;border-radius:2px;background:rgba(var(--mmp-fg-rgb),.28);overflow:hidden}
.fill{position:absolute;left:0;top:0;bottom:0;width:0;background:var(--mmp-accent);border-radius:2px}
.knob{position:absolute;top:50%;left:0;width:12px;height:12px;margin:-6px 0 0 -6px;border-radius:50%;
  background:var(--mmp-accent);box-shadow:0 1px 4px rgba(0,0,0,.35);transition:transform .15s}
.panel.open~.power{opacity:0;pointer-events:none}
.power{position:absolute;z-index:6;top:14px;right:18px;color:rgba(var(--mmp-fg-rgb),.9)}
.power.on{color:#3ddc84;filter:drop-shadow(0 0 6px rgba(61,220,132,.75))}
.power.pending{animation:pw-pulse 1s ease-in-out infinite}
@keyframes pw-pulse{50%{opacity:.35}}
.content{transition:filter .4s,opacity .4s}
.off .content{filter:blur(7px) saturate(.6);opacity:.5;pointer-events:none}
ha-card.off:not(.theme-light){--mmp-card-bg:#2a2d33;--mmp-shade-rgb:20,22,26}
ha-card.off:not(.theme-light) .bg{background:linear-gradient(135deg,#43464e,#25282e 60%,#363940)!important;opacity:1}
.off .power:not(.on){background:rgba(var(--mmp-fg-rgb),.14);box-shadow:0 0 0 1px rgba(var(--mmp-fg-rgb),.25),0 4px 16px rgba(0,0,0,.35)}
[hidden]{display:none!important}
ha-card.glass{-webkit-backdrop-filter:blur(24px) saturate(1.5);backdrop-filter:blur(24px) saturate(1.5)}
ha-card.glass .bg{opacity:.4}
ha-card.theme-light{box-shadow:0 10px 30px rgba(0,0,0,.12)}
.theme-light #roomsBtn.playing,.theme-light .power.on,.theme-light .rpower.on{color:#12884a;filter:none}
.panel{position:absolute;inset:0;z-index:5;display:flex;
  background:var(--mmp-panel);backdrop-filter:blur(22px) saturate(1.3);-webkit-backdrop-filter:blur(22px) saturate(1.3);
  opacity:0;pointer-events:none;transform:translateY(8px);transition:opacity .2s,transform .2s}
.panel.open{opacity:1;pointer-events:auto;transform:none}
.col{flex:1;display:flex;flex-direction:column;min-width:0}
.tab{flex:none;padding:5px 12px;border-radius:999px;border:1px solid rgba(var(--mmp-fg-rgb),.2);background:none;color:inherit;font:inherit;font-size:13px;cursor:pointer;opacity:.8}
.tab.on{background:var(--mmp-accent);color:var(--mmp-on-accent);opacity:1;border-color:var(--mmp-fg)}
.list{flex:1;overflow-y:auto;padding:0 8px 8px;scrollbar-width:thin;scrollbar-color:rgba(var(--mmp-fg-rgb),.3) transparent}
.msg{padding:20px;text-align:center;opacity:.75;font-size:13px}
.rooms{padding-top:6px}
#roomsBtn.playing{color:#3ddc84;filter:drop-shadow(0 0 5px rgba(61,220,132,.7))}
`;

const STYLE_MQ = `
@container (max-width:300px){
  .power{width:30px;height:30px;top:16px}
  .divider{margin:0 3px}
}
@container (max-width:340px){
  .content{padding-left:14px;padding-right:12px}
  .power{right:12px}
}
`;

const STYLE = STYLE_BASE + STYLE_MQ;

const THEMES = {
  blue: { bg: 'linear-gradient(135deg,#3a4a7a,#1d2340 60%,#4b3a5e)', card: '#1c2233', fg: '255,255,255', accent: '255,255,255', onAccent: '#111', shade: '12,16,32', top: 0.08, bottom: 0.45, panel: 'rgba(14,17,30,.72)', art: true },
  dark: { bg: '#0a0a0c', card: '#0a0a0c', fg: '238,238,240', accent: '255,255,255', onAccent: '#111', shade: '0,0,0', top: 0.25, bottom: 0.6, panel: 'rgba(8,8,10,.9)', art: true },
  light: { bg: 'linear-gradient(135deg,#f4f5f7,#e1e3e8)', card: '#eceef2', fg: '30,32,38', accent: '30,32,38', onAccent: '#fff', shade: '238,240,244', top: 0.3, bottom: 0.6, panel: 'rgba(243,244,247,.9)', art: true },
  m_heat: { bg: 'linear-gradient(135deg,#8a4320,#4a2210 60%,#6b3016)', card: '#4a2412', fg: '255,255,255', accent: '255,186,130', onAccent: '#111', shade: '40,16,6', top: 0.05, bottom: 0.3, panel: 'rgba(52,24,12,.86)', art: false },
  m_cool: { bg: 'linear-gradient(135deg,#2a4a86,#16234a 60%,#283a72)', card: '#1a2850', fg: '255,255,255', accent: '140,200,255', onAccent: '#111', shade: '10,18,40', top: 0.05, bottom: 0.3, panel: 'rgba(14,22,48,.86)', art: false },
  m_auto: { bg: 'linear-gradient(135deg,#4b3a86,#241a4a 60%,#3a2c70)', card: '#2a2050', fg: '255,255,255', accent: '200,180,255', onAccent: '#111', shade: '24,16,48', top: 0.05, bottom: 0.3, panel: 'rgba(30,22,58,.86)', art: false },
  m_grey: { bg: 'linear-gradient(135deg,#43464e,#25282e 60%,#363940)', card: '#2a2d33', fg: '240,241,244', accent: '230,232,236', onAccent: '#111', shade: '20,22,26', top: 0.05, bottom: 0.3, panel: 'rgba(30,32,37,.88)', art: false },
  glass: { bg: 'transparent', card: 'rgba(255,255,255,.08)', fg: '255,255,255', accent: '255,255,255', onAccent: '#111', shade: '255,255,255', top: 0.02, bottom: 0.08, panel: 'rgba(20,22,30,.5)', art: false, glass: true },
};

const THEME_NAMES = ['blue', 'dark', 'light', 'glass', 'custom'];

const rgbStr = (v, d) => (Array.isArray(v) && v.length === 3 ? v.map((x) => Math.round(+x || 0)).join(',') : d);

const luminance = (rgb) => { const [r, g, b] = rgb.split(',').map(Number); return (0.299 * r + 0.587 * g + 0.114 * b) / 255; };

function resolveTheme(c) {
  const name = c.theme === 'custom' || THEMES[c.theme] ? c.theme : 'blue';
  let t = THEMES[name];
  if (name === 'custom') {
    const bg = rgbStr(c.custom_background, '28,34,51');
    const accent = rgbStr(c.custom_accent, '255,255,255');
    const fg = rgbStr(c.custom_text, luminance(bg) > 0.6 ? '30,32,38' : '255,255,255');
    t = { bg: `rgb(${bg})`, card: `rgb(${bg})`, fg, accent, onAccent: luminance(accent) > 0.6 ? '#111' : '#fff', shade: bg, top: 0.12, bottom: 0.5, panel: `rgba(${bg},.88)`, art: true };
  }
  const top = c.shade_top ?? t.top, bottom = c.shade_bottom ?? t.bottom;
  const art = c.artwork ?? t.art;
  const vars = `--mmp-fg-rgb:${t.fg};--mmp-accent-rgb:${t.accent};--mmp-on-accent:${t.onAccent};--mmp-bg:${t.bg};--mmp-card-bg:${t.card};`
    + `--mmp-shade-rgb:${t.shade};--mmp-shade-top:${Number(top)};--mmp-shade-bottom:${Number(bottom)};--mmp-panel:${t.panel};`
    + `--mmp-fg:rgb(${t.fg});--mmp-accent:rgb(${t.accent});`;
  return { name, vars, art, glass: !!t.glass, fg: t.fg, accent: t.accent, top: t.top, bottom: t.bottom };
}

const COLORS = {
  blue: { bg: 'linear-gradient(135deg,#3a4a7a,#1d2340 60%,#4b3a5e)', fg: '255,255,255', glow: '74,96,170' },
  grey: { bg: 'linear-gradient(135deg,#43464e,#25282e 60%,#363940)', fg: '240,241,244', glow: '120,124,134' },
  green: { bg: 'linear-gradient(135deg,#2f6a48,#163826 60%,#285a3d)', fg: '255,255,255', glow: '61,170,110' },
  red: { bg: 'linear-gradient(135deg,#8a3434,#481616 60%,#6b2626)', fg: '255,255,255', glow: '200,70,70' },
  yellow: { bg: 'linear-gradient(135deg,#9c7c26,#5c4412 60%,#7f621c)', fg: '255,255,255', glow: '220,170,50' },
  black: { bg: 'linear-gradient(135deg,#1c1c20,#0a0a0c 60%,#151518)', fg: '238,238,240', glow: '0,0,0' },
  white: { bg: 'linear-gradient(135deg,#f6f7f9,#e1e3e8)', fg: '30,32,38', glow: '255,255,255' },
};

const COLOR_NAMES = ['blue', 'grey', 'green', 'red', 'yellow', 'black', 'white'];
const COLOR_LABELS = { blue: 'Blue', grey: 'Grey', green: 'Green', red: 'Red', yellow: 'Yellow', black: 'Black', white: 'White' };

const THEME_LABELS = { blue: 'Blue', dark: 'Dark', light: 'Light', glass: 'Glass (transparent)', custom: 'Custom colors' };

function ensurePopupStyle() {
  if (document.getElementById('mmp-popup-style')) return;
  const st = document.createElement('style');
  st.id = 'mmp-popup-style';
  st.textContent = `
    .mmp-popup{position:fixed;inset:0;z-index:9999;display:flex;align-items:center;justify-content:center;padding:12px;box-sizing:border-box;
      background:rgba(0,0,0,.45);-webkit-backdrop-filter:blur(6px);backdrop-filter:blur(6px);animation:mmp-fade .2s ease}
    .mmp-popup.closing{animation:mmp-fade .18s ease reverse forwards}
    .mmp-sheet{width:min(560px,100%);max-height:100%;overflow:auto;border-radius:24px;animation:mmp-up .25s cubic-bezier(.2,.8,.2,1)}
    .mmp-popup.closing .mmp-sheet{animation:mmp-up .18s ease reverse forwards}
    @keyframes mmp-fade{from{opacity:0}}
    @keyframes mmp-up{from{transform:translateY(24px) scale(.98);opacity:0}}
    @media (max-width:600px){.mmp-popup{align-items:flex-end}}`;
  document.head.appendChild(st);

}

function openPopup(host, tag, config) {
  if (host._popup) return;
  ensurePopupStyle();
  const wrap = document.createElement('div');
  wrap.className = 'mmp-popup';
  const sheet = document.createElement('div');
  sheet.className = 'mmp-sheet';
  const card = document.createElement(tag);
  card.setConfig({ ...config, type: `custom:${tag}` });
  card.hass = host._hass;
  sheet.appendChild(card);
  wrap.appendChild(sheet);
  const close = () => {
    if (host._popup?.wrap !== wrap) return;
    document.removeEventListener('keydown', onKey);
    wrap.classList.add('closing');
    setTimeout(() => wrap.remove(), 180);
    host._popup = null;
  };
  const onKey = (e) => { if (e.key === 'Escape') close(); };
  wrap.addEventListener('click', (e) => { if (e.target === wrap) close(); });
  document.addEventListener('keydown', onKey);
  document.body.appendChild(wrap);
  host._popup = { wrap, card, close };
}

const withAlpha = (c, a) => {
  const hex = /^#([0-9a-f]{6})$/i.exec(c);
  if (hex) { const n = parseInt(hex[1], 16); return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${a})`; }
  const m = /rgba?\(([^)]+)\)/.exec(c);
  if (m) return `rgba(${m[1].split(',').slice(0, 3).join(',')},${a})`;
  return c;
};

const SETTINGS = { p: null };

function loadSettings(hass) {
  if (!hass?.config?.components?.includes('maestro_cards')) return Promise.resolve(null);
  if (!SETTINGS.p) SETTINGS.p = hass.callWS({ type: 'maestro_cards/settings' }).then((r) => r?.options || {}).catch(() => null);
  return SETTINGS.p;
}

function withSettings(raw, s, kind) {
  if (!s) return raw;
  const c = { ...raw };
  if (kind === 'player') {
    if (c.theme === undefined && s.player_theme) c.theme = s.player_theme;
    if (c.power_entity === undefined && c.show_power !== false && s.power?.[c.entity]) c.power_entity = s.power[c.entity];
    if (!c.players?.length && s.players?.length) c.players = s.players;
  } else if (kind === 'thermostat') {
    if (c.theme === undefined && s.thermostat_theme) c.theme = s.thermostat_theme;
    if (!c.thermostats?.length && s.thermostats?.length) c.thermostats = s.thermostats;
  }
  return c;
}

console.info(`%c MAESTRO %c v${VERSION} `, 'color:#fff;background:#2196F3;font-weight:700', 'color:#2196F3;background:#fff');

export { VERSION, P, svg, clamp, esc, STYLE, STYLE_BASE, STYLE_MQ, THEMES, THEME_NAMES, THEME_LABELS, COLORS, COLOR_NAMES, COLOR_LABELS, rgbStr, luminance, resolveTheme, ensurePopupStyle, openPopup, withAlpha, loadSettings, withSettings };
