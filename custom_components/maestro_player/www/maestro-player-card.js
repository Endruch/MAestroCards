const VERSION = '1.2.6';
const TAG = 'maestro-player-card';

const P = {
  play: 'M8,5.14V19.14L19,12.14L8,5.14Z',
  pause: 'M14,19H18V5H14M6,19H10V5H6V19Z',
  next: 'M16,18H18V6H16M6,18L14.5,12L6,6V18Z',
  previous: 'M6,18V6H8V18H6M9.5,12L18,6V18L9.5,12Z',
  shuffle: 'M14.83,13.41L13.42,14.82L16.55,17.95L14.5,20H20V14.5L17.96,16.54L14.83,13.41M14.5,4L16.54,6.04L4,18.59L5.41,20L17.96,7.46L20,9.5V4M10.59,9.17L5.41,4L4,5.41L9.17,10.58L10.59,9.17Z',
  repeat: 'M17,17H7V14L3,18L7,22V19H19V13H17M7,7H17V10L21,6L17,2V5H5V11H7V7Z',
  repeat_one: 'M13,15V9H12L10,10V11H11.5V15M17,17H7V14L3,18L7,22V19H19V13H17M7,7H17V10L21,6L17,2V5H5V11H7V7Z',
  chevron: 'M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z',
  close: 'M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z',
  volume: 'M14,3.23V5.29C16.89,6.15 19,8.83 19,12C19,15.17 16.89,17.84 14,18.7V20.77C18,19.86 21,16.28 21,12C21,7.72 18,4.14 14,3.23M16.5,12C16.5,10.23 15.5,8.71 14,7.97V16C15.5,15.29 16.5,13.76 16.5,12M3,9V15H7L12,20V4L7,9H3Z',
  mute: 'M12,4L9.91,6.09L12,8.18M4.27,3L3,4.27L7.73,9H3V15H7L12,20V13.27L16.25,17.53C15.58,18.04 14.83,18.46 14,18.7V20.77C15.38,20.45 16.63,19.82 17.68,18.96L19.73,21L21,19.73L12,10.73M19,12C19,12.94 18.8,13.82 18.46,14.64L19.97,16.15C20.62,14.91 21,13.5 21,12C21,7.72 18,4.14 14,3.23V5.29C16.89,6.15 19,8.83 19,12M16.5,12C16.5,10.23 15.5,8.71 14,7.97V10.18L16.45,12.63C16.5,12.43 16.5,12.21 16.5,12Z',
  note: 'M12,3V13.55C11.41,13.21 10.73,13 10,13C7.79,13 6,14.79 6,17C6,19.21 7.79,21 10,21C12.21,21 14,19.21 14,17V7H18V3H12Z',
  link: 'M3.9,12C3.9,10.29 5.29,8.9 7,8.9H11V7H7A5,5 0 0,0 2,12A5,5 0 0,0 7,17H11V15.1H7C5.29,15.1 3.9,13.71 3.9,12M8,13H16V11H8V13M17,7H13V8.9H17C18.71,8.9 20.1,10.29 20.1,12C20.1,13.71 18.71,15.1 17,15.1H13V17H17A5,5 0 0,0 22,12A5,5 0 0,0 17,7Z',
  power: 'M16.56,5.44L15.11,6.89C16.84,7.94 18,9.83 18,12A6,6 0 0,1 12,18A6,6 0 0,1 6,12C6,9.83 7.16,7.94 8.88,6.88L7.44,5.44C5.36,6.88 4,9.28 4,12A8,8 0 0,0 12,20A8,8 0 0,0 20,12C20,9.28 18.64,6.88 16.56,5.44M13,3H11V13H13',
  info: 'M11,9H13V7H11M12,20C7.59,20 4,16.41 4,12C4,7.59 7.59,4 12,4C16.41,4 20,7.59 20,12C20,16.41 16.41,20 12,20M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M11,17H13V11H11V17Z',
  star: 'M12,17.27L18.18,21L16.54,13.97L22,9.24L14.81,8.62L12,2L9.19,8.62L2,9.24L7.45,13.97L5.82,21L12,17.27Z',
};

const SPEAKERS_SVG = '<svg viewBox="0 0 24 24"><path fill-rule="evenodd" d="M11 2h9a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2h-9a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2Zm4.5 3.4a1.7 1.7 0 1 0 0 3.4a1.7 1.7 0 1 0 0-3.4Zm0 6a3.9 3.9 0 1 0 0 7.8a3.9 3.9 0 1 0 0-7.8Z"/><circle cx="15.5" cy="15.3" r="1.5"/><path d="M7.5 5H4.5A1.5 1.5 0 0 0 3 6.5v11A1.5 1.5 0 0 0 4.5 19h3v-2H5V7h2.5Z"/></svg>';

const LIBRARY_SVG = '<svg viewBox="0 0 24 24"><path d="M4.1 4h2v16h-2zM8.1 4h2v16h-2zM12.4 4.6l1.9-.6 5.5 15.4-1.9.6z"/></svg>';

const EQ_SVG = '<svg viewBox="0 0 24 24"><g stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M5 3v18M12 3v18M19 3v18"/></g><rect x="2" y="13" width="6" height="3.4" rx="1.2"/><rect x="9" y="6" width="6" height="3.4" rx="1.2"/><rect x="16" y="15" width="6" height="3.4" rx="1.2"/></svg>';
const svg = (d) => `<svg viewBox="0 0 24 24"><path d="${d}"/></svg>`;

const TEXT = {
  nothing: 'Nothing playing', sources: 'Sources',
  favorites: 'Favorites', recent: 'Recent', frequent: 'Most played',
  playlist: 'Playlists', album: 'Albums', track: 'Tracks', artist: 'Artists', radio: 'Radio', podcast: 'Podcasts', audiobook: 'Audiobooks',
  loading: 'Loading…', empty: 'Nothing here yet', error: 'Could not load',
  noPlayers: 'No Music Assistant players found', notFound: 'Entity not found',
  reset: 'Reset', custom: 'Custom', on: 'ON', off: 'OFF',
  connecting: 'Connecting to Music Assistant…',
  dynamic: 'Shuffle and repeat are not available in radio mode',
  othersPlaying: 'Music is playing in other rooms',
  info: 'Track info', lyrics: 'Lyrics', aboutArtist: 'Artist', aboutAlbum: 'Album', aboutTrack: 'Track',
  cantGroup: '{a} and {b} can\'t be grouped: Music Assistant only syncs players of the same type (e.g. AirPlay with AirPlay).',
};

const TABS = {
  favorites: { types: ['playlist', 'album', 'track', 'artist', 'radio'], favorite: true, each: 25 },
  recent: { types: ['track'], order_by: 'last_played_desc' },
  frequent: { types: ['track'], order_by: 'play_count_desc' },
  playlist: { types: ['playlist'] },
  artist: { types: ['artist'] },
  album: { types: ['album'] },
  track: { types: ['track'] },
  radio: { types: ['radio'] },
  podcast: { types: ['podcast'] },
  audiobook: { types: ['audiobook'] },
};

const EQ_FREQS = [60, 170, 310, 600, 1000, 3000, 6000, 12000, 14000, 16000];
const EQ_MAX = 12;
const EQ_Q = EQ_FREQS.map((f, i) => {
  const lo = EQ_FREQS[i - 1] || f / 2, hi = EQ_FREQS[i + 1] || Math.min(f * 2, 20000);
  const n = Math.max(0.25, Math.log2(hi / lo) / 2);
  return Math.sqrt(2 ** n) / (2 ** n - 1);
});
const EQ_PRESETS = [
  ['Flat', [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]],
  ['Classical', [0, 0, 0, 0, 0, 0, -7.2, -7.2, -7.2, -9.6]],
  ['Club', [0, 0, 8, 5.6, 5.6, 5.6, 3.2, 0, 0, 0]],
  ['Dance', [9.6, 7.2, 2.4, 0, 0, -5.6, -7.2, -7.2, 0, 0]],
  ['Full Bass', [9.6, 9.6, 9.6, 5.6, 1.6, -4, -8, -10.4, -11.2, -11.2]],
  ['Full Bass & Treble', [7.2, 5.6, 0, -7.2, -4.8, 1.6, 8, 11.2, 12, 12]],
  ['Full Treble', [-9.6, -9.6, -9.6, -4, 2.4, 11.2, 12, 12, 12, 12]],
  ['Laptop / Headphones', [4.8, 11.2, 5.6, -3.2, -2.4, 1.6, 4.8, 9.6, 12, 12]],
  ['Large Hall', [10.4, 10.4, 5.6, 5.6, 0, -4.8, -4.8, -4.8, 0, 0]],
  ['Live', [-4.8, 0, 4, 5.6, 5.6, 5.6, 4, 2.4, 2.4, 2.4]],
  ['Party', [7.2, 7.2, 0, 0, 0, 0, 0, 0, 7.2, 7.2]],
  ['Pop', [-1.6, 4.8, 7.2, 8, 5.6, 0, -2.4, -2.4, -1.6, -1.6]],
  ['Reggae', [0, 0, 0, -5.6, 0, 6.4, 6.4, 0, 0, 0]],
  ['Rock', [8, 4.8, -5.6, -8, -3.2, 4, 8.8, 11.2, 11.2, 11.2]],
  ['Ska', [-2.4, -4.8, -4, 0, 4, 5.6, 8.8, 9.6, 11.2, 9.6]],
  ['Soft', [4.8, 1.6, 0, -2.4, 0, 4, 8, 9.6, 11.2, 12]],
  ['Soft Rock', [4, 4, 2.4, 0, -4, -5.6, -3.2, 0, 2.4, 8.8]],
  ['Techno', [8, 5.6, 0, -5.6, -4.8, 0, 8, 9.6, 9.6, 8.8]],
];
const fLabel = (f) => (f >= 1000 ? `${f / 1000}K` : String(f));

class MAClient {

  constructor(wsUrl, token) {
    this.wsUrl = wsUrl;
    this.token = token;
    this.id = 0;
    this.pending = new Map();
  }
  connect() {
    if (this._p) return this._p;
    this._p = new Promise(async (resolve, reject) => {
      let ws, wsUrl;
      try {
        wsUrl = typeof this.wsUrl === 'function' ? await this.wsUrl() : this.wsUrl;
        ws = new WebSocket(wsUrl);
      } catch (e) { this._p = null; reject(e); return; }
      this.ws = ws;
      let ready = false;
      ws.onmessage = async (ev) => {
        let m; try { m = JSON.parse(ev.data); } catch (_) { return; }
        if (!ready && m.server_id) {
          ready = true;
          if (this.token) {
            try { await this.send('auth', { token: this.token }); } catch (e) { reject(e); return; }
          }
          resolve(this);
          return;
        }
        const p = m.message_id != null && this.pending.get(String(m.message_id));
        if (!p) return;
        if (m.error_code || m.error) { this.pending.delete(String(m.message_id)); p.reject(new Error(m.details || m.error || 'Music Assistant error')); return; }
        if (m.partial) { p.acc = (p.acc || []).concat(m.result || []); return; }
        this.pending.delete(String(m.message_id));
        p.resolve(p.acc ? p.acc.concat(m.result || []) : m.result);
      };
      ws.onerror = () => { if (!ready) { this._p = null; reject(new Error(`Cannot connect to ${wsUrl}`)); } };
      ws.onclose = () => {
        this._p = null;
        for (const p of this.pending.values()) p.reject(new Error('Connection closed'));
        this.pending.clear();
      };
    });
    return this._p;
  }
  send(command, args = {}) {
    const id = String(++this.id);
    return new Promise((resolve, reject) => {
      this.pending.set(id, { resolve, reject });
      this.ws.send(JSON.stringify({ message_id: id, command, args }));
      setTimeout(() => { if (this.pending.has(id)) { this.pending.delete(id); reject(new Error('Timeout')); } }, 10000);
    });
  }
  async cmd(command, args) { await this.connect(); return this.send(command, args); }
}

const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const fmt = (s) => {
  s = Math.max(0, Math.floor(s || 0));
  const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), x = String(s % 60).padStart(2, '0');
  return h ? `${h}:${String(m).padStart(2, '0')}:${x}` : `${m}:${x}`;
};
const hash = (str) => { let h = 2166136261; for (const ch of String(str)) { h ^= ch.charCodeAt(0); h = Math.imul(h, 16777619); } return h >>> 0; };
const mulberry = (seed) => () => {
  seed = (seed + 0x6d2b79f5) | 0;
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};
const sign = (g) => (g > 0 ? `+${g}` : String(g));

