const VERSION = '1.4.0';

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

const svg = (d) => `<svg viewBox="0 0 24 24"><path d="${d}"/></svg>`;

const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));

const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

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

const withAlpha = (c, a) => {
  const hex = /^#([0-9a-f]{6})$/i.exec(c);
  if (hex) { const n = parseInt(hex[1], 16); return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${a})`; }
  const m = /rgba?\(([^)]+)\)/.exec(c);
  if (m) return `rgba(${m[1].split(',').slice(0, 3).join(',')},${a})`;
  return c;
};

console.info(`%c MAESTRO %c v${VERSION} `, 'color:#fff;background:#2196F3;font-weight:700', 'color:#2196F3;background:#fff');

export { VERSION, P, svg, clamp, esc, STYLE, THEMES, THEME_NAMES, THEME_LABELS, rgbStr, luminance, resolveTheme, ensurePopupStyle, withAlpha };