const STYLE = `
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
.top{display:flex;align-items:center;justify-content:space-between;gap:10px;min-height:34px}
.source{position:relative;display:grid;place-items:center;width:34px;height:34px;padding:0;flex:none;
  border:0;border-radius:50%;background:none;color:inherit;cursor:pointer;transition:background .15s,transform .1s}
.source:hover{background:rgba(var(--mmp-fg-rgb),.12)}
.source:active{transform:scale(.92)}
.src-icon{width:20px;height:20px;display:grid;place-items:center}
.src-icon svg,.src-icon img{width:20px;height:20px;fill:currentColor;object-fit:contain;display:block}
.top-right{display:flex;align-items:center;justify-content:flex-end;gap:2px;flex:1;min-width:0}
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
.slider{position:relative;height:22px;cursor:pointer;touch-action:none}
.rail{position:absolute;left:0;right:0;top:50%;height:4px;margin-top:-2px;border-radius:2px;background:rgba(var(--mmp-fg-rgb),.28);overflow:hidden}
.fill{position:absolute;left:0;top:0;bottom:0;width:0;background:var(--mmp-accent);border-radius:2px}
.knob{position:absolute;top:50%;left:0;width:12px;height:12px;margin:-6px 0 0 -6px;border-radius:50%;
  background:var(--mmp-accent);box-shadow:0 1px 4px rgba(0,0,0,.35);transition:transform .15s}
.slider:hover .knob,.slider.drag .knob{transform:scale(1.3)}
#vol{flex:0 1 110px;min-width:36px}
.meta{margin-top:10px;min-width:0;position:relative;z-index:1}
.title{font-size:22px;font-weight:700;line-height:1.25;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;text-shadow:0 1px 3px rgba(0,0,0,.45),0 0 14px rgba(0,0,0,.35)}
.artist,.times{text-shadow:0 1px 3px rgba(0,0,0,.45)}
.theme-light .artist,.theme-light .times{text-shadow:0 1px 2px rgba(255,255,255,.6)}
.artist{font-size:15px;opacity:.75;margin-top:1px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.seek{margin:0 -8px}
.viz{position:relative;height:40px;margin-top:-8px}
.viz canvas{position:absolute;inset:0;width:100%;height:100%}
#progress{height:18px}
#progress .knob{width:15px;height:15px;margin:-7.5px 0 0 -7.5px}
#progress.live{pointer-events:none}
#progress.live .knob{display:none}
.times{display:flex;justify-content:space-between;font-size:13px;opacity:.9;font-variant-numeric:tabular-nums;padding:0 1px;line-height:16px}
.controls{display:flex;align-items:center;justify-content:space-between;margin-top:-2px}
.group{display:flex;align-items:center;gap:clamp(2px,2cqi,14px)}
.group.right{gap:2px}
.toggle{opacity:.5}
.toggle.on{opacity:1}
.pw-space{width:34px;height:34px;flex:none}
.panel.open~.power{opacity:0;pointer-events:none}
.power{position:absolute;z-index:6;top:14px;right:18px;color:rgba(var(--mmp-fg-rgb),.9)}
.power.on{color:#3ddc84;filter:drop-shadow(0 0 6px rgba(61,220,132,.75))}
.power.pending{animation:pw-pulse 1s ease-in-out infinite}
@keyframes pw-pulse{50%{opacity:.35}}
.content{transition:filter .4s,opacity .4s}
.off .content{filter:blur(7px) saturate(.6);opacity:.5;pointer-events:none}
.off .power:not(.on){background:rgba(var(--mmp-fg-rgb),.14);box-shadow:0 0 0 1px rgba(var(--mmp-fg-rgb),.25),0 4px 16px rgba(0,0,0,.35)}
[hidden]{display:none!important}
.no-viz .viz{height:14px}
.no-viz .viz canvas{display:none}
.dsp-inline{position:relative;display:flex;height:196px;border-top:1px solid rgba(var(--mmp-fg-rgb),.1);transition:filter .4s,opacity .4s}
.dsp-inline .eq{padding-bottom:10px}
.off .dsp-inline{filter:blur(7px) saturate(.6);opacity:.5;pointer-events:none}
ha-card.glass{-webkit-backdrop-filter:blur(24px) saturate(1.5);backdrop-filter:blur(24px) saturate(1.5)}
ha-card.glass .bg{opacity:.4}
ha-card.theme-light{box-shadow:0 10px 30px rgba(0,0,0,.12)}
.theme-light .title{text-shadow:0 1px 2px rgba(255,255,255,.6)}
.theme-light #roomsBtn.playing,.theme-light .power.on,.theme-light .rpower.on{color:#12884a;filter:none}
.theme-light .btn.muted{color:#d92d2f}
.top-left{display:flex;align-items:center;gap:4px;min-width:0}
.infobtn{opacity:.85}
.info-wrap{flex:1;display:flex;gap:14px;padding:10px 12px 10px 10px;min-width:0}
.info-art{flex:none;height:100%;aspect-ratio:1;border-radius:14px;background:rgba(var(--mmp-fg-rgb),.1) center/cover no-repeat;box-shadow:0 8px 24px rgba(0,0,0,.35)}
.info-col{flex:1;min-width:0;display:flex;flex-direction:column}
.info-head .i-title{font-size:16px;font-weight:700;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.info-head .i-meta{font-size:12px;opacity:.7;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.info-tabs{display:flex;gap:6px;margin:6px 0;overflow-x:auto;scrollbar-width:none;flex:none}
.info-tabs::-webkit-scrollbar{display:none}
.info-body{flex:1;overflow-y:auto;font-size:13px;line-height:1.5;padding-right:6px;white-space:pre-wrap;overflow-wrap:anywhere;scrollbar-width:thin;scrollbar-color:rgba(var(--mmp-fg-rgb),.3) transparent;
  -webkit-mask-image:linear-gradient(transparent,#000 10px,#000 calc(100% - 14px),transparent);mask-image:linear-gradient(transparent,#000 10px,#000 calc(100% - 14px),transparent)}
.ly{opacity:.42;padding:1px 0;cursor:pointer;transition:opacity .25s}
.ly.cur{opacity:1;font-weight:600}
.ly:hover{opacity:.8}
.chips{display:flex;flex-wrap:wrap;gap:4px;margin-top:8px;white-space:normal}
.chip{font-size:11px;padding:2px 8px;border-radius:999px;background:rgba(var(--mmp-fg-rgb),.12)}
.links{margin-top:8px;font-size:12px;white-space:normal}
.links a{color:inherit;opacity:.75;margin-right:10px}
.radio #shuffleBtn,.radio #repeatBtn{display:none}
.radio #prevBtn{visibility:hidden;pointer-events:none}
.toggle.on::after{content:'';position:absolute;bottom:3px;left:50%;width:4px;height:4px;margin-left:-2px;border-radius:50%;background:currentColor}
.play{width:52px;height:52px;border:1.6px solid rgba(var(--mmp-fg-rgb),.85)}
.play svg,.play img{width:26px;height:26px}
.group>.play:first-child{margin-left:12px}

.panel{position:absolute;inset:0;z-index:5;display:flex;
  background:var(--mmp-panel);backdrop-filter:blur(22px) saturate(1.3);-webkit-backdrop-filter:blur(22px) saturate(1.3);
  opacity:0;pointer-events:none;transform:translateY(8px);transition:opacity .2s,transform .2s}
.panel.open{opacity:1;pointer-events:auto;transform:none}
.col{flex:1;display:flex;flex-direction:column;min-width:0}
.tabs{flex:none;display:flex;align-items:center;gap:6px;padding:10px 4px 8px 14px;overflow-x:auto;scrollbar-width:none}
.tabs::-webkit-scrollbar{display:none}
.tab{flex:none;padding:5px 12px;border-radius:999px;border:1px solid rgba(var(--mmp-fg-rgb),.2);background:none;color:inherit;font:inherit;font-size:13px;cursor:pointer;opacity:.8}
.tab.on{background:var(--mmp-accent);color:var(--mmp-on-accent);opacity:1;border-color:var(--mmp-fg)}
.list{flex:1;overflow-y:auto;padding:0 8px 8px;scrollbar-width:thin;scrollbar-color:rgba(var(--mmp-fg-rgb),.3) transparent}
.room-name{white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.msg{padding:20px;text-align:center;opacity:.75;font-size:13px}

.wheel{position:relative;flex:none;width:132px;overflow-y:auto;scrollbar-width:none;scroll-snap-type:y mandatory;
  display:flex;flex-direction:column;align-items:center;perspective:260px;padding:0 4px 0 10px;
  -webkit-mask-image:linear-gradient(transparent,#000 18%,#000 82%,transparent);mask-image:linear-gradient(transparent,#000 18%,#000 82%,transparent)}
.wheel::-webkit-scrollbar{display:none}
.wpad{flex:none}
.wtab{flex:none;height:30px;margin:2px 0;padding:0 14px;border-radius:999px;border:1px solid rgba(var(--mmp-fg-rgb),.22);
  background:rgba(var(--mmp-fg-rgb),.06);color:inherit;font:inherit;font-size:13px;cursor:pointer;white-space:nowrap;
  scroll-snap-align:center;transition:background .2s,color .2s,border-color .2s;will-change:transform}
.wtab.on{background:var(--mmp-accent);color:var(--mmp-on-accent);border-color:var(--mmp-fg);font-weight:600}
.vline{flex:none;width:1px;margin:22px 0;background:linear-gradient(transparent,rgba(var(--mmp-fg-rgb),.5),transparent)}
.tiles{flex:1;min-width:0;display:flex;align-items:center;gap:12px;overflow-x:auto;overflow-y:hidden;padding:10px 16px 10px 14px;
  scroll-snap-type:x proximity;scrollbar-width:none;
  -webkit-mask-image:linear-gradient(90deg,transparent,#000 14px,#000 calc(100% - 28px),transparent);mask-image:linear-gradient(90deg,transparent,#000 14px,#000 calc(100% - 28px),transparent)}
.tiles::-webkit-scrollbar{display:none}
.tiles .msg{flex:1}
.tile{flex:none;width:96px;cursor:pointer;scroll-snap-align:start}
.cover{width:96px;height:96px;border-radius:12px;background:rgba(var(--mmp-fg-rgb),.12) center/cover no-repeat;display:grid;place-items:center;
  box-shadow:0 6px 16px rgba(0,0,0,.3);transition:transform .15s}
.cover svg{width:30px;height:30px;opacity:.5;fill:var(--mmp-fg)}
.tile:hover .cover{transform:translateY(-2px) scale(1.03)}
.tile.artist .cover{border-radius:50%}
.t-name,.t-sub{white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.t-name{font-size:12.5px;font-weight:600;margin-top:6px}
.t-sub{font-size:11px;opacity:.6}

.rooms{padding-top:6px}
.room{padding:0 12px 0 4px;border-radius:10px}
.rline{display:flex;align-items:center;gap:4px;min-height:36px}
.room+.room{border-top:1px solid rgba(var(--mmp-fg-rgb),.07)}
.rnow{display:flex;align-items:center;gap:2px;margin:-4px 0 4px 32px;padding:2px 8px 4px 2px;border-radius:12px;background:rgba(var(--mmp-fg-rgb),.07)}
.rnow .btn{width:26px;height:26px}
.rnow .btn svg{width:16px;height:16px}
.rtrack{flex:1;min-width:0;padding-left:4px}
.rt{font-size:11.5px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;opacity:.85;line-height:15px}
.rseek{position:relative;height:9px;cursor:pointer;touch-action:none}
.rseek .rail{height:2.5px;margin-top:-1.25px}
.rseek .knob{width:8px;height:8px;margin:-4px 0 0 -4px}
.rseek.live{pointer-events:none}
.rseek.live .knob{display:none}
.rpower{opacity:.8}
.rpower.on{color:#3ddc84;opacity:1;filter:drop-shadow(0 0 4px rgba(61,220,132,.7))}
.room.poweroff .rline>*:not(.rpower):not(.room-name),.room.poweroff .rnow{opacity:.3;pointer-events:none}
.room.poweroff .room-name{opacity:.45}
#roomsBtn.playing{color:#3ddc84;filter:drop-shadow(0 0 5px rgba(61,220,132,.7))}
.room-name{flex:0 0 30%;font-size:14px;font-weight:500;opacity:.75}
.room.active .room-name{opacity:1}
.room .slider{flex:1;margin:0 4px}
.pct{width:34px;text-align:right;font-size:12px;opacity:.75;font-variant-numeric:tabular-nums}
.btn.muted{color:#ff4d4f;opacity:1}
.link{opacity:.4}
.link.on{opacity:1;background:rgba(var(--mmp-fg-rgb),.2)}
.mainmark{opacity:.8;cursor:default}
.mainmark:hover{background:none}

.eq{flex:1;display:flex;flex-direction:column;padding:8px 12px 10px 12px;min-width:0;gap:4px}
.eq-bar{display:flex;align-items:center;gap:6px;min-width:0}
.pill{flex:none;height:28px;padding:0 12px;border-radius:999px;border:1px solid rgba(var(--mmp-fg-rgb),.25);background:none;color:inherit;font:inherit;font-size:12px;font-weight:600;cursor:pointer;letter-spacing:.04em}
.pill.on{background:var(--mmp-accent);color:var(--mmp-on-accent);border-color:var(--mmp-fg)}
.preset{flex:none;display:flex;align-items:center;gap:2px;background:rgba(var(--mmp-fg-rgb),.1);border-radius:999px;padding:0 2px}
.pname{min-width:120px;text-align:center;font-size:13px;font-weight:600;white-space:nowrap}
.eq-status{font-size:12px;opacity:.65;margin-left:auto;padding-right:6px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.eq-bands{position:relative;display:flex;justify-content:space-between;gap:2px;flex:1;min-height:0;border-radius:12px;background:rgba(0,0,0,.18);padding:2px 4px}
.eq-bands canvas{position:absolute;inset:0;width:100%;height:100%;pointer-events:none}
.band{position:relative;z-index:1;flex:1;display:flex;flex-direction:column;align-items:center;min-width:0}
.band.pre{margin-right:8px;padding-right:8px;border-right:1px solid rgba(var(--mmp-fg-rgb),.12)}
.bv,.bf{font-size:11px;opacity:.8;font-variant-numeric:tabular-nums;line-height:16px}
.bf{opacity:.6}
.vs{position:relative;flex:1;width:28px;cursor:pointer;touch-action:none}
.vrail{position:absolute;top:0;bottom:0;left:50%;width:4px;margin-left:-2px;border-radius:2px;background:rgba(var(--mmp-fg-rgb),.14)}
.vzero{position:absolute;left:50%;width:12px;margin-left:-6px;top:50%;height:1px;background:rgba(var(--mmp-fg-rgb),.35)}
.vfill{position:absolute;left:50%;width:4px;margin-left:-2px;border-radius:2px;background:var(--mmp-accent)}
.vknob{position:absolute;left:50%;width:22px;height:10px;margin:-5px 0 0 -11px;border-radius:4px;background:var(--mmp-accent);box-shadow:0 1px 4px rgba(0,0,0,.4)}
.eq.disabled .eq-bands{opacity:.4}

@container (max-width:300px){
  .top .btn.sm,.pw-space{width:30px;height:30px}
  .power{width:30px;height:30px;top:16px}
  .divider{margin:0 3px}
  .source{width:30px;height:30px}
}
@container (max-width:340px){
  .controls .btn{width:34px;height:34px}
  .controls .btn svg,.controls .btn img{width:20px;height:20px}
  .controls .play{width:46px;height:46px}
  .group>.play:first-child{margin-left:6px}
  .content{padding-left:14px;padding-right:12px}
  .power{right:12px}
}
@container (max-width:420px){
  .title{font-size:18px}
  .artist{font-size:13px}
  .room-name{flex-basis:28%;font-size:13px}
  .pname{min-width:90px}
  .info-art{display:none}
  .wheel{width:112px}
  .tile,.cover{width:84px}
  .cover{height:84px}
  .vs{width:22px}
  .bv,.bf{font-size:10px}
  .band.pre{margin-right:4px;padding-right:4px}
}
`;

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

const ALL_TABS = ['favorites', 'recent', 'frequent', 'playlist', 'artist', 'album', 'track', 'radio', 'podcast', 'audiobook'];
const DEFAULTS = {
  show_previous: true,
  show_eq: true,
  show_source: true,
  show_multiroom: true,
  show_spectrum: true,
  show_info: true,
  sync_group_volume: true,
  blur: 2,
  library_limit: 50,
  source_tabs: ['favorites', 'recent', 'frequent', 'playlist', 'artist', 'album', 'track', 'radio'],
};
const ICON_KEYS = ['info', 'play', 'pause', 'next', 'previous', 'shuffle', 'repeat', 'repeat_one', 'volume', 'mute', 'multiroom', 'source', 'dsp', 'power'];

const POWER_MAPS = {};
function collectPower(node, map) {
  if (Array.isArray(node)) { node.forEach((n) => collectPower(n, map)); return; }
  if (!node || typeof node !== 'object') return;
  if (['custom:maestro-player-card', 'custom:maestro-player-badge', 'custom:ma-mini-player-card', 'custom:ma-mini-player-badge'].includes(node.type) && node.entity && node.power_entity && node.show_power !== false) {
    map[node.entity] = node.power_entity;
  }
  if (node.power_entities && typeof node.power_entities === 'object') Object.assign(map, node.power_entities);
  Object.values(node).forEach((v) => { if (v && typeof v === 'object') collectPower(v, map); });
}
function loadPowerMap(hass) {
  const seg = location.pathname.split('/')[1] || 'lovelace';
  if (!POWER_MAPS[seg]) {
    POWER_MAPS[seg] = hass.callWS({ type: 'lovelace/config', url_path: seg === 'lovelace' ? null : seg })
      .then((cfg) => { const m = {}; collectPower(cfg, m); return m; })
      .catch(() => ({}));
  }
  return POWER_MAPS[seg];
}

class MaMiniPlayerCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._libCache = {};
    this._panel = null;
    this._seekFrac = null;
    this._volFrac = null;
    this._roomDrag = {};
    this._eq = { enabled: true, preamp: 0, gains: EQ_FREQS.map(() => 0) };
    this._loop = (t) => { this._raf = requestAnimationFrame(this._loop); try { this._tick(t); } catch (e) {} };
  }

  static getConfigElement() { return document.createElement(`${TAG}-editor`); }

  static getStubConfig(hass) {
    const ids = Object.keys(hass?.states || {}).filter((id) => id.startsWith('media_player.'));
    const isMa = (id) => hass.entities?.[id]?.platform === 'music_assistant';
    const ok = (id) => !['unavailable', 'unknown'].includes(hass.states[id].state);
    const ma = ids.find((id) => isMa(id) && ok(id)) || ids.find(isMa);
    return { entity: ma || ids[0] || 'media_player.music_assistant' };
  }

  setConfig(config) {
    if (!config || !config.entity) throw new Error('Please define "entity" (a Music Assistant media_player)');
    this._config = { ...DEFAULTS, icons: {}, ...config };
    if (Array.isArray(config.shade)) {
      if (config.shade_top === undefined) this._config.shade_top = config.shade[0];
      if (config.shade_bottom === undefined) this._config.shade_bottom = config.shade[1];
    }
    this._ma = null;
    this._dspLoaded = false;
    this._build();
    if (this._hass) this._update();
  }

  set hass(hass) {
    this._hass = hass;
    if (!this._els) return;
    this._update();
    const di = this.shadowRoot.getElementById('dspInline');
    if (di) di.hidden = !this._maAvailable();
    if (this._config.dsp_inline && !this._inlineDone && this._maAvailable()) {
      this._inlineDone = true;
      this._dspLoaded = false;
      this._renderEq(this.shadowRoot.getElementById('dspInline'), true);
    }
    if (this._panel === 'rooms') this._updateRooms();
  }

  getCardSize() { return 4; }

  getGridOptions() { return { columns: 'full', rows: 'auto', min_columns: 12, min_rows: 4 }; }

  connectedCallback() { if (!this._raf) this._raf = requestAnimationFrame(this._loop); }
  disconnectedCallback() { cancelAnimationFrame(this._raf); this._raf = null; clearInterval(this._ingressKeep); this._watchOutside(false); }

  get _t() { return TEXT; }
  _state(id = this._config.entity) { return this._hass?.states?.[id]; }
  _call(service, data = {}, entity = this._config.entity) {
    return this._hass.callService('media_player', service, { entity_id: entity, ...data });
  }

  _icon(name, fallback) {
    const src = this._config.icons?.[name];
    return src ? `<img src="${esc(src)}" alt="" draggable="false">` : fallback;
  }
  _url(u) {
    if (!u) return null;
    return u.startsWith('/') && this._hass?.hassUrl ? this._hass.hassUrl(u) : u;
  }

  _build() {
    const c = this._config;
    const th = resolveTheme(c);
    this._theme = th;
    const cls = [c.show_spectrum ? '' : 'no-viz', th.glass ? 'glass' : '', `theme-${th.name}`].join(' ');
    this.shadowRoot.innerHTML = `
      <style>${STYLE}</style>
      <ha-card id="card" class="${cls}" style="--mmp-blur:${Number(c.blur) || 0}px;${th.vars}">
        <div class="bg" id="bg"></div><div class="shade"></div>
        <div class="content">
          <div class="top">
            <div class="top-left">
              <button class="source" id="sourceBtn" ${c.show_source ? '' : 'hidden'}><span class="src-icon">${this._icon('source', LIBRARY_SVG)}</span></button>
              ${c.show_info ? `<button class="btn sm infobtn" id="infoBtn" hidden>${this._icon('info', svg(P.info))}</button>` : ''}
            </div>
            <div class="top-right">
              <button class="btn sm" id="muteBtn"></button>
              <div class="slider" id="vol"><div class="rail"><div class="fill"></div></div><div class="knob"></div></div>
              <span class="divider" ${c.show_multiroom ? '' : 'hidden'}></span>
              <button class="btn sm" id="roomsBtn" ${c.show_multiroom ? '' : 'hidden'}>${this._icon('multiroom', SPEAKERS_SVG)}</button>
              ${this._hasPower() ? '<span class="divider"></span><span class="pw-space"></span>' : ''}
            </div>
          </div>
          <div class="meta"><div class="title" id="title"></div><div class="artist" id="artist"></div></div>
          <div class="seek">
            <div class="viz"><canvas id="viz"></canvas></div>
            <div class="slider" id="progress"><div class="rail"><div class="fill"></div></div><div class="knob"></div></div>
            <div class="times"><span id="pos">0:00</span><span id="dur">0:00</span></div>
          </div>
          <div class="controls">
            <div class="group">
              ${c.show_previous ? `<button class="btn" id="prevBtn">${this._icon('previous', svg(P.previous))}</button>` : ''}
              <button class="btn play" id="playBtn"></button>
              <button class="btn" id="nextBtn">${this._icon('next', svg(P.next))}</button>
            </div>
            <div class="group right">
              <button class="btn toggle" id="shuffleBtn">${this._icon('shuffle', svg(P.shuffle))}</button>
              <button class="btn toggle" id="repeatBtn"></button>
              ${c.show_eq && !c.dsp_inline ? `<button class="btn toggle" id="eqBtn">${this._icon('dsp', EQ_SVG)}</button>` : ''}
            </div>
          </div>
        </div>
        ${c.dsp_inline ? '<div class="dsp-inline" id="dspInline"></div>' : ''}
        <div class="panel" id="panel"></div>
        ${this._hasPower() ? `<button class="btn sm power" id="powerBtn">${this._icon('power', svg(P.power))}</button>` : ''}
      </ha-card>`;
    const $ = (id) => this.shadowRoot.getElementById(id);
    this._els = {
      card: $('card'), bg: $('bg'), title: $('title'), artist: $('artist'),
      vol: $('vol'), muteBtn: $('muteBtn'), progress: $('progress'), canvas: $('viz'), pos: $('pos'), dur: $('dur'),
      info: $('infoBtn'),
      shuffle: $('shuffleBtn'), play: $('playBtn'), repeat: $('repeatBtn'), eqBtn: $('eqBtn'), panel: $('panel'), power: $('powerBtn'),
    };
    this._cache = {};
    this._pic = undefined;
    this._panel = null;
    this._inlineDone = false;

    if (this._els.power) this._els.power.onclick = () => this._togglePower();
    $('sourceBtn').onclick = () => this._togglePanel('src');
    if (this._els.info) this._els.info.onclick = () => this._togglePanel('info');
    $('roomsBtn').onclick = () => this._togglePanel('rooms');
    if (this._els.eqBtn) this._els.eqBtn.onclick = () => this._togglePanel('eq');
    this._els.muteBtn.onclick = () => this._muteAll();
    this._els.shuffle.onclick = () => this._queueToggle('shuffle', () => ({ shuffle: !this._state()?.attributes.shuffle }));
    this._els.repeat.onclick = () => this._queueToggle('repeat', () => {
      const order = ['off', 'all', 'one'];
      const cur = this._state()?.attributes.repeat || 'off';
      return { repeat: order[(order.indexOf(cur) + 1) % 3] };
    });
    this._els.play.onclick = () => this._call('media_play_pause');
    $('nextBtn').onclick = () => this._call('media_next_track');
    if ($('prevBtn')) $('prevBtn').onclick = () => this._call('media_previous_track');

    this._drag(this._els.progress, (f) => { this._seekFrac = f; }, (f) => {
      const dur = +this._state()?.attributes.media_duration || 0;
      if (dur) this._call('media_seek', { seek_position: Math.round(f * dur) });
      clearTimeout(this._seekT);
      this._seekT = setTimeout(() => { this._seekFrac = null; }, 1500);
    });

    let last = 0;
    this._drag(this._els.vol, (f) => {
      this._volFrac = f; this._setSlider(this._els.vol, f);
      const now = Date.now(); if (now - last > 250) { last = now; this._setMasterVolume(f); }
    }, (f) => {
      this._setMasterVolume(f);
      clearTimeout(this._volT);
      this._volT = setTimeout(() => { this._volFrac = null; }, 1500);
    });
  }

  _drag(el, onMove, onEnd, axis = 'x') {
    const frac = (e) => {
      const r = el.getBoundingClientRect();
      return axis === 'x' ? clamp((e.clientX - r.left) / r.width) : clamp(1 - (e.clientY - r.top) / r.height);
    };
    el.addEventListener('pointerdown', (e) => {
      e.preventDefault();
      el.setPointerCapture(e.pointerId);
      el.classList.add('drag');
      onMove(frac(e));
      const move = (ev) => onMove(frac(ev));
      const up = (ev) => {
        el.classList.remove('drag');
        el.removeEventListener('pointermove', move);
        el.removeEventListener('pointerup', up);
        el.removeEventListener('pointercancel', up);
        onEnd(frac(ev));
      };
      el.addEventListener('pointermove', move);
      el.addEventListener('pointerup', up);
      el.addEventListener('pointercancel', up);
    });
  }

  _setSlider(el, f) {
    el.querySelector('.fill').style.width = `${f * 100}%`;
    el.querySelector('.knob').style.left = `${f * 100}%`;
  }

  _html(key, el, html) { if (this._cache[key] !== html) { this._cache[key] = html; el.innerHTML = html; } }

  _update() {
    const st = this._state();
    const t = this._t;
    const e = this._els;
    this._updatePower();
    this.shadowRoot.getElementById('sourceBtn').title = t.sources;
    if (!st) {
      e.title.textContent = `${t.notFound}: ${this._config.entity}`;
      e.artist.textContent = '';
      return;
    }
    const a = st.attributes;
    const active = !!(['playing', 'paused', 'buffering'].includes(st.state) && (a.media_title || a.media_content_id));
    this._active = active;
    e.title.textContent = active ? (a.media_title || '') : t.nothing;
    e.artist.textContent = active ? (a.media_artist || a.media_album_name || '') : (a.friendly_name || '');
    this._seedKey = `${a.media_title}|${a.media_artist}`;

    const playing = st.state === 'playing';
    this._html('play', e.play, playing ? this._icon('pause', svg(P.pause)) : this._icon('play', svg(P.play)));
    e.shuffle.classList.toggle('on', !!a.shuffle);
    const rep = a.repeat || 'off';
    e.repeat.classList.toggle('on', rep !== 'off');
    this._html('repeat', e.repeat, rep === 'one' ? this._icon('repeat_one', svg(P.repeat_one)) : this._icon('repeat', svg(P.repeat)));
    this._html('mute', e.muteBtn, a.is_volume_muted ? this._icon('mute', svg(P.mute)) : this._icon('volume', svg(P.volume)));
    e.muteBtn.classList.toggle('muted', !!a.is_volume_muted);
    if (this._volFrac == null) this._setSlider(e.vol, clamp(+a.volume_level || 0));
    const roomsBtn = this.shadowRoot.getElementById('roomsBtn');
    if (roomsBtn) {
      const playing = this._othersPlaying();
      roomsBtn.classList.toggle('playing', playing);
      roomsBtn.title = playing ? this._t.othersPlaying : '';
    }
    if (e.eqBtn) e.eqBtn.hidden = !this._maAvailable();
    if (e.eqBtn) e.eqBtn.classList.toggle('on', this._panel === 'eq' || (this._dspLoaded && this._eq.enabled && this._eq.gains.some((g) => g)));

    const dur = +a.media_duration || 0;
    e.dur.textContent = active ? (dur ? fmt(dur) : 'LIVE') : '0:00';
    e.progress.classList.toggle('live', !active || !dur);
    this._live = active && (!dur || /:\/\/radio\//.test(a.media_content_id || ''));
    this._applyRadio();

    clearTimeout(this._dynT);
    this._dynT = setTimeout(() => this._checkDynamic(false), 400);
    this._scheduleInfo(active ? a.media_content_id : null);

    const pic = active && this._theme?.art ? (a.entity_picture_local || a.entity_picture) : null;
    if (pic !== this._pic) {
      this._pic = pic;
      const url = this._url(pic);
      e.bg.style.backgroundImage = url ? `url("${url.replace(/"/g, '%22')}")` : '';
    }
  }

  _position(st) {
    const a = st.attributes;
    let p = +a.media_position || 0;
    if (st.state === 'playing' && a.media_position_updated_at) {
      p += (Date.now() - new Date(a.media_position_updated_at).getTime()) / 1000;
    }
    const d = +a.media_duration || 0;
    return d ? Math.min(p, d) : p;
  }

  _tick(time) {
    if (!this._config || !this._els) return;
    const st = this._state();
    if (!st) return;
    const dt = this._lastT ? Math.min(0.1, (time - this._lastT) / 1000) : 0.016;
    this._lastT = time;
    const active = this._active;
    const dur = active ? +st.attributes.media_duration || 0 : 0;
    const pos = active ? this._position(st) : 0;
    const frac = this._seekFrac != null ? this._seekFrac : dur ? clamp(pos / dur) : 0;
    if (frac !== this._lastFrac) { this._lastFrac = frac; this._setSlider(this._els.progress, frac); }
    const txt = fmt(this._seekFrac != null ? this._seekFrac * dur : pos);
    if (txt !== this._lastPos) { this._lastPos = txt; this._els.pos.textContent = txt; }
    this._drawViz(dt, active && !dur ? 1 : frac, st.state === 'playing');
    if (this._panel === 'eq' || this._config.dsp_inline) this._drawEqGraph();
    if (this._panel === 'info' && this._lrc && this._infoTab === 'lyrics') this._syncLyrics(st);
    if (this._panel === 'rooms' && time - (this._roomsT || 0) > 500) { this._roomsT = time; this._roomsProgress(); }
  }

  _drawViz(dt, frac, playing) {
    const cv = this._els.canvas;
    const w = cv.clientWidth, h = cv.clientHeight;
    if (!w || !h) return;
    const dpr = window.devicePixelRatio || 1;
    if (cv.width !== Math.round(w * dpr) || cv.height !== Math.round(h * dpr)) {
      cv.width = Math.round(w * dpr); cv.height = Math.round(h * dpr);
    }
    const step = 7, bw = 3;
    const n = Math.max(16, Math.floor(w / step));
    const key = `${this._seedKey}|${n}`;
    if (key !== this._barKey) {
      this._barKey = key;
      this._env = makeEnvelope(this._seedKey, n);
      if (!this._vz || this._vz.n !== n) {
        this._vz = { n, h: new Float32Array(n), peak: new Float32Array(n), pv: new Float32Array(n), hold: new Float32Array(n), target: new Float32Array(n) };
      }
    }
    const vz = this._vz;

    this._kick = (this._kick || 0) * Math.exp(-dt * 7);
    this._beatT = (this._beatT || 0) - dt;
    if (playing && this._beatT <= 0) { this._beatT = 60 / (100 + Math.random() * 30); this._kick = 1; }
    this._acc = (this._acc || 0) + dt;
    const resample = this._acc > 0.045;
    if (resample) this._acc = 0;

    for (let i = 0; i < n; i++) {
      const x = i / (n - 1);
      if (resample) {
        vz.target[i] = playing
          ? clamp(this._env[i] * (0.25 + 0.75 * Math.random() ** 1.6) + this._kick * Math.max(0, 1 - x * 2.5) * 0.5 * this._env[i])
          : 0;
      }
      const tg = vz.target[i];
      if (tg > vz.h[i]) vz.h[i] = tg;
      else vz.h[i] = Math.max(tg, vz.h[i] - dt * 1.6);
      if (vz.h[i] >= vz.peak[i]) { vz.peak[i] = vz.h[i]; vz.pv[i] = 0; vz.hold[i] = 0.3; }
      else if (vz.hold[i] > 0) vz.hold[i] -= dt;
      else { vz.pv[i] += dt * 0.9; vz.peak[i] = Math.max(vz.h[i], vz.peak[i] - vz.pv[i] * dt); }
    }

    const ctx = cv.getContext('2d');
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, w, h);
    const cap = 1.6, gap = 2, top = h - cap - gap;
    const off = (w - n * step) / 2 + (step - bw) / 2;
    for (let i = 0; i < n; i++) {
      const x = off + i * step;
      const played = (x + bw / 2) / w <= frac;
      const bh = Math.max(2, top * vz.h[i]);
      ctx.fillStyle = played ? `rgba(${this._theme.accent},.88)` : `rgba(${this._theme.fg},.36)`;
      ctx.beginPath();
      if (ctx.roundRect) ctx.roundRect(x, h - bh, bw, bh, 1.2); else ctx.rect(x, h - bh, bw, bh);
      ctx.fill();
      if (vz.peak[i] > 0.02) {
        ctx.fillStyle = played ? `rgba(${this._theme.accent},.95)` : `rgba(${this._theme.fg},.6)`;
        ctx.fillRect(x - 0.5, h - top * vz.peak[i] - gap - cap, bw + 1, cap);
      }
    }
  }

  _hasPower() { return !!this._config.power_entity && this._config.show_power !== false; }

  _powerOn() {
    const id = this._config.power_entity;
    if (!this._hasPower()) return true;
    const ps = this._state(id);
    return !!ps && !['off', 'standby', 'unavailable', 'unknown'].includes(ps.state);
  }

  _updatePower() {
    const btn = this._els.power;
    if (!btn) return;
    const on = this._powerOn();
    if (this._pwPending != null && on === this._pwPending) { this._pwPending = null; clearTimeout(this._pwT); }
    btn.classList.toggle('on', on);
    btn.classList.toggle('pending', this._pwPending != null);
    btn.title = this._name(this._config.power_entity);
    this._els.card.classList.toggle('off', !on);
    if (!on && this._panel) this._togglePanel(this._panel);
  }

  _togglePower() {
    const id = this._config.power_entity;
    const turnOn = !this._powerOn();
    const domain = id.split('.')[0];
    const svc = turnOn ? 'turn_on' : 'turn_off';
    if (['media_player', 'switch', 'light', 'input_boolean', 'fan'].includes(domain)) this._hass.callService(domain, svc, { entity_id: id });
    else this._hass.callService('homeassistant', svc, { entity_id: id });
    this._pwPending = turnOn;
    clearTimeout(this._pwT);
    this._pwT = setTimeout(() => { this._pwPending = null; this._updatePower(); }, 20000);
    this._updatePower();
  }

  _scheduleInfo(uri) {
    if (!this._config.show_info || !this._els.info) return;
    if (uri === this._infoUri) return;
    this._infoUri = uri;
    this._info = null;
    this._lrc = null;
    this._els.info.hidden = true;
    if (this._panel === 'info') this._togglePanel('info');
    clearTimeout(this._infoT);
    if (!uri || !this._maAvailable()) return;
    this._infoT = setTimeout(() => this._loadInfo(uri), 900);
  }

  async _loadInfo(uri) {
    let info = null;
    try { info = await this._infoGet(); } catch (_) { info = null; }
    if (uri !== this._infoUri) return;
    const has = info && (info.lyrics || info.lrc_lyrics || info.artist_description || info.album_description || info.album_review || info.track_description);
    this._info = has ? info : null;
    this._els.info.hidden = !has;
  }

  async _infoGet() {
    if (this._companion()) return this._hass.callWS({ type: 'maestro_player/media/info', entity_id: this._config.entity });

    const ma = this._maClient();
    const uri = this._state()?.attributes.media_content_id;
    const get = (u) => ma.cmd('music/item_by_uri', { uri: u }).catch(() => null);
    const img = (it) => (it?.metadata?.images || []).find((x) => String(x.path || '').startsWith('http'))?.path || null;
    const track = (await get(uri)) || {};
    const m = track.metadata || {};
    const info = { uri, title: track.name, image: img(track), track_description: m.description, genres: m.genres || [], links: m.links || [] };
    if (track.media_type === 'track') {
      const ly = await ma.cmd('metadata/get_track_lyrics', { track }).catch(() => null);
      if (Array.isArray(ly)) [info.lyrics, info.lrc_lyrics] = ly; else if (typeof ly === 'string') info.lyrics = ly;
    }
    const ar = track.artists?.[0]?.uri ? await get(track.artists[0].uri) : null;
    if (ar) { info.artist = ar.name; info.artist_description = ar.metadata?.description; if (!info.genres.length) info.genres = ar.metadata?.genres || []; if (!info.links.length) info.links = ar.metadata?.links || []; }
    const al = track.album?.uri ? await get(track.album.uri) : null;
    if (al) { info.album = al.name; info.year = al.year; info.album_description = al.metadata?.description; info.album_review = al.metadata?.review; info.image = info.image || img(al); }
    return info;
  }

  _renderInfo() {
    const t = this._t, i = this._info || {};
    const a = this._state()?.attributes || {};
    const pic = this._url(a.entity_picture_local || a.entity_picture) || i.image;
    const tabs = [];
    if (i.lrc_lyrics || i.lyrics) tabs.push(['lyrics', t.lyrics]);
    if (i.artist_description) tabs.push(['artist', t.aboutArtist]);
    if (i.album_description || i.album_review) tabs.push(['album', t.aboutAlbum]);
    if (i.track_description) tabs.push(['track', t.aboutTrack]);
    if (!tabs.some(([k]) => k === this._infoTab)) this._infoTab = tabs[0]?.[0];
    const meta = [i.artist || a.media_artist, i.album || a.media_album_name, i.year].filter(Boolean).join(' · ');
    this._els.panel.innerHTML = `
      <div class="info-wrap">
        <div class="info-art" ${pic ? `style="background-image:url('${esc(pic)}')"` : ''}></div>
        <div class="info-col">
          <div class="info-head"><div class="i-title">${esc(i.title || a.media_title || '')}</div><div class="i-meta">${esc(meta)}</div></div>
          <div class="info-tabs">${tabs.length > 1 ? tabs.map(([k, l]) => `<button class="tab ${k === this._infoTab ? 'on' : ''}" data-itab="${k}">${esc(l)}</button>`).join('') : ''}</div>
          <div class="info-body" id="infoBody"></div>
        </div>
      </div>`;
    this._bindClose();
    this._els.panel.querySelectorAll('[data-itab]').forEach((b) => {
      b.onclick = () => {
        this._infoTab = b.dataset.itab;
        this._els.panel.querySelectorAll('[data-itab]').forEach((x) => x.classList.toggle('on', x === b));
        this._fillInfoBody();
      };
    });
    this._fillInfoBody();
  }

  _fillInfoBody() {
    const body = this.shadowRoot.getElementById('infoBody');
    if (!body) return;
    const i = this._info || {};
    this._lrc = null;
    this._lyIdx = -1;
    const chips = (i.genres || []).length ? `<div class="chips">${i.genres.slice(0, 8).map((g) => `<span class="chip">${esc(g)}</span>`).join('')}</div>` : '';
    const links = (i.links || []).length ? `<div class="links">${i.links.slice(0, 6).map((l) => `<a href="${esc(l.url)}" target="_blank" rel="noopener noreferrer">${esc(l.type || 'link')}</a>`).join('')}</div>` : '';
    body.scrollTop = 0;
    if (this._infoTab === 'lyrics') {
      const lrc = parseLrc(i.lrc_lyrics);
      if (lrc.length) {
        this._lrc = lrc;
        body.innerHTML = lrc.map((l, n) => `<div class="ly" data-n="${n}">${esc(l.text) || '&nbsp;'}</div>`).join('');
        body.querySelectorAll('.ly').forEach((el) => {
          el.onclick = () => this._call('media_seek', { seek_position: Math.max(0, Math.round(lrc[+el.dataset.n].t)) });
        });
        const pause = () => { this._lyHold = Date.now() + 4000; };
        body.addEventListener('wheel', pause, { passive: true });
        body.addEventListener('touchstart', pause, { passive: true });
      } else body.textContent = i.lyrics || '';
    } else if (this._infoTab === 'artist') body.innerHTML = `${esc(i.artist_description)}${chips}${links}`;
    else if (this._infoTab === 'album') body.innerHTML = `${esc([i.album_description, i.album_review].filter(Boolean).join('\n\n'))}${i.label ? `<div class="chips"><span class="chip">${esc(i.label)}</span></div>` : ''}`;
    else body.innerHTML = `${esc(i.track_description)}${chips}`;
  }

  _syncLyrics(st) {
    const pos = this._position(st) + 0.3;
    let idx = -1;
    for (let n = 0; n < this._lrc.length && this._lrc[n].t <= pos; n++) idx = n;
    if (idx === this._lyIdx) return;
    this._lyIdx = idx;
    const body = this.shadowRoot.getElementById('infoBody');
    if (!body) return;
    body.querySelectorAll('.ly.cur').forEach((x) => x.classList.remove('cur'));
    const el = body.querySelector(`.ly[data-n="${idx}"]`);
    if (!el) return;
    el.classList.add('cur');
    if (Date.now() > (this._lyHold || 0)) body.scrollTo({ top: el.offsetTop - body.clientHeight / 2 + el.offsetHeight / 2, behavior: 'smooth' });
  }

  _notify(message) {
    this.dispatchEvent(new CustomEvent('hass-notification', { detail: { message }, bubbles: true, composed: true }));
  }

  _queueToggle(attr, data) {
    if (this._dynamic) { this._notify(this._t.dynamic); return; }
    const before = this._state()?.attributes[attr];
    this._call(`${attr}_set`, data());

    clearTimeout(this._qtT);
    this._qtT = setTimeout(async () => {
      if (this._state()?.attributes[attr] !== before) return;
      await this._checkDynamic(true);
      if (this._dynamic) this._notify(this._t.dynamic);
    }, 2000);
  }

  async _checkDynamic(force) {
    const st = this._state();
    const q = st?.attributes.active_queue;
    const key = `${q}|${st?.attributes.media_content_id}`;
    if (!q || !this._active || !this._maAvailable()) { this._dynKey = null; this._setDynamic(false); return; }
    if (!force && key === this._dynKey) return;
    if (!force) {

      clearTimeout(this._dyn2T);
      this._dyn2T = setTimeout(() => this._checkDynamic(true), 3000);
    }
    this._dynKey = key;
    try {
      this._setDynamic(await this._queueIsDynamic(q));
    } catch (_) {}
  }

  _setDynamic(v) {
    this._dynamic = v;
    this._applyRadio();
  }

  _applyRadio() {
    const radio = !!(this._dynamic || this._live);
    this._els.card.classList.toggle('radio', radio);
  }

  _muteAll() {
    const st = this._state();
    if (!st) return;
    const mute = !st.attributes.is_volume_muted;
    const ids = new Set([this._config.entity, ...(st.attributes.group_members || [])]);
    for (const id of this._maPlayers()) if (this._state(id)?.state === 'playing') ids.add(id);
    for (const id of ids) if (this._state(id)) this._call('volume_mute', { is_volume_muted: mute }, id);
  }

  _setMasterVolume(v) {
    const st = this._state();
    if (!st) return;
    v = Math.round(clamp(v) * 100) / 100;
    const cur = +st.attributes.volume_level || 0;
    this._call('volume_set', { volume_level: v });
    if (!this._config.sync_group_volume) return;
    const members = (st.attributes.group_members || []).filter((id) => id !== this._config.entity && this._state(id));
    const d = v - cur;
    for (const id of members) {
      const mv = +this._state(id).attributes.volume_level || cur;
      this._call('volume_set', { volume_level: Math.round(clamp(mv + d) * 100) / 100 }, id);
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
    if (kind === 'eq' && !close) this._dspLoaded = false;
    if (!close) {
      p.className = `panel open p-${kind}`;
      if (kind === 'src') this._renderSources();
      else if (kind === 'info') this._renderInfo();
      else if (kind === 'rooms') this._renderRooms();
      else this._renderEq();
    }
    if (this._hass) this._update();
  }

  _bindClose() {
    const p = this._els.panel;
    p.onclick = (e) => {
      const el = e.target;
      if (el === p || el.classList.contains('col') || el.classList.contains('list') || el.classList.contains('tiles')) this._togglePanel(this._panel);
    };
  }

  _renderSources() {
    const t = this._t;
    const tabs = this._config.source_tabs.filter((x) => TABS[x]);
    if (!tabs.includes(this._tab)) this._tab = tabs[0];
    this._els.panel.innerHTML = `
      <div class="wheel" id="wheel"><div class="wpad"></div>${tabs.map((ty) => `<button class="wtab" data-tab="${ty}">${esc(t[ty] || ty)}</button>`).join('')}<div class="wpad"></div></div>
      <div class="vline"></div>
      <div class="tiles" id="libList"></div>`;
    this._bindClose();
    const wheel = this.shadowRoot.getElementById('wheel');
    const items = [...wheel.querySelectorAll('.wtab')];
    const paint = () => {
      const r = wheel.getBoundingClientRect();
      const cy = r.top + r.height / 2;
      let best = null, bd = Infinity;
      for (const el of items) {
        const er = el.getBoundingClientRect();
        const d = (er.top + er.height / 2 - cy) / er.height;
        const ad = Math.abs(d);
        el.style.transform = `rotateX(${clamp(-d * 24, -75, 75)}deg) scale(${1 - Math.min(ad, 3) * 0.07})`;
        el.style.opacity = String(clamp(1 - ad * 0.3, 0.1, 1));
        if (ad < bd) { bd = ad; best = el; }
      }
      items.forEach((el) => el.classList.toggle('on', el === best));
      return best;
    };
    const center = (el, smooth) => wheel.scrollTo({ top: el.offsetTop - wheel.clientHeight / 2 + el.offsetHeight / 2, behavior: smooth ? 'smooth' : 'auto' });
    wheel.addEventListener('scroll', () => {
      paint();
      clearTimeout(this._wheelT);
      this._wheelT = setTimeout(() => {
        const b = paint();
        if (b && b.dataset.tab !== this._tab) { this._tab = b.dataset.tab; this._loadLib(this._tab); }
      }, 180);
    }, { passive: true });
    items.forEach((el) => { el.onclick = () => center(el, true); });
    const list = this.shadowRoot.getElementById('libList');
    list.addEventListener('wheel', (e) => {
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) { list.scrollLeft += e.deltaY; e.preventDefault(); }
    }, { passive: false });
    requestAnimationFrame(() => {
      const pad = Math.max(0, wheel.clientHeight / 2 - 17);
      wheel.querySelectorAll('.wpad').forEach((x) => { x.style.height = `${pad}px`; });
      const cur = items.find((x) => x.dataset.tab === this._tab);
      if (cur) center(cur, false);
      paint();
    });
    this._loadLib(this._tab);
  }

  async _entryId() {
    if (this._config.config_entry_id) return this._config.config_entry_id;
    if (this._entry) return this._entry;

    const dev = this._hass.devices?.[this._hass.entities?.[this._config.entity]?.device_id];
    const fromDev = dev?.primary_config_entry || dev?.config_entries?.[0];
    if (fromDev) return (this._entry = fromDev);
    try {
      const entries = await this._hass.callWS({ type: 'config_entries/get', domain: 'music_assistant' });
      const e = entries.find((x) => x.state === 'loaded') || entries[0];
      if (e) return (this._entry = e.entry_id);
    } catch (_) {}
    try {
      const reg = await this._hass.callWS({ type: 'config/entity_registry/get', entity_id: this._config.entity });
      if (reg?.config_entry_id) return (this._entry = reg.config_entry_id);
    } catch (_) {}
    throw new Error('Set "config_entry_id" in the card config');
  }

  async _getLibrary(config_entry_id, media_type, opts) {
    const service_data = { config_entry_id, media_type, limit: opts.each || Number(this._config.library_limit) || 50 };
    if (opts.favorite) service_data.favorite = true;
    if (opts.order_by) service_data.order_by = opts.order_by;
    const res = await this._hass.callWS({
      type: 'call_service', domain: 'music_assistant', service: 'get_library', service_data, return_response: true,
    });
    return res?.response?.items || [];
  }

  async _loadLib(tab) {
    const list = this.shadowRoot.getElementById('libList');
    const t = this._t;
    const cached = this._libCache[tab];
    if (cached && Date.now() - cached.ts < 5 * 60 * 1000) return this._renderLib(list, cached.items);
    list.innerHTML = `<div class="msg">${t.loading}</div>`;
    try {
      const def = TABS[tab];
      const entry = await this._entryId();
      const parts = await Promise.all(def.types.map((ty) => this._getLibrary(entry, ty, def).catch((e) => (def.types.length > 1 ? [] : Promise.reject(e)))));
      let items = parts.flat();
      if (tab === 'recent') items = items.filter((x) => x.last_played == null || x.last_played > 0);
      this._libCache[tab] = { ts: Date.now(), items };
      if (this._tab === tab && this._panel === 'src') this._renderLib(list, items);
    } catch (err) {
      if (this._tab === tab) list.innerHTML = `<div class="msg">${t.error}<br><small>${esc(err?.message || err)}</small></div>`;
    }
  }

  _renderLib(list, items) {
    if (!items.length) { list.innerHTML = `<div class="msg">${this._t.empty}</div>`; return; }
    list.scrollLeft = 0;
    list.innerHTML = items.map((it, i) => {
      const img = typeof it.image === 'string' ? it.image : it.image?.path;
      const sub = (it.artists || []).map((x) => x.name).filter(Boolean).join(', ') || it.owner || it.album?.name || (this._t[it.media_type] || '');
      return `<div class="tile ${esc(it.media_type)}" data-i="${i}" title="${esc(it.name)}">
        <div class="cover" ${img ? `style="background-image:url('${esc(this._url(img))}')"` : ''}>${img ? '' : svg(P.note)}</div>
        <div class="t-name">${esc(it.name)}</div><div class="t-sub">${esc(sub)}</div>
      </div>`;
    }).join('');
    list.querySelectorAll('.tile').forEach((el) => {
      el.onclick = () => {
        const it = items[+el.dataset.i];
        this._hass.callService('music_assistant', 'play_media', {
          entity_id: this._config.entity, media_id: it.uri, media_type: it.media_type, enqueue: 'replace',
        });
        this._togglePanel('src');
      };
    });
  }

  _maPlayers() {
    if (Array.isArray(this._config.players)) return this._config.players.filter((id) => this._state(id));
    const ents = this._hass.entities || {};
    const main = this._config.entity;
    return Object.keys(this._hass.states)
      .filter((id) => id.startsWith('media_player.'))
      .filter((id) => {
        const a = this._hass.states[id].attributes;
        return id === main || ents[id]?.platform === 'music_assistant' || 'mass_player_type' in a || a.app_id === 'music_assistant';
      })
      .filter((id) => !ents[id]?.hidden && (id === main || !['unavailable', 'unknown'].includes(this._hass.states[id].state)))
      .sort((x, y) => (x === main ? -1 : y === main ? 1 : this._name(x).localeCompare(this._name(y))));
  }
  _name(id) { return this._state(id)?.attributes.friendly_name || id; }

  _group(id) {
    const g = this._state(id)?.attributes.group_members || [];
    return g.length > 1 ? g : [];
  }

  _othersPlaying() {
    if (!this._hass) return false;
    const main = this._config.entity;
    return this._maPlayers().some((id) => id !== main && this._state(id)?.state === 'playing');
  }

  async _detachMain() {
    const main = this._config.entity;
    const g = this._group(main);
    const others = g.filter((x) => x !== main);
    if (!others.length) return;
    if (g[0] !== main) { this._call('unjoin', {}, main); return; }
    const wait = (ms) => new Promise((r) => setTimeout(r, ms));
    try {
      for (const id of others) await this._call('unjoin', {}, id);
      await wait(600);
      const target = others[0];
      await this._hass.callService('music_assistant', 'transfer_queue', { entity_id: target, source_player: main, auto_play: true });
      if (others.length > 1) { await wait(1200); await this._call('join', { group_members: others.slice(1) }, target); }
    } catch (e) {
      this._notify(String(e?.message || e));
    }
  }

  _renderRooms() {
    const t = this._t;
    const ids = this._maPlayers();
    const main = this._config.entity;
    this._els.panel.innerHTML = `
      <div class="col"><div class="list rooms">${ids.length ? ids.map((id) => `
        <div class="room" data-id="${esc(id)}">
          <div class="rline">
            ${id === main ? `<button class="btn xs link main">${svg(P.star)}</button>` : `<button class="btn xs link">${svg(P.link)}</button>`}
            <span class="room-name">${esc(this._name(id))}</span>
            <button class="btn xs mute"></button>
            <div class="slider vol"><div class="rail"><div class="fill"></div></div><div class="knob"></div></div>
            <span class="pct"></span>
            <button class="btn xs rpower" hidden>${svg(P.power)}</button>
          </div>
          ${id === main ? '' : `<div class="rnow" hidden>
            <button class="btn rplay"></button>
            <button class="btn rnext">${svg(P.next)}</button>
            <div class="rtrack"><div class="rt"></div><div class="slider rseek"><div class="rail"><div class="fill"></div></div><div class="knob"></div></div></div>
          </div>`}
        </div>`).join('') : `<div class="msg">${t.noPlayers}</div>`}</div></div>`;
    this._bindClose();
    this._els.panel.querySelectorAll('.room').forEach((row) => {
      const id = row.dataset.id;
      const link = row.querySelector('.link');
      link.onclick = () => {
        if (id === main) { if (this._group(main).length) this._detachMain(); return; }
        const members = this._state(main)?.attributes.group_members || [];
        if (members.includes(id)) { this._call('unjoin', {}, id); return; }

        Promise.resolve(this._call('join', { group_members: [id] }, main)).catch(() => {});
        setTimeout(() => {
          if (!(this._state(main)?.attributes.group_members || []).includes(id)) {
            this._notify(this._t.cantGroup.replace('{a}', this._name(main)).replace('{b}', this._name(id)));
          }
        }, 3000);
      };
      row.querySelector('.mute').onclick = () => this._call('volume_mute', { is_volume_muted: !this._state(id)?.attributes.is_volume_muted }, id);
      row.querySelector('.rpower').onclick = () => {
        const pe = this._powerFor(id);
        if (!pe) return;
        const on = this._entityOn(pe), dom = pe.split('.')[0];
        this._hass.callService(['media_player', 'switch', 'light', 'input_boolean', 'fan'].includes(dom) ? dom : 'homeassistant', on ? 'turn_off' : 'turn_on', { entity_id: pe });
      };
      const sl = row.querySelector('.slider.vol');
      const pct = row.querySelector('.pct');
      this._drag(sl, (f) => {
        this._roomDrag[id] = true; this._setSlider(sl, f); pct.textContent = `${Math.round(f * 100)}%`;
      }, (f) => {
        this._call('volume_set', { volume_level: Math.round(f * 100) / 100 }, id);
        setTimeout(() => { delete this._roomDrag[id]; }, 1500);
      });
      const now = row.querySelector('.rnow');
      if (now) {
        now.querySelector('.rplay').onclick = () => this._call('media_play_pause', {}, id);
        now.querySelector('.rnext').onclick = () => this._call('media_next_track', {}, id);
        const seek = now.querySelector('.rseek');
        this._drag(seek, (f) => { this._roomSeek = { id, f }; this._setSlider(seek, f); }, (f) => {
          const dur = +this._state(id)?.attributes.media_duration || 0;
          if (dur) this._call('media_seek', { seek_position: Math.round(f * dur) }, id);
          setTimeout(() => { this._roomSeek = null; }, 1500);
        });
      }
    });
    this._updateRooms();
    loadPowerMap(this._hass).then((m) => { this._powerMap = m; this._updateRooms(); });
  }

  _powerFor(id) {
    if (id === this._config.entity && this._hasPower()) return this._config.power_entity;
    return this._config.power_entities?.[id] || this._powerMap?.[id] || null;
  }

  _entityOn(id) {
    const ps = this._state(id);
    return !!ps && !['off', 'standby', 'unavailable', 'unknown'].includes(ps.state);
  }

  _updateRooms() {
    const main = this._config.entity;
    const group = this._state()?.attributes.group_members || [];
    const mainGrouped = this._group(main).length > 0;
    this._els.panel.querySelectorAll('.room').forEach((row) => {
      const id = row.dataset.id;
      const st = this._state(id);
      if (!st) return;
      const a = st.attributes;
      row.classList.toggle('active', st.state === 'playing');
      row.title = this._hass.formatEntityState ? this._hass.formatEntityState(st) : st.state;
      const link = row.querySelector('.link');
      if (id === main) {

        const html = mainGrouped ? svg(P.link) : svg(P.star);
        if (link.dataset.v !== html) { link.dataset.v = html; link.innerHTML = html; }
        link.classList.toggle('on', mainGrouped);
        link.classList.toggle('mainmark', !mainGrouped);
      } else link.classList.toggle('on', group.includes(id));
      const mute = row.querySelector('.mute');
      const html = a.is_volume_muted ? svg(P.mute) : svg(P.volume);
      if (mute.dataset.v !== html) { mute.dataset.v = html; mute.innerHTML = html; }
      mute.classList.toggle('muted', !!a.is_volume_muted);
      const pe = this._powerFor(id);
      const pb = row.querySelector('.rpower');
      pb.hidden = !pe;
      const pOn = pe ? this._entityOn(pe) : true;
      pb.classList.toggle('on', pOn);
      pb.title = pe ? this._name(pe) : '';
      row.classList.toggle('poweroff', !pOn);
      if (!this._roomDrag[id]) {
        const v = clamp(+a.volume_level || 0);
        this._setSlider(row.querySelector('.slider.vol'), v);
        row.querySelector('.pct').textContent = `${Math.round(v * 100)}%`;
      }
      const now = row.querySelector('.rnow');
      if (now) {
        const active = ['playing', 'paused', 'buffering'].includes(st.state) && (a.media_title || a.media_content_id);
        now.hidden = !active;
        if (active) {
          const play = st.state === 'playing' ? svg(P.pause) : svg(P.play);
          const pb = now.querySelector('.rplay');
          if (pb.dataset.v !== play) { pb.dataset.v = play; pb.innerHTML = play; }
          now.querySelector('.rt').textContent = [a.media_title, a.media_artist].filter(Boolean).join(' — ');
        }
      }
    });
    this._roomsProgress();
  }

  _roomsProgress() {
    this._els.panel.querySelectorAll('.room .rnow:not([hidden])').forEach((now) => {
      const id = now.parentElement.dataset.id;
      const st = this._state(id);
      if (!st) return;
      const seek = now.querySelector('.rseek');
      const dur = +st.attributes.media_duration || 0;
      seek.classList.toggle('live', !dur);
      if (this._roomSeek?.id === id) return;
      this._setSlider(seek, dur ? clamp(this._position(st) / dur) : 1);
    });
  }

  _maAvailable() {
    return this._companion() || !!this._config.ma_url || this._hass?.user?.is_admin !== false;
  }

  _companion() {
    return !this._config.ma_url && !!this._hass?.config?.components?.includes('maestro_player');
  }

  async _dspGet() {
    if (this._companion()) return this._hass.callWS({ type: 'maestro_player/dsp/get', entity_id: this._config.entity });
    const ma = this._maClient();
    return ma.cmd('config/players/dsp/get', { player_id: await this._maPlayerId(ma) });
  }

  async _dspSave(config) {
    if (this._companion()) return this._hass.callWS({ type: 'maestro_player/dsp/save', entity_id: this._config.entity, config });
    const ma = this._maClient();
    return ma.cmd('config/players/dsp/save', { player_id: await this._maPlayerId(ma), config });
  }

  async _queueIsDynamic(queueId) {
    if (this._companion()) return !!(await this._hass.callWS({ type: 'maestro_player/queue/get', entity_id: this._config.entity }))?.is_dynamic;
    return !!(await this._maClient().cmd('player_queues/get', { queue_id: queueId }))?.is_dynamic;
  }

  _maClient() {
    if (this._ma) return this._ma;
    const url = this._config.ma_url;
    if (url === 'mock' && window.MMP_MA_MOCK) return (this._ma = window.MMP_MA_MOCK);
    if (url) return (this._ma = new MAClient(`${url.replace(/\/+$/, '').replace(/^http/, 'ws')}/ws`, this._config.ma_token));

    return (this._ma = new MAClient(() => this._ingressWsUrl()));
  }

  async _ingressWsUrl() {
    const sup = (endpoint, method = 'get') => this._hass.callWS({ type: 'supervisor/api', endpoint, method });
    if (!this._ingressPath) {
      let slug = this._config.ma_addon;
      if (!slug) {
        const { addons } = await sup('/addons');
        const ma = addons.filter((a) => /music.?assistant/i.test(`${a.slug} ${a.name}`));
        slug = (ma.find((a) => a.state === 'started') || ma[0])?.slug;
        if (!slug) throw new Error('Music Assistant add-on not found (set "ma_url")');
      }
      const info = await sup(`/addons/${slug}/info`);
      if (!info.ingress_url) throw new Error('Music Assistant add-on has no ingress (set "ma_url")');
      this._ingressPath = info.ingress_url;
    }
    const { session } = await sup('/ingress/session', 'post');
    const secure = location.protocol === 'https:';
    document.cookie = `ingress_session=${session};path=/api/hassio_ingress/;SameSite=Strict${secure ? ';Secure' : ''}`;
    clearInterval(this._ingressKeep);
    this._ingressKeep = setInterval(() => {
      this._hass?.callWS({ type: 'supervisor/api', endpoint: '/ingress/validate_session', method: 'post', data: { session } }).catch(() => {});
    }, 60000);
    return `${secure ? 'wss' : 'ws'}://${location.host}${this._ingressPath.replace(/\/?$/, '/')}ws`;
  }

  async _maPlayerId(ma) {
    if (this._config.ma_player_id) return this._config.ma_player_id;
    if (this._maPid) return this._maPid;
    try {
      const reg = await this._hass.callWS({ type: 'config/entity_registry/get', entity_id: this._config.entity });
      if (reg?.platform === 'music_assistant' && reg.unique_id) return (this._maPid = reg.unique_id);
    } catch (_) {}
    const name = this._name(this._config.entity);
    const players = (await ma.cmd('players/all')) || [];
    const p = players.find((x) => x.display_name === name || x.name === name);
    if (!p) throw new Error('Set "ma_player_id" in the card config');
    return (this._maPid = p.player_id);
  }

  _presetIndex() {
    return EQ_PRESETS.findIndex(([, g]) => g.every((v, i) => Math.abs(v - this._eq.gains[i]) < 0.05));
  }

  _renderEq(host = this._els.panel, inline = false) {
    const t = this._t;
    const band = (i, label, g) => `
      <div class="band ${i < 0 ? 'pre' : ''}" data-b="${i}">
        <span class="bv">${sign(g)}</span>
        <div class="vs"><div class="vrail"></div><div class="vzero"></div><div class="vfill"></div><div class="vknob"></div></div>
        <span class="bf">${label}</span>
      </div>`;
    host.innerHTML = `
      <div class="eq" id="eq">
        <div class="eq-bar">
          <button class="pill" id="eqPower"></button>
          <div class="preset">
            <button class="btn xs" id="prePrev"><svg viewBox="0 0 24 24" style="transform:rotate(90deg)"><path d="${P.chevron}"/></svg></button>
            <span class="pname" id="pname"></span>
            <button class="btn xs" id="preNext"><svg viewBox="0 0 24 24" style="transform:rotate(-90deg)"><path d="${P.chevron}"/></svg></button>
          </div>
          <button class="pill" id="eqReset">${t.reset}</button>
          <span class="eq-status" id="eqStatus"></span>
        </div>
        <div class="eq-bands"><canvas id="eqGraph"></canvas>
          ${band(-1, 'PRE', this._eq.preamp)}
          ${EQ_FREQS.map((f, i) => band(i, fLabel(f), this._eq.gains[i])).join('')}
        </div>
      </div>`;
    if (!inline) this._bindClose();
    const $ = (id) => this.shadowRoot.getElementById(id);
    $('eqPower').onclick = () => { this._eq.enabled = !this._eq.enabled; this._syncEq(); this._queueSave(); };
    $('eqReset').onclick = () => { this._applyPreset(0); };
    const step = (d) => {
      const cur = this._presetIndex();
      const next = cur < 0 ? (d > 0 ? 0 : EQ_PRESETS.length - 1) : (cur + d + EQ_PRESETS.length) % EQ_PRESETS.length;
      this._applyPreset(next);
    };
    $('prePrev').onclick = () => step(-1);
    $('preNext').onclick = () => step(1);
    this._els.panel.querySelectorAll('.band').forEach((b) => {
      const i = +b.dataset.b;
      const vs = b.querySelector('.vs');
      const setFromFrac = (f) => {
        const g = Math.round((f * 2 - 1) * EQ_MAX * 2) / 2;
        if (i < 0) this._eq.preamp = g; else this._eq.gains[i] = g;
        this._syncEq();
      };
      this._drag(vs, setFromFrac, (f) => { setFromFrac(f); this._queueSave(); }, 'y');
      vs.addEventListener('dblclick', () => { if (i < 0) this._eq.preamp = 0; else this._eq.gains[i] = 0; this._syncEq(); this._queueSave(); });
    });
    this._syncEq();
    this._loadDsp();
  }

  _applyPreset(idx) {
    this._eq.gains = EQ_PRESETS[idx][1].slice();
    this._eq.enabled = true;
    this._syncEq();
    this._queueSave();
  }

  _eqStatus(text) { const el = this.shadowRoot.getElementById('eqStatus'); if (el) el.textContent = text || ''; }

  _syncEq() {
    const root = this.shadowRoot.getElementById('eq');
    if (!root) return;
    const t = this._t;
    root.classList.toggle('disabled', !this._eq.enabled);
    const power = this.shadowRoot.getElementById('eqPower');
    power.textContent = `EQ ${this._eq.enabled ? t.on : t.off}`;
    power.classList.toggle('on', this._eq.enabled);
    const pi = this._presetIndex();
    this.shadowRoot.getElementById('pname').textContent = pi >= 0 ? EQ_PRESETS[pi][0] : t.custom;
    root.querySelectorAll('.band').forEach((b) => {
      const i = +b.dataset.b;
      const g = i < 0 ? this._eq.preamp : this._eq.gains[i];
      const f = (g / EQ_MAX + 1) / 2;
      b.querySelector('.bv').textContent = sign(g);
      b.querySelector('.vknob').style.top = `${(1 - f) * 100}%`;
      const fill = b.querySelector('.vfill');
      if (g >= 0) { fill.style.top = `${(1 - f) * 100}%`; fill.style.bottom = '50%'; }
      else { fill.style.top = '50%'; fill.style.bottom = `${f * 100}%`; }
    });
    this._graphDirty = true;
  }

  _drawEqGraph() {
    const cv = this.shadowRoot.getElementById('eqGraph');
    if (!cv) return;
    const w = cv.clientWidth, h = cv.clientHeight;
    if (!w || !h) return;
    const dpr = window.devicePixelRatio || 1;
    const sizeKey = `${w}x${h}x${dpr}`;
    if (!this._graphDirty && this._graphSize === sizeKey) return;
    this._graphDirty = false; this._graphSize = sizeKey;
    cv.width = Math.round(w * dpr); cv.height = Math.round(h * dpr);
    const ctx = cv.getContext('2d');
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, w, h);
    const cr = cv.getBoundingClientRect();
    const tracks = [...this.shadowRoot.querySelectorAll('.band:not(.pre) .vs')];
    if (!tracks.length) return;
    const r0 = tracks[0].getBoundingClientRect();
    const yOf = (db) => r0.top - cr.top + (1 - (db / EQ_MAX + 1) / 2) * r0.height;
    const first = r0.left + r0.width / 2 - cr.left;

    for (const db of [-12, -6, 0, 6, 12]) {
      const y = Math.round(yOf(db)) + 0.5;
      ctx.strokeStyle = db === 0 ? `rgba(${this._theme.fg},.2)` : `rgba(${this._theme.fg},.07)`;
      ctx.beginPath(); ctx.moveTo(first - 14, y); ctx.lineTo(w, y); ctx.stroke();
    }
    const pts = tracks.map((vs, i) => {
      const r = vs.getBoundingClientRect();
      const g = this._eq.enabled ? clamp(this._eq.gains[i] + this._eq.preamp, -EQ_MAX, EQ_MAX) : 0;
      return [r.left + r.width / 2 - cr.left, yOf(g)];
    });
    const stepX = pts.length > 1 ? pts[1][0] - pts[0][0] : 20;
    const all = [[pts[0][0] - stepX * 0.6, pts[0][1]], ...pts, [pts[pts.length - 1][0] + stepX * 0.6, pts[pts.length - 1][1]]];
    const path = () => {
      ctx.moveTo(all[0][0], all[0][1]);
      for (let i = 0; i < all.length - 1; i++) {
        const p0 = all[i - 1] || all[i], p1 = all[i], p2 = all[i + 1], p3 = all[i + 2] || p2;
        ctx.bezierCurveTo(p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6, p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6, p2[0], p2[1]);
      }
    };
    const zero = yOf(0);
    const grad = ctx.createLinearGradient(0, yOf(EQ_MAX), 0, yOf(-EQ_MAX));
    const A = this._theme.accent;
    grad.addColorStop(0, `rgba(${A},.3)`); grad.addColorStop(0.5, `rgba(${A},.05)`); grad.addColorStop(1, `rgba(${A},.3)`);
    ctx.beginPath(); path();
    ctx.lineTo(all[all.length - 1][0], zero); ctx.lineTo(all[0][0], zero); ctx.closePath();
    ctx.fillStyle = grad; ctx.fill();
    ctx.beginPath(); path();
    ctx.strokeStyle = `rgba(${A},.85)`; ctx.lineWidth = 2; ctx.lineJoin = 'round'; ctx.stroke();
  }

  async _loadDsp() {
    const t = this._t;
    this._eqStatus(t.connecting);
    try {
      const dsp = await this._dspGet();
      this._dsp = dsp || {};
      const peq = (this._dsp.filters || []).find((f) => f.type === 'parametric_eq');
      const bands = peq?.bands || [];
      this._eq.gains = EQ_FREQS.map((f) => {
        const b = bands.find((x) => Math.abs(x.frequency - f) / f < 0.12);
        return b ? clamp(Math.round(b.gain * 10) / 10, -EQ_MAX, EQ_MAX) : 0;
      });
      this._eq.preamp = clamp(Math.round((peq?.preamp || 0) * 10) / 10, -EQ_MAX, EQ_MAX);
      this._eq.enabled = !!(this._dsp.enabled && (!peq || peq.enabled));
      this._dspLoaded = true;
      this._eqStatus(this._name(this._config.entity));
      this._syncEq();
    } catch (e) {
      this._eqStatus(`${t.error}: ${e?.message || e}`);
    }
  }

  _queueSave() {
    clearTimeout(this._saveT);
    this._saveT = setTimeout(() => this._saveDsp(), 500);
  }

  async _saveDsp() {
    const t = this._t;
    if (!this._dspLoaded) return;
    const base = this._dsp || {};
    const filters = base.filters || [];
    const old = filters.find((f) => f.type === 'parametric_eq');
    const peq = {
      ...(old || {}),
      type: 'parametric_eq',
      enabled: this._eq.enabled,
      preamp: this._eq.preamp,
      bands: EQ_FREQS.map((f, i) => ({
        frequency: f, q: Math.round(EQ_Q[i] * 1000) / 1000, gain: this._eq.gains[i], type: 'peak', enabled: true, channel: 'ALL',
      })),
    };
    const config = {
      enabled: this._eq.enabled || filters.some((f) => f !== old && f.enabled),
      output_gain: 0,
      ...base,
      filters: old ? filters.map((f) => (f === old ? peq : f)) : [...filters, peq],
    };
    if (this._eq.enabled) config.enabled = true;
    try {
      await this._dspSave(config);
      this._dsp = config;
      this._eqStatus(this._name(this._config.entity));
    } catch (e) {
      this._eqStatus(`${t.error}: ${e?.message || e}`);
    }
  }
}

const BADGE_STYLE = `
:host{--mmp-fg-rgb:255,255,255;--mmp-fg:rgb(var(--mmp-fg-rgb));--mmp-accent-rgb:255,255,255;--mmp-accent:rgb(var(--mmp-accent-rgb));--mmp-on-accent:#111;--mmp-bg:linear-gradient(135deg,#3a4a7a,#1d2340 60%,#4b3a5e);--mmp-card-bg:#1c2233;--mmp-shade-rgb:12,16,32;--mmp-panel:rgba(14,17,30,.72);--mmp-art:1}

:host{display:inline-block;--b-h:36px}
.b{position:relative;display:flex;align-items:center;gap:4px;height:var(--b-h);padding:0 4px 0 3px;box-sizing:border-box;
  border-radius:calc(var(--b-h) / 2);overflow:hidden;isolation:isolate;color:var(--mmp-fg);max-width:320px;
  background:var(--mmp-card-bg);border:1px solid rgba(var(--mmp-fg-rgb),.18);box-shadow:var(--ha-card-box-shadow,none);
  font-family:var(--ha-font-family-body,inherit);user-select:none;-webkit-user-select:none;-webkit-tap-highlight-color:transparent}
.bg{position:absolute;inset:-6px;z-index:-2;background:var(--mmp-bg) center/cover no-repeat;filter:blur(3px) saturate(1.1)}
.b::before{content:'';position:absolute;inset:0;z-index:-1;background:rgba(var(--mmp-shade-rgb),var(--mmp-shade-top))}
.art{position:relative;flex:none;width:30px;height:30px;cursor:pointer}
.seek{position:absolute;left:0;right:0;bottom:0;height:3px;pointer-events:none;z-index:2}
.seek .rail{position:absolute;left:0;right:0;bottom:0;height:2.5px;background:rgba(var(--mmp-fg-rgb),.2)}
.seek .fill{position:absolute;left:0;bottom:0;height:2.5px;width:0;background:var(--mmp-accent);transition:width 1s linear}
.seek.drag .fill{transition:none}
.seek.live{pointer-events:none}
.img{position:absolute;inset:1px;border-radius:50%;background:rgba(var(--mmp-fg-rgb),.15) center/cover no-repeat;display:grid;place-items:center}
.img svg{width:13px;height:13px;fill:var(--mmp-fg);opacity:.7}
.playing .img{animation:spin 12s linear infinite}
@keyframes spin{to{transform:rotate(360deg)}}
.txt{min-width:0;max-width:150px;padding:0 4px 0 2px;line-height:1.15;cursor:pointer}
.t,.a{white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.t{font-size:12px;font-weight:600}
.t,.a{text-shadow:0 1px 3px rgba(0,0,0,.5)}
.b::before{background:rgba(var(--mmp-shade-rgb),calc(var(--mmp-shade-top) + .25))}
.a{font-size:10.5px;opacity:.7}
.bb{flex:none;display:grid;place-items:center;width:28px;height:28px;border-radius:50%;border:0;padding:0;background:none;color:inherit;cursor:pointer;transition:background .15s,transform .1s}
.bb:hover{background:rgba(var(--mmp-fg-rgb),.15)}
.bb:active{transform:scale(.9)}
.bb svg,.bb img{width:18px;height:18px;fill:currentColor;object-fit:contain}
.power.on{color:#3ddc84;filter:drop-shadow(0 0 4px rgba(61,220,132,.7))}
.power.pending{animation:pw 1s ease-in-out infinite}
@keyframes pw{50%{opacity:.35}}
.off .art,.off #play,.off #next,.off .seek{display:none}
.off .txt{opacity:.6;padding-left:8px}
.b.glass{-webkit-backdrop-filter:blur(16px) saturate(1.5);backdrop-filter:blur(16px) saturate(1.5)}
[hidden]{display:none!important}
`;

class MaMiniPlayerBadge extends HTMLElement {
  constructor() { super(); this.attachShadow({ mode: 'open' }); }

  static getStubConfig(hass) { return MaMiniPlayerCard.getStubConfig(hass); }
  static getConfigForm() {
    const L = { entity: 'Music Assistant player', power_entity: 'Receiver power (optional)', show_next: '"Next" button', show_artist: 'Artist line', show_seek: 'Progress line', theme: 'Color scheme', artwork: 'Artwork background', custom_background: 'Custom: background', custom_accent: 'Custom: buttons & bars', custom_text: 'Custom: text' };
    const TL = THEME_LABELS;
    return {
      schema: [
        { name: 'entity', required: true, selector: { entity: { filter: [{ integration: 'music_assistant', domain: 'media_player' }] } } },
        { name: 'power_entity', selector: { entity: { filter: [{ domain: ['media_player', 'switch', 'input_boolean', 'light'] }] } } },
        { type: 'grid', name: 'opts', flatten: true, schema: [
          { name: 'show_next', default: true, selector: { boolean: {} } },
          { name: 'show_artist', default: true, selector: { boolean: {} } },
          { name: 'show_seek', default: true, selector: { boolean: {} } },
          { name: 'artwork', default: true, selector: { boolean: {} } },
        ] },
        { name: 'theme', default: 'blue', selector: { select: { mode: 'dropdown', options: THEME_NAMES.map((v) => ({ value: v, label: TL[v] })) } } },
        { type: 'grid', name: 'custom', flatten: true, schema: [
          { name: 'custom_background', selector: { color_rgb: {} } },
          { name: 'custom_accent', selector: { color_rgb: {} } },
          { name: 'custom_text', selector: { color_rgb: {} } },
        ] },
      ],
      computeLabel: (s) => L[s.name],
    };
  }

  setConfig(config) {
    if (!config?.entity) throw new Error('Please define "entity"');
    this._config = { show_next: true, show_artist: true, show_seek: true, icons: {}, ...config };
    this._build();
    if (this._hass) this._update();
  }

  set hass(h) {
    this._hass = h;
    if (this._els) this._update();
    if (this._popup) this._popup.card.hass = h;
  }

  _openPopup() {
    if (this._popup) return;
    ensurePopupStyle();
    const wrap = document.createElement('div');
    wrap.className = 'mmp-popup';
    const sheet = document.createElement('div');
    sheet.className = 'mmp-sheet';
    const card = document.createElement(TAG);
    const c = this._config;
    const look = {};
    for (const k of ['theme', 'artwork', 'custom_background', 'custom_accent', 'custom_text']) if (c[k] !== undefined) look[k] = c[k];
    const cfg = { type: `custom:${TAG}`, entity: c.entity, icons: c.icons || {}, ...look, ...(c.popup_config || {}), dsp_inline: true };
    if (c.power_entity) cfg.power_entity = c.power_entity;
    card.setConfig(cfg);
    card.hass = this._hass;
    sheet.appendChild(card);
    wrap.appendChild(sheet);
    const close = () => {
      if (!this._popup) return;
      document.removeEventListener('keydown', onKey);
      wrap.classList.add('closing');
      setTimeout(() => wrap.remove(), 180);
      this._popup = null;
    };
    const onKey = (e) => { if (e.key === 'Escape') close(); };
    wrap.addEventListener('click', (e) => { if (e.target === wrap) close(); });
    document.addEventListener('keydown', onKey);
    document.body.appendChild(wrap);
    this._popup = { wrap, card, close };
  }

  connectedCallback() { clearInterval(this._timer); this._timer = setInterval(() => this._progress(), 1000); }
  disconnectedCallback() { clearInterval(this._timer); this._popup?.close(); }

  _icon(name, fallback) {
    const src = this._config.icons?.[name];
    return src ? `<img src="${esc(src)}" alt="">` : fallback;
  }

  _build() {
    const c = this._config;
    const th = resolveTheme(c);
    this._theme = th;
    this.shadowRoot.innerHTML = `<style>${BADGE_STYLE}</style>
      <div class="b ${th.glass ? 'glass' : ''}" id="b" style="${th.vars}">
        <div class="bg" id="bg"></div>
        <div class="art"><div class="img" id="img"></div></div>
        <div class="txt" id="txt"><div class="t" id="t"></div><div class="a" id="a" ${c.show_artist ? '' : 'hidden'}></div></div>
        <button class="bb" id="play"></button>
        <button class="bb" id="next" ${c.show_next ? '' : 'hidden'}>${this._icon('next', svg(P.next))}</button>
        ${c.power_entity ? `<button class="bb power" id="power">${this._icon('power', svg(P.power))}</button>` : ''}
        <div class="seek" id="seek" ${c.show_seek ? '' : 'hidden'}><div class="rail"></div><div class="fill" id="fill"></div></div>
      </div>`;
    const $ = (id) => this.shadowRoot.getElementById(id);
    this._els = { b: $('b'), bg: $('bg'), img: $('img'), seek: $('seek'), fill: $('fill'), t: $('t'), a: $('a'), play: $('play'), next: $('next'), power: $('power') };
    this._cache = {};
    const call = (svc, data = {}, id = c.entity) => this._hass.callService('media_player', svc, { entity_id: id, ...data });
    this._els.play.onclick = (e) => { e.stopPropagation(); call('media_play_pause'); };
    this._els.next.onclick = (e) => { e.stopPropagation(); call('media_next_track'); };
    const open = () => {
      if (c.popup === false) this.dispatchEvent(new CustomEvent('hass-more-info', { detail: { entityId: c.entity }, bubbles: true, composed: true }));
      else this._openPopup();
    };
    $('txt').onclick = open;
    this.shadowRoot.querySelector('.art').onclick = open;
    if (this._els.power) this._els.power.onclick = (ev) => {
      ev.stopPropagation();
      const id = c.power_entity, on = this._powerOn(), dom = id.split('.')[0];
      const svc = on ? 'turn_off' : 'turn_on';
      this._hass.callService(['media_player', 'switch', 'light', 'input_boolean', 'fan'].includes(dom) ? dom : 'homeassistant', svc, { entity_id: id });
      this._pending = !on; clearTimeout(this._pT);
      this._pT = setTimeout(() => { this._pending = null; this._update(); }, 20000);
      this._update();
    };

  }

  _powerOn() {
    const id = this._config.power_entity;
    if (!id) return true;
    const ps = this._hass?.states[id];
    return !!ps && !['off', 'standby', 'unavailable', 'unknown'].includes(ps.state);
  }

  _update() {
    const st = this._hass.states[this._config.entity];
    const e = this._els;
    const t = TEXT;
    if (!st) { e.t.textContent = `${t.notFound}`; return; }
    const a = st.attributes;
    const on = this._powerOn();
    if (this._pending != null && on === this._pending) { this._pending = null; clearTimeout(this._pT); }
    e.b.classList.toggle('off', !on);
    if (e.power) { e.power.classList.toggle('on', on); e.power.classList.toggle('pending', this._pending != null); }
    const active = ['playing', 'paused', 'buffering'].includes(st.state) && (a.media_title || a.media_content_id);
    this._active = active;
    e.b.classList.toggle('playing', st.state === 'playing');
    e.t.textContent = !on ? (a.friendly_name || '') : active ? (a.media_title || '') : t.nothing;
    e.a.textContent = !on ? '' : active ? (a.media_artist || a.media_album_name || '') : (a.friendly_name || '');
    e.a.hidden = !this._config.show_artist || !on;
    const playHtml = st.state === 'playing' ? this._icon('pause', svg(P.pause)) : this._icon('play', svg(P.play));
    if (this._cache.play !== playHtml) { this._cache.play = playHtml; e.play.innerHTML = playHtml; }
    const pic = active ? (a.entity_picture_local || a.entity_picture) : null;
    const bgPic = this._theme?.art ? pic : null;
    if (pic !== this._cache.pic) {
      this._cache.pic = pic;
      const url = pic ? (pic.startsWith('/') && this._hass.hassUrl ? this._hass.hassUrl(pic) : pic) : null;
      const css = url ? `url("${url.replace(/"/g, '%22')}")` : '';
      e.img.style.backgroundImage = css; e.bg.style.backgroundImage = bgPic ? css : '';
      e.img.innerHTML = url ? '' : svg(P.note);
    }
    this._progress();
  }

  _progress() {
    const st = this._hass?.states[this._config?.entity];
    if (!st || !this._els) return;
    const a = st.attributes;
    const dur = this._active ? +a.media_duration || 0 : 0;
    let pos = +a.media_position || 0;
    if (st.state === 'playing' && a.media_position_updated_at) pos += (Date.now() - new Date(a.media_position_updated_at).getTime()) / 1000;
    const f = this._seekF != null ? this._seekF : dur ? clamp(pos / dur) : (this._active ? 1 : 0);
    this._els.fill.style.width = `${f * 100}%`;
    this._els.seek.classList.toggle('live', !dur);
  }
}

function parseLrc(lrc) {
  if (!lrc || typeof lrc !== 'string') return [];
  const out = [];
  for (const line of lrc.split(/\r?\n/)) {
    const tags = [...line.matchAll(/\[(\d+):(\d+(?:\.\d+)?)\]/g)];
    if (!tags.length) continue;
    const text = line.replace(/\[[^\]]*\]/g, '').trim();
    for (const m of tags) out.push({ t: +m[1] * 60 + +m[2], text });
  }
  return out.sort((a, b) => a.t - b.t);
}

const THEME_LABELS = { blue: 'Blue', dark: 'Dark', light: 'Light', glass: 'Glass (transparent)', custom: 'Custom colors' };
const EDITOR_TEXT = {
  entity: 'Music Assistant player', show_power: 'Power button (receiver / amplifier)', power_entity: 'Entity for the power button',
  g_buttons: 'Buttons & elements', g_look: 'Appearance', g_sources: 'Sources', g_rooms: 'Multiroom', icons: 'Custom icons', g_conn: 'Connection (advanced)',
  show_previous: '"Previous" button', show_eq: 'DSP button', show_source: 'Sources button', show_multiroom: 'Multiroom button',
  show_spectrum: 'Spectrum', show_info: 'Track info button (lyrics, artist, album)', sync_group_volume: 'Main volume moves the whole group',
  theme: 'Color scheme', artwork: 'Artwork as background', custom_background: 'Background color', custom_accent: 'Buttons, sliders & spectrum color', custom_text: 'Text color',
  blur: 'Artwork blur', shade_top: 'Overlay at the top', shade_bottom: 'Overlay at the bottom',
  source_tabs: 'Tabs (order = order in the list)', library_limit: 'Items per tab',
  players: 'Players in multiroom (empty = all Music Assistant players)',
  ma_url: 'Music Assistant URL', ma_token: 'Music Assistant token', ma_player_id: 'Music Assistant player id',
  config_entry_id: 'Music Assistant config entry id', ma_addon: 'Music Assistant add-on slug',
  h_power_entity: 'While it is off the player is blurred and only the power button works.',
  h_players: 'Leave empty to show every available Music Assistant player.',
  h_icons: 'Path to an image, e.g. /local/ma-player/play.svg. Empty = built-in icon.',
  h_ma_url: 'Only for a standalone Music Assistant server. With the add-on, DSP connects automatically.',
  h_config_entry_id: 'Only if sources fail to load for non-admin users.',
};

class MaMiniPlayerCardEditor extends HTMLElement {
  setConfig(config) { this._config = config; this._render(); }
  set hass(hass) { this._hass = hass; this._render(); }

  get _l() { return EDITOR_TEXT; }

  _schema() {
    const L = this._l, T = TEXT;
    const bool = (name) => ({ name, selector: { boolean: {} } });
    const text = (name, type) => ({ name, selector: { text: type ? { type } : {} } });
    return [
      { name: 'entity', required: true, selector: { entity: { filter: [{ integration: 'music_assistant', domain: 'media_player' }] } } },
      { name: 'show_power', selector: { boolean: {} } },
      ...(this._powerOnInEditor ? [{ name: 'power_entity', required: true, selector: { entity: { filter: [{ domain: ['media_player', 'switch', 'input_boolean', 'light'] }] } } }] : []),
      { type: 'expandable', name: 'g_buttons', flatten: true, icon: 'mdi:gesture-tap-button', schema: [
        { type: 'grid', name: 'g_buttons_grid', flatten: true, schema: [
          bool('show_previous'), bool('show_eq'), bool('show_source'), bool('show_multiroom'), bool('show_spectrum'), bool('show_info'), bool('sync_group_volume'),
        ] },
      ] },
      { type: 'expandable', name: 'g_look', flatten: true, icon: 'mdi:palette', schema: [
        { name: 'theme', selector: { select: { mode: 'dropdown', options: THEME_NAMES.map((v) => ({ value: v, label: THEME_LABELS[v] })) } } },
        ...(this._data?.theme === 'custom' ? [
          { type: 'grid', name: 'g_custom', flatten: true, schema: [
            { name: 'custom_background', selector: { color_rgb: {} } },
            { name: 'custom_accent', selector: { color_rgb: {} } },
            { name: 'custom_text', selector: { color_rgb: {} } },
          ] },
        ] : []),
        { name: 'artwork', selector: { boolean: {} } },
        { name: 'blur', selector: { number: { min: 0, max: 40, step: 1, mode: 'slider', unit_of_measurement: 'px' } } },
        { name: 'shade_top', selector: { number: { min: 0, max: 1, step: 0.05, mode: 'slider' } } },
        { name: 'shade_bottom', selector: { number: { min: 0, max: 1, step: 0.05, mode: 'slider' } } },
      ] },
      { type: 'expandable', name: 'g_sources', flatten: true, icon: 'mdi:music-box-multiple', schema: [
        { name: 'source_tabs', selector: { select: { multiple: true, reorder: true, mode: 'list', options: ALL_TABS.map((v) => ({ value: v, label: T[v] || v })) } } },
        { name: 'library_limit', selector: { number: { min: 5, max: 500, step: 5, mode: 'box' } } },
      ] },
      { type: 'expandable', name: 'g_rooms', flatten: true, icon: 'mdi:speaker-multiple', schema: [
        { name: 'players', selector: { entity: { multiple: true, filter: [{ integration: 'music_assistant', domain: 'media_player' }] } } },
      ] },
      { type: 'expandable', name: 'icons', icon: 'mdi:image-edit', schema: ICON_KEYS.map((k) => text(k)) },
      { type: 'expandable', name: 'g_conn', flatten: true, icon: 'mdi:lan-connect', schema: [
        text('ma_url'), text('ma_token', 'password'), text('ma_player_id'), text('config_entry_id'), text('ma_addon'),
      ] },
    ];
  }

  _render() {
    if (!this._hass || !this._config) return;
    if (!this._form) {
      this._form = document.createElement('ha-form');
      this._form.computeLabel = (s) => this._l[s.name] || (ICON_KEYS.includes(s.name) ? s.name : undefined) || s.name;
      this._form.computeHelper = (s) => this._l[`h_${s.name}`] || (s.name === 'icons' ? this._l.h_icons : undefined);
      this._form.addEventListener('value-changed', (e) => this._changed(e.detail.value));
      this.appendChild(this._form);
    }
    const c = this._config;
    const data = { ...DEFAULTS, ...c, icons: { ...(c.icons || {}) } };
    data.show_power = c.show_power ?? !!c.power_entity;
    this._powerOnInEditor = data.show_power;
    const th = resolveTheme(c);
    data.theme = th.name;
    data.artwork = th.art;
    data.shade_top ??= c.shade?.[0] ?? th.top;
    data.shade_bottom ??= c.shade?.[1] ?? th.bottom;
    if (th.name === 'custom') {
      data.custom_background ??= [28, 34, 51];
      data.custom_accent ??= [255, 255, 255];
      data.custom_text ??= th.fg.split(',').map(Number);
    }
    this._data = data;
    if (Array.isArray(c.shade)) { data.shade_top ??= c.shade[0]; data.shade_bottom ??= c.shade[1]; }
    this._form.hass = this._hass;
    this._form.schema = this._schema();
    this._form.data = data;
    this._data = data;
  }

  _changed(value) {
    const out = { type: this._config.type };
    const order = ['entity', 'power_entity'];
    const entries = Object.entries(value).sort(([a], [b]) => {
      const ia = order.indexOf(a), ib = order.indexOf(b);
      return (ia < 0 ? 99 : ia) - (ib < 0 ? 99 : ib);
    });
    for (const [k, v] of entries) {
      if (k === 'type' || k === 'shade') continue;
      if (k === 'show_power') { if (v) out.show_power = true; continue; }
      if (k === 'theme') { if (v !== 'blue') out.theme = v; continue; }
      if (k.startsWith('custom_') && value.theme !== 'custom') continue;

      if (['artwork', 'shade_top', 'shade_bottom'].includes(k) && value.theme !== resolveTheme(this._config).name && !(k in this._config)) continue;
      if (['artwork', 'shade_top', 'shade_bottom'].includes(k)) {
        const def = resolveTheme({ theme: value.theme, custom_background: value.custom_background, custom_accent: value.custom_accent, custom_text: value.custom_text });
        const d = k === 'artwork' ? def.art : k === 'shade_top' ? def.top : def.bottom;
        if (v !== d) out[k] = v;
        continue;
      }
      if (k === 'power_entity' && !value.show_power) continue;
      if (v === '' || v === undefined || v === null) continue;
      if (Array.isArray(v) && !v.length && k !== 'source_tabs') continue;
      if (k === 'icons') {
        const icons = Object.fromEntries(Object.entries(v).filter(([, x]) => x));
        if (Object.keys(icons).length) out.icons = icons;
        continue;
      }
      if (k in DEFAULTS && JSON.stringify(DEFAULTS[k]) === JSON.stringify(v)) continue;
      out[k] = v;
    }
    this._config = out;
    this.dispatchEvent(new CustomEvent('config-changed', { detail: { config: out }, bubbles: true, composed: true }));
  }
}

function makeEnvelope(key, n) {
  const r = mulberry(hash(key || 'ma'));
  const c1 = 0.22 + r() * 0.15, c2 = c1 + 0.2 + r() * 0.15;
  const env = [];
  for (let i = 0; i < n; i++) {
    const x = i / (n - 1);
    const e = 0.1 + 0.9 * Math.exp(-((x - c1) ** 2) / (2 * 0.12 ** 2)) + 0.55 * Math.exp(-((x - c2) ** 2) / (2 * 0.1 ** 2)) + 0.25 * (1 - x);
    const edge = x < 0.05 || x > 0.9 ? 0.3 : 1;
    env.push(clamp(e * edge * (0.7 + 0.3 * r())));
  }
  return env;
}

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

const withAlpha = (c, a) => {
  const hex = /^#([0-9a-f]{6})$/i.exec(c);
  if (hex) { const n = parseInt(hex[1], 16); return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${a})`; }
  const m = /rgba?\(([^)]+)\)/.exec(c);
  if (m) return `rgba(${m[1].split(',').slice(0, 3).join(',')},${a})`;
  return c;
};

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
  return {
    ok: true, name: c.name || a.friendly_name, mode: st.state, modes: (a.hvac_modes || ['off', 'heat', 'cool']).filter(keep),
    curRaw: cur, curUnit, hum, target, step: +a.target_temp_step || (unit.includes('F') ? 1 : 0.5), min: a.min_temp ?? 5, max: a.max_temp ?? 35,
    action: a.hvac_action, fanModes: a.fan_modes || [], fanMode: a.fan_mode, unit,
  };
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
  hass.callService('climate', 'set_hvac_mode', { entity_id: c.entity, hvac_mode: mode });
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
    this._config = { hours: 24, show_multiroom: true, ...config };
    this._themeKey = null;
    this._build();
    if (this._hass) this._update();
  }

  set hass(h) {
    this._hass = h;
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
          b.onclick = () => { this._hass.callService('climate', 'set_hvac_mode', { entity_id: id, hvac_mode: b.dataset.m }); box.hidden = true; };
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
    this._config = { ...c };
    this._themeKey = null;
    this.shadowRoot.innerHTML = `<style>${T_BADGE_STYLE}</style><div class="b" id="b"><span class="ic" id="ic"></span><span class="cur" id="cur">--</span><span class="tg" id="tg"></span></div>`;
    this._b = this.shadowRoot.getElementById('b');
    this._b.onclick = () => this._openPopup();
    if (this._hass) this._update();
  }
  set hass(h) { this._hass = h; if (this._b) this._update(); if (this._popup) this._popup.card.hass = h; }
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
  _openPopup() {
    if (this._popup) return;
    ensurePopupStyle();
    const wrap = document.createElement('div'); wrap.className = 'mmp-popup';
    const sheet = document.createElement('div'); sheet.className = 'mmp-sheet';
    const card = document.createElement('maestro-thermostat-card');
    card.setConfig({ ...this._config, type: 'custom:maestro-thermostat-card' });
    card.hass = this._hass;
    sheet.appendChild(card); wrap.appendChild(sheet);
    const close = () => { if (!this._popup) return; document.removeEventListener('keydown', onKey); wrap.classList.add('closing'); setTimeout(() => wrap.remove(), 180); this._popup = null; };
    const onKey = (e) => { if (e.key === 'Escape') close(); };
    wrap.addEventListener('click', (e) => { if (e.target === wrap) close(); });
    document.addEventListener('keydown', onKey);
    document.body.appendChild(wrap);
    this._popup = { wrap, card, close };
  }
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

if (!customElements.get(TAG)) customElements.define(TAG, MaMiniPlayerCard);
if (!customElements.get('maestro-player-badge')) customElements.define('maestro-player-badge', MaMiniPlayerBadge);
window.customBadges = window.customBadges || [];
if (!window.customBadges.some((b) => b.type === 'maestro-thermostat-badge')) {
  window.customBadges.push({ type: 'maestro-thermostat-badge', name: 'MAestro Thermostat (badge)', description: 'Tiny pill thermostat.', preview: true });
}
if (!window.customBadges.some((b) => b.type === 'maestro-player-badge')) {
  window.customBadges.push({ type: 'maestro-player-badge', name: 'MAestro Player (badge)', description: 'Tiny pill player for Music Assistant.', preview: true });
}

if (!customElements.get('ma-mini-player-card')) customElements.define('ma-mini-player-card', class extends MaMiniPlayerCard {});
if (!customElements.get('maestro-thermostat-card')) customElements.define('maestro-thermostat-card', MaestroThermostatCard);
if (!customElements.get('maestro-thermostat-editor')) customElements.define('maestro-thermostat-editor', MaestroThermostatEditor);
if (!customElements.get('maestro-thermostat-badge')) customElements.define('maestro-thermostat-badge', MaestroThermostatBadge);
if (!customElements.get('ma-mini-player-badge')) customElements.define('ma-mini-player-badge', class extends MaMiniPlayerBadge {});
if (!customElements.get(`${TAG}-editor`)) customElements.define(`${TAG}-editor`, MaMiniPlayerCardEditor);
window.customCards = window.customCards || [];
if (!window.customCards.some((c) => c.type === 'maestro-thermostat-card')) {
  window.customCards.push({ type: 'maestro-thermostat-card', name: 'MAestro Thermostat', description: 'Thermostat in the MAestro style: room temperature, target, history graph, modes.', preview: true });
}
if (!window.customCards.some((c) => c.type === TAG)) {
  window.customCards.push({
    type: TAG,
    name: 'MAestro Player',
    description: 'Glass player for Music Assistant: sources, multiroom, spectrum, DSP, lyrics.',
    preview: true,
  });
}
console.info(`%c MAESTRO PLAYER %c v${VERSION} `, 'color:#fff;background:#2196F3;font-weight:700', 'color:#2196F3;background:#fff');
