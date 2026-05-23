const fs = require('fs');
const src = fs.readFileSync('C:/FlippyBird/PayBack/index.html.bak', 'utf8');

// 1. Add font import after last meta tag
const headEnd = '</style>\n</head>';
const fontImport = `<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700;800&display=swap" rel="stylesheet">
`;

let html = src.replace('</style>\n</head>', fontImport + '</style>\n</head>');

// 2. Add CSS vars for dark mode and fonts
const cssVars = `--font:'Space Grotesk',-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Oxygen,sans-serif;
--bg:#F7F8FA;--card:#FFFFFF;--text:#111827;--text-secondary:#6B7280;--border:#E5E7EB;`;

const newCssVars = `--font:'Space Grotesk',-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Oxygen,sans-serif;
--font-mono:'Courier New',monospace;
--bg:#F7F8FA;--card:#FFFFFF;--text:#111827;--text-secondary:#6B7280;--border:#E5E7EB;`;

html = html.replace(cssVars, newCssVars);

// Add dark mode rules after :root
const afterRoot = html.indexOf('body{');
const darkModeCSS = `
[data-theme="dark"]{
--bg:#0A0A14;--card:#12122A;--text:#E8E8F0;--text-secondary:#8888B0;--border:#1E1E3A;
--green:#22C55E;--green-dark:#15803D;--green-light:rgba(34,197,94,0.15);
--red:#EF4444;--red-light:rgba(239,68,68,0.15);
--yellow:#F59E0B;--yellow-light:rgba(245,158,11,0.15);
--blue:#6366F1;--blue-light:rgba(99,102,241,0.15);
--purple:#A78BFA;--purple-light:rgba(167,139,250,0.15);
--shadow:0 1px 3px rgba(0,0,0,0.3);--shadow-md:0 4px 12px rgba(0,0,0,0.4);--shadow-lg:0 8px 24px rgba(0,0,0,0.5)
}
`;

html = html.slice(0, afterRoot) + darkModeCSS + html.slice(afterRoot);

// Replace body font-family to use var
html = html.replace(
  'font-family:-apple-system,BlinkMacSystemFont,\'Segoe UI\',Roboto,Oxygen,sans-serif;',
  'font-family:var(--font);'
);

// Add transition to body
html = html.replace(
  '-webkit-font-smoothing:antialiased;padding-bottom:',
  '-webkit-font-smoothing:antialiased;transition:background 0.3s,color 0.3s;padding-bottom:'
);

// Add transition to various elements
const addTransition = (selector, style) => {
  html = html.replace(style, style.replace('}', 'transition:background 0.3s,border-color 0.3s;color 0.3s}'));
};
// Simpler approach: batch replace common patterns
const transitions = [
  ['.app-header{', '.app-header{transition:background 0.3s,border-color 0.3s}'],
  ['.bottom-nav{', '.bottom-nav{transition:background 0.3s,border-color 0.3s}'],
  ['.card{background:var(--card);border-radius:var(--radius);box-shadow:var(--shadow);padding:16px;margin-bottom:12px}', '.card{background:var(--card);border-radius:var(--radius);box-shadow:var(--shadow);padding:16px;margin-bottom:12px;transition:background 0.3s}'],
  ['.balance-card{background:var(--card);border-radius:var(--radius);box-shadow:var(--shadow-md);padding:20px;margin-bottom:16px}', '.balance-card{background:var(--card);border-radius:var(--radius);box-shadow:var(--shadow-md);padding:20px;margin-bottom:16px;transition:background 0.3s}'],
  ['.debt-card{background:var(--card);border-radius:var(--radius);box-shadow:var(--shadow);padding:14px;margin-bottom:8px;cursor:pointer;transition:transform 0.15s}', '.debt-card{background:var(--card);border-radius:var(--radius);box-shadow:var(--shadow);padding:14px;margin-bottom:8px;cursor:pointer;transition:transform 0.15s,background 0.3s}'],
  ['.group-card{background:var(--card);border-radius:var(--radius);box-shadow:var(--shadow);padding:14px;margin-bottom:8px;cursor:pointer}', '.group-card{background:var(--card);border-radius:var(--radius);box-shadow:var(--shadow);padding:14px;margin-bottom:8px;cursor:pointer;transition:background 0.3s}'],
  ['.modal-content{background:var(--card);border-radius:var(--radius) var(--radius) 0 0;width:100%;max-width:480px;max-height:85vh;overflow-y:auto;padding:20px;animation:slideUp 0.25s ease}', '.modal-content{background:var(--card);border-radius:var(--radius) var(--radius) 0 0;width:100%;max-width:480px;max-height:85vh;overflow-y:auto;padding:20px;animation:slideUp 0.25s ease;transition:background 0.3s}'],
  ['.detail-hero{background:var(--card);border-radius:var(--radius);box-shadow:var(--shadow-md);padding:24px;text-align:center;margin-bottom:12px}', '.detail-hero{background:var(--card);border-radius:var(--radius);box-shadow:var(--shadow-md);padding:24px;text-align:center;margin-bottom:12px;transition:background 0.3s}'],
  ['.stat-card{background:var(--card);border-radius:var(--radius-sm);box-shadow:var(--shadow);padding:14px;text-align:center}', '.stat-card{background:var(--card);border-radius:var(--radius-sm);box-shadow:var(--shadow);padding:14px;text-align:center;transition:background 0.3s}'],
  ['.form-input{width:100%;padding:12px 14px;border:1.5px solid var(--border);border-radius:var(--radius-sm);font-size:15px;color:var(--text);background:var(--bg);transition:border-color 0.15s}', '.form-input{width:100%;padding:12px 14px;border:1.5px solid var(--border);border-radius:var(--radius-sm);font-size:15px;color:var(--text);background:var(--bg);transition:border-color 0.15s,background 0.3s}'],
  ['.search-bar input{width:100%;padding:10px 14px 10px 38px;border:1.5px solid var(--border);border-radius:999px;font-size:14px;color:var(--text);background:var(--card)}', '.search-bar input{width:100%;padding:10px 14px 10px 38px;border:1.5px solid var(--border);border-radius:999px;font-size:14px;color:var(--text);background:var(--card);transition:border-color 0.15s,background 0.3s}'],
];

transitions.forEach(([oldStr, newStr]) => {
  html = html.replace(oldStr, newStr);
});

// 3. Add splash screen HTML after <body>
const splashHTML = `
<!-- SPLASH SCREEN -->
<div id="splashOverlay">
  <canvas id="splashCanvas"></canvas>
  <button id="splashSkip" onclick="skipSplash()">\u00dcberspringen \u25b6</button>
</div>

`;
html = html.replace('<!-- APP HEADER -->', splashHTML + '<!-- APP HEADER -->');

// 4. Add splash CSS before the responsive section
const splashCSS = `
/* Splash Screen */
#splashOverlay{position:fixed;top:0;left:0;right:0;bottom:0;z-index:9999;display:flex;align-items:center;justify-content:center;background:#0A0A14;flex-direction:column;overflow:hidden}
#splashOverlay.hidden{opacity:0;pointer-events:none;transition:opacity 0.6s ease}
#splashCanvas{position:absolute;top:0;left:0;width:100%;height:100%}
#splashSkip{position:absolute;bottom:40px;z-index:10;background:rgba(255,255,255,0.1);border:1px solid rgba(255,255,255,0.2);color:rgba(255,255,255,0.6);padding:8px 20px;border-radius:999px;font-size:12px;cursor:pointer;font-family:var(--font);backdrop-filter:blur(8px);transition:all 0.2s}
#splashSkip:hover{background:rgba(255,255,255,0.2);color:#fff}

`;

html = html.replace('/* Responsive */', splashCSS + '/* Responsive */');

// 5. Add dark mode toggle button in header
html = html.replace(
  '<button class="header-btn" onclick="showSearch()" title="Suchen">\uD83D\uDD0D</button>',
  '<button class="header-btn" id="darkToggle" onclick="toggleDarkMode()" title="Dark Mode">\uD83C\uDF19</button>\n    <button class="header-btn" onclick="showSearch()" title="Suchen">\uD83D\uDD0D</button>'
);

// 6. Add dark mode toggle to settings
html = html.replace(
  '<h3>Profil & Design</h3>',
  '<h3>Profil & Design</h3>'
);

// Check if settings already have dark mode item
if (!html.includes('settingsDarkToggle')) {
  html = html.replace(
    '<div class="settings-item">\n        <div class="s-left">\n          <div class="s-icon" style="background:var(--blue-light);color:var(--blue)">\uD83D\uDC64</div>\n          <span class="s-label">Dein Name</span>\n        </div>\n        <input class="form-input" id="settingsName" placeholder="Name" style="width:120px;text-align:right;padding:6px 10px;font-size:13px">\n      </div>',
    `<div class="settings-item">
        <div class="s-left">
          <div class="s-icon" style="background:var(--blue-light);color:var(--blue)">\uD83D\uDC64</div>
          <span class="s-label">Dein Name</span>
        </div>
        <input class="form-input" id="settingsName" placeholder="Name" style="width:120px;text-align:right;padding:6px 10px;font-size:13px">
      </div>
      <div class="settings-item">
        <div class="s-left">
          <div class="s-icon" style="background:var(--purple-light);color:var(--purple)">\uD83C\uDF19</div>
          <span class="s-label">Dark Mode</span>
        </div>
        <button class="settings-toggle" id="settingsDarkToggle" onclick="toggleDarkMode()"></button>
      </div>`
  );
}

// 7. Add editable texts section to settings
if (!html.includes('showTextEditor')) {
  const textEditorSection = `
  <div class="settings-group">
    <h3>Texte anpassen</h3>
    <div class="card" style="padding:0">
      <div class="settings-item" onclick="showTextEditor('appName')">
        <div class="s-left">
          <div class="s-icon" style="background:var(--green-light);color:var(--green)">\uD83D\uDCF1</div>
          <span class="s-label">App-Name</span>
        </div>
        <span class="s-value" id="tv_appName">PayBack</span>
      </div>
      <div class="settings-item" onclick="showTextEditor('balanceTitle')">
        <div class="s-left">
          <div class="s-icon" style="background:var(--green-light);color:var(--green)">\uD83D\uDCB0</div>
          <span class="s-label">Balance-Titel</span>
        </div>
        <span class="s-value" id="tv_balanceTitle">Dein Stand</span>
      </div>
      <div class="settings-item" onclick="showTextEditor('owedLabel')">
        <div class="s-left">
          <div class="s-icon" style="background:var(--green-light);color:var(--green)">\uD83D\uDCD7</div>
          <span class="s-label">Label "Bekommen"</span>
        </div>
        <span class="s-value" id="tv_owedLabel">Dir werden geschuldet</span>
      </div>
      <div class="settings-item" onclick="showTextEditor('oweLabel')">
        <div class="s-left">
          <div class="s-icon" style="background:var(--red-light);color:var(--red)">\uD83D\uDCD5</div>
          <span class="s-label">Label "Schulden"</span>
        </div>
        <span class="s-value" id="tv_oweLabel">Du schuldest</span>
      </div>
      <div class="settings-item" onclick="showTextEditor('netLabel')">
        <div class="s-left">
          <div class="s-icon" style="background:var(--purple-light);color:var(--purple)">\u2696\uFE0F</div>
          <span class="s-label">Label "Netto"</span>
        </div>
        <span class="s-value" id="tv_netLabel">Netto</span>
      </div>
      <div class="settings-item" onclick="showTextEditor('searchPlaceholder')">
        <div class="s-left">
          <div class="s-icon" style="background:var(--blue-light);color:var(--blue)">\uD83D\uDD0D</div>
          <span class="s-label">Suche Platzhalter</span>
        </div>
        <span class="s-value" id="tv_searchPlaceholder">Person, Betrag oder Grund suchen</span>
      </div>
      <div class="settings-item" onclick="showTextEditor('reasonPlaceholder')">
        <div class="s-left">
          <div class="s-icon" style="background:var(--blue-light);color:var(--blue)">\uD83D\uDCDD</div>
          <span class="s-label">Grund Platzhalter</span>
        </div>
        <span class="s-value" id="tv_reasonPlaceholder">z.B. Essen, Taxi, Kleinanzeigen, Einkauf</span>
      </div>
      <div class="settings-item" onclick="showTextEditor('emptyTitle')">
        <div class="s-left">
          <div class="s-icon" style="background:var(--yellow-light);color:var(--yellow)">\uD83D\uDCED</div>
          <span class="s-label">Leer-Titel</span>
        </div>
        <span class="s-value" id="tv_emptyTitle">Alles ausgeglichen</span>
      </div>
      <div class="settings-item" onclick="showTextEditor('emptyDesc')">
        <div class="s-left">
          <div class="s-icon" style="background:var(--yellow-light);color:var(--yellow)">\uD83D\uDCC4</div>
          <span class="s-label">Leer-Beschreibung</span>
        </div>
        <span class="s-value" id="tv_emptyDesc">Du hast aktuell keine offenen Betr\u00e4ge.</span>
      </div>
    </div>
  </div>

  <div class="settings-group">
    <h3>Navigation</h3>
    <div class="card" style="padding:0">
      <div class="settings-item" onclick="showTextEditor('navDashboard')">
        <div class="s-left">
          <div class="s-icon" style="background:var(--green-light);color:var(--green)">\uD83C\uDFE0</div>
          <span class="s-label">Tab: \u00dcbersicht</span>
        </div>
        <span class="s-value" id="tv_navDashboard">\u00dcbersicht</span>
      </div>
      <div class="settings-item" onclick="showTextEditor('navDebts')">
        <div class="s-left">
          <div class="s-icon" style="background:var(--green-light);color:var(--green)">\uD83D\uDCB6</div>
          <span class="s-label">Tab: Schulden</span>
        </div>
        <span class="s-value" id="tv_navDebts">Schulden</span>
      </div>
      <div class="settings-item" onclick="showTextEditor('navAdd')">
        <div class="s-left">
          <div class="s-icon" style="background:var(--green-light);color:var(--green)">\u2795</div>
          <span class="s-label">Tab: Hinzuf\u00fcgen</span>
        </div>
        <span class="s-value" id="tv_navAdd">Hinzuf\u00fcgen</span>
      </div>
      <div class="settings-item" onclick="showTextEditor('navGroups')">
        <div class="s-left">
          <div class="s-icon" style="background:var(--green-light);color:var(--green)">\uD83D\uDC65</div>
          <span class="s-label">Tab: Gruppen</span>
        </div>
        <span class="s-value" id="tv_navGroups">Gruppen</span>
      </div>
      <div class="settings-item" onclick="showTextEditor('navSettings')">
        <div class="s-left">
          <div class="s-icon" style="background:var(--green-light);color:var(--green)">\u2699\uFE0F</div>
          <span class="s-label">Tab: Einstellungen</span>
        </div>
        <span class="s-value" id="tv_navSettings">Einstellungen</span>
      </div>
    </div>
  </div>
`;
  // Insert after the settings group that has "Zahlungsdaten"
  html = html.replace(
    '<div class="settings-group">\n    <h3>Daten</h3>',
    textEditorSection + '\n  <div class="settings-group">\n    <h3>Daten</h3>'
  );
}

// 8. Add nav labels with IDs in bottom nav
// Replace hardcoded nav labels with IDs
html = html.replace(
  '<span>\u00dcbersicht</span>\n  </button>\n  <button class="nav-item" data-tab="debts"',
  '<span id="navLabelDashboard">\u00dcbersicht</span>\n  </button>\n  <button class="nav-item" data-tab="debts"'
);
html = html.replace(
  '<span>Schulden</span>\n  </button>\n  <button class="nav-item nav-add"',
  '<span id="navLabelDebts">Schulden</span>\n  </button>\n  <button class="nav-item nav-add"'
);
html = html.replace(
  '<span style="margin-top:2px">Hinzuf\u00fcgen</span>',
  '<span style="margin-top:2px" id="navLabelAdd">Hinzuf\u00fcgen</span>'
);
html = html.replace(
  '<span>Gruppen</span>\n  </button>\n  <button class="nav-item" data-tab="settings"',
  '<span id="navLabelGroups">Gruppen</span>\n  </button>\n  <button class="nav-item" data-tab="settings"'
);
html = html.replace(
  '<span>Einstellungen</span>\n  </button>',
  '<span id="navLabelSettings">Einstellungen</span>\n  </button>'
);

// 9. Add new JS functions for dark mode, editable texts, splash animation
// Find the end of the script section and insert before service worker registration
const jsEnd = html.indexOf('// ===== INIT =====');
if (jsEnd > 0) {
  const newJS = `
// ===== DARK MODE =====
function toggleDarkMode(){
  state.settings.darkMode = !state.settings.darkMode;
  applyDarkMode();
  saveState();
  var toggle = document.getElementById('darkToggle');
  if(toggle) toggle.textContent = state.settings.darkMode ? '☀️' : '🌙';
  var st = document.getElementById('settingsDarkToggle');
  if(st) st.classList.toggle('active', state.settings.darkMode);
}

function applyDarkMode(){
  document.documentElement.setAttribute('data-theme', state.settings.darkMode ? 'dark' : '');
  var meta = document.querySelector('meta[name="theme-color"]');
  if(meta) meta.content = state.settings.darkMode ? '#0A0A14' : '#22C55E';
}

// ===== EDITABLE TEXTS =====
function applyTexts(){
  var t = state.settings.texts || {};
  var title = document.getElementById('headerTitle');
  if(title && t.appName) title.textContent = t.appName;
  var labels = {navDashboard:'navLabelDashboard',navDebts:'navLabelDebts',navAdd:'navLabelAdd',navGroups:'navLabelGroups',navSettings:'navLabelSettings'};
  for(var k in labels){ var el=document.getElementById(labels[k]); if(el && t[k]) el.textContent=t[k]; }
  document.querySelectorAll('[id^="tv_"]').forEach(function(el){
    var key=el.id.replace('tv_','');
    if(t[key] !== undefined) el.textContent=t[key];
  });
}

function showTextEditor(key){
  var t = state.settings.texts||{};
  var current = t[key]||'';
  var labels = {
    appName:'App-Name', balanceTitle:'Balance-Titel',
    owedLabel:'Label "Bekommen"', oweLabel:'Label "Schulden"', netLabel:'Label "Netto"',
    searchPlaceholder:'Suche Platzhalter', reasonPlaceholder:'Grund Platzhalter',
    emptyTitle:'Leer-Titel', emptyDesc:'Leer-Beschreibung',
    navDashboard:'Tab Übersicht', navDebts:'Tab Schulden', navAdd:'Tab Hinzufügen',
    navGroups:'Tab Gruppen', navSettings:'Tab Einstellungen'
  };
  openModal(labels[key]||'Text bearbeiten',
    '<div class="form-group"><label class="form-label">Text</label>'+
    '<input class="form-input" id="textEditInput" value="'+current.replace(/\"/g,'&quot;')+'" autofocus></div>'+
    '<button class="btn btn-primary btn-block" onclick="saveTextEdit(\\''+key+'\\')">Speichern</button>'
  );
  setTimeout(function(){
    var inp=document.getElementById('textEditInput');
    if(inp){inp.focus();inp.select();}
  },100);
}

function saveTextEdit(key){
  var val=document.getElementById('textEditInput').value.trim();
  if(!val) return showToast('Text darf nicht leer sein.');
  if(!state.settings.texts) state.settings.texts={};
  state.settings.texts[key]=val;
  saveState();
  applyTexts();
  closeModal();
  showToast('Text gespeichert!');
}

// ===== SPLASH ANIMATION =====
var splashAnimId = null;

function skipSplash(){
  if(splashAnimId){ cancelAnimationFrame(splashAnimId); splashAnimId=null; }
  closeSplash();
}

function closeSplash(){
  var overlay=document.getElementById('splashOverlay');
  overlay.classList.add('hidden');
  setTimeout(function(){ overlay.style.display='none'; },600);
}

function startSplash(){
  var canvas=document.getElementById('splashCanvas');
  if(!canvas) return;
  var ctx=canvas.getContext('2d');
  var W,H;
  function resize(){ W=canvas.width=canvas.offsetWidth; H=canvas.height=canvas.offsetHeight; }
  resize();
  window.addEventListener('resize',resize);

  // Sound
  var audioCtx=null;
  function ensureAudio(){ if(!audioCtx) try{audioCtx=new(window.AudioContext||window.webkitAudioContext)();}catch(e){} }

  function playPunch(vol){
    try{
      ensureAudio();
      var osc=audioCtx.createOscillator(), gain=audioCtx.createGain();
      var nsrc=audioCtx.createBufferSource();
      var buf=audioCtx.createBuffer(1,audioCtx.sampleRate*0.1,audioCtx.sampleRate);
      var d=buf.getChannelData(0);
      for(var i=0;i<d.length;i++) d[i]=(Math.random()*2-1)*Math.exp(-i/(audioCtx.sampleRate*0.02));
      nsrc.buffer=buf; var ng=audioCtx.createGain(); ng.gain.value=0.3*vol;
      nsrc.connect(ng); ng.connect(audioCtx.destination); nsrc.start();
      osc.type='sawtooth'; osc.frequency.value=80+(1-vol)*40;
      gain.gain.value=0.15*vol; gain.gain.exponentialRampToValueAtTime(0.001,audioCtx.currentTime+0.1);
      osc.connect(gain); gain.connect(audioCtx.destination);
      osc.start(); osc.stop(audioCtx.currentTime+0.1);
      nsrc.stop(audioCtx.currentTime+0.1);
    }catch(e){}
  }

  function playCoin(vol){
    try{
      ensureAudio();
      var osc=audioCtx.createOscillator(), gain=audioCtx.createGain();
      osc.type='sine'; osc.frequency.value=1200+vol*800;
      gain.gain.value=0.08*vol; gain.gain.exponentialRampToValueAtTime(0.001,audioCtx.currentTime+0.15);
      osc.connect(gain); gain.connect(audioCtx.destination);
      osc.start(); osc.stop(audioCtx.currentTime+0.15);
    }catch(e){}
  }

  function playExplosion(){
    try{
      ensureAudio();
      var nsrc=audioCtx.createBufferSource();
      var buf=audioCtx.createBuffer(1,audioCtx.sampleRate*1.2,audioCtx.sampleRate);
      var d=buf.getChannelData(0);
      for(var i=0;i<d.length;i++) d[i]=(Math.random()*2-1)*Math.exp(-i/(audioCtx.sampleRate*0.15));
      nsrc.buffer=buf; var gain=audioCtx.createGain();
      gain.gain.value=0.5; gain.gain.exponentialRampToValueAtTime(0.001,audioCtx.currentTime+1.0);
      nsrc.connect(gain); gain.connect(audioCtx.destination); nsrc.start();
      var osc=audioCtx.createOscillator(), og=audioCtx.createGain();
      osc.type='sine'; osc.frequency.value=40; osc.frequency.exponentialRampToValueAtTime(20,audioCtx.currentTime+0.8);
      og.gain.value=0.4; og.gain.exponentialRampToValueAtTime(0.001,audioCtx.currentTime+0.8);
      osc.connect(og); og.connect(audioCtx.destination);
      osc.start(); osc.stop(audioCtx.currentTime+0.8);
    }catch(e){}
  }

  var moneyEmojis = ['💰','💵','💶','💷','🪙','💎','$','€'];
  var coins = [];
  var t=0, phase=0, phaseTime=0;

  for(var i=0;i<25;i++){
    coins.push({
      x:Math.random()*W, y:Math.random()*H,
      vx:(Math.random()-0.5)*2, vy:-Math.random()*3-1,
      emoji:moneyEmojis[Math.floor(Math.random()*moneyEmojis.length)],
      size:14+Math.random()*20, rot:Math.random()*Math.PI*2,
      vr:(Math.random()-0.5)*0.1, op:0.3+Math.random()*0.4
    });
  }

  function drawFig(cx,cy,isLeft,punch,hit){
    var dir=isLeft?1:-1;
    ctx.fillStyle='rgba(0,0,0,0.2)';
    ctx.beginPath(); ctx.ellipse(cx,cy+55,20,6,0,0,Math.PI*2); ctx.fill();
    ctx.strokeStyle='#fff'; ctx.lineWidth=3; ctx.lineCap='round';
    // Head
    ctx.beginPath(); ctx.arc(cx,cy-25,14,0,Math.PI*2); ctx.stroke();
    if(hit>0.5){
      ctx.fillStyle='#FFD700'; ctx.font='14px sans-serif'; ctx.textAlign='center'; ctx.textBaseline='middle';
      ctx.fillText('😵',cx,cy-25);
    } else if(hit>0.2){
      ctx.fillStyle='#FFD700'; ctx.font='14px sans-serif';
      ctx.fillText('😖',cx,cy-25);
    } else {
      ctx.fillStyle='#fff';
      ctx.beginPath(); ctx.arc(cx-5*dir,cy-28,2.5,0,Math.PI*2); ctx.arc(cx+5*dir,cy-28,2.5,0,Math.PI*2); ctx.fill();
      ctx.beginPath(); ctx.moveTo(cx-4,cy-18); ctx.lineTo(cx,cy-15); ctx.lineTo(cx+4,cy-18); ctx.stroke();
    }
    // Neck
    ctx.beginPath(); ctx.moveTo(cx,cy-11); ctx.lineTo(cx,cy-4); ctx.stroke();
    // Punch arm
    var pe=punch*30*dir;
    ctx.beginPath(); ctx.moveTo(cx+(isLeft?10:-10),cy);
    if(punch>0) ctx.lineTo(cx+(isLeft?10:-10)+pe*1.5,cy-8+punch*10);
    else ctx.lineTo(cx+(isLeft?-10:10),cy-15);
    ctx.stroke();
    // Guard arm
    ctx.beginPath(); ctx.moveTo(cx+(isLeft?-10:10),cy); ctx.lineTo(cx+(isLeft?-20:20),cy-5); ctx.stroke();
    // Legs
    ctx.beginPath(); ctx.moveTo(cx-5,cy+15); ctx.lineTo(cx-8-dir*Math.sin(t/2)*3,cy+40);
    ctx.moveTo(cx+5,cy+15); ctx.lineTo(cx+8+dir*Math.sin(t/2)*3,cy+40); ctx.stroke();
    // Torso
    ctx.beginPath(); ctx.moveTo(cx-8,cy-4); ctx.lineTo(cx+8,cy-4); ctx.lineTo(cx+10,cy+15); ctx.lineTo(cx-10,cy+15); ctx.closePath(); ctx.stroke();
    // Glove
    if(punch>0.3){
      ctx.fillStyle='#EF4444'; ctx.beginPath();
      ctx.arc(cx+(isLeft?10:-10)+pe*1.5,cy-8+punch*10,5,0,Math.PI*2); ctx.fill();
    }
    if(hit>0.3){
      for(var j=0;j<5;j++){
        var a=Math.random()*Math.PI*2, r=10+Math.random()*15*hit;
        ctx.fillStyle='#FFD700'; ctx.font='10px sans-serif';
        ctx.fillText('✦',cx+Math.cos(a)*r,cy+Math.sin(a)*r);
      }
    }
  }

  function drawBG(){
    var g=ctx.createLinearGradient(0,0,0,H);
    g.addColorStop(0,'#0A0A14'); g.addColorStop(0.5,'#12122A'); g.addColorStop(1,'#1A0A2E');
    ctx.fillStyle=g; ctx.fillRect(0,0,W,H);
  }

  function animate(ts){
    t+=0.016; phaseTime+=0.016;
    if(phase===0&&phaseTime>1.5){phase=1;phaseTime=0;playCoin(0.5);}
    if(phase===1&&phaseTime>2.0){phase=2;phaseTime=0;}
    if(phase===2&&phaseTime>1.0){phase=3;phaseTime=0;playExplosion();}
    if(phase===3&&phaseTime>1.2){phase=4;phaseTime=0;}

    drawBG();
    var cx1=W*0.32,cx2=W*0.68,cy=H*0.5+20;

    // Floating coins
    coins.forEach(function(c){
      c.x+=c.vx; c.y+=c.vy; c.rot+=c.vr;
      if(c.y<-30){c.y=H+20;c.x=Math.random()*W;}
      if(c.x<-20||c.x>W+20)c.vx*=-1;
      ctx.save();
      ctx.globalAlpha=c.op*(phase===3?1+phaseTime*0.5:phase===4?Math.max(0,1-phaseTime):0.7);
      ctx.font=c.size+'px sans-serif'; ctx.textAlign='center'; ctx.textBaseline='middle';
      ctx.translate(c.x,c.y); ctx.rotate(c.rot);
      ctx.fillText(c.emoji,0,0);
      ctx.restore();
    });

    // Set fighting animation values
    var p1=0,p2=0,h1=0,h2=0;
    if(phase===1){
      var ft=phaseTime;
      // Alternating punches
      if(ft%0.6<0.15) p1=(ft%0.6)/0.15;
      else if(ft%0.6<0.3) p2=((ft%0.6)-0.15)/0.15;
      else if(ft%0.6<0.45) p1=(ft%0.6-0.3)/0.15;
      else p2=(ft%0.6-0.45)/0.15;
      if(p1>0.8) h2=(p1-0.8)*5;
      if(p2>0.8) h1=(p2-0.8)*5;
    }
    if(phase===2){
      // Wind up
      var wt=Math.min(phaseTime*2,1);
      p1=wt*0.3; p2=wt*0.3;
    }
    if(phase===3){
      // Explosion
      p1=0; p2=0; h1=phaseTime*2; h2=phaseTime*2;
    }

    drawFig(cx1,cy,true,p1>0.3?0:p1,p1>0.8?h2:h1);
    drawFig(cx2,cy,false,p2>0.3?0:p2,p2>0.8?h1:h2);

    // Title
    var titleAlpha=phase===0?Math.min(phaseTime*3,1):phase===4?Math.max(0,1-phaseTime*2):1;
    ctx.save();
    ctx.globalAlpha=titleAlpha;
    ctx.fillStyle='#22C55E'; ctx.font='bold 48px Space Grotesk, sans-serif';
    ctx.textAlign='center'; ctx.textBaseline='middle';
    ctx.shadowColor='rgba(34,197,94,0.3)'; ctx.shadowBlur=20;
    ctx.fillText('PayBack',W/2,H*0.2);
    ctx.shadowBlur=0;
    ctx.fillStyle='rgba(255,255,255,0.3)'; ctx.font='16px Space Grotesk, sans-serif';
    ctx.fillText('Geld zurückholen leicht gemacht',W/2,H*0.2+35);
    ctx.restore();

    // Explosion particles
    if(phase===3){
      for(var i=0;i<20;i++){
        var a=Math.random()*Math.PI*2, r=phaseTime*300*Math.random();
        var s=5+Math.random()*15;
        ctx.fillStyle='hsl('+(40+Math.random()*30)+',100%,60%)';
        ctx.beginPath(); ctx.arc(cx1+Math.cos(a)*r,cy+Math.sin(a)*r,s,0,Math.PI*2); ctx.fill();
      }
      ctx.fillStyle='rgba(255,200,50,'+(phaseTime>0.5?Math.min(1,(phaseTime-0.5)*3):0)+')';
      ctx.beginPath(); ctx.arc(W/2,H*0.5,phaseTime*200,0,Math.PI*2); ctx.fill();
    }

    if(phase<4) splashAnimId=requestAnimationFrame(animate);
    else closeSplash();
  }
  splashAnimId=requestAnimationFrame(animate);
}

// Update init to show splash first
var _origInit = function(){
  loadState();
  applyDarkMode();
  applyTexts();
  // Start splash then show dashboard
  setTimeout(function(){ startSplash(); }, 100);
  setTimeout(function(){
    navigateTo('dashboard');
    // Force splash visible
    document.getElementById('splashOverlay').style.display='flex';
  }, 50);
};
_origInit();
// Remove old init call
`;
  html = html.replace('// ===== INIT =====', newJS);
  // Remove the old loadState(); navigateTo('dashboard'); lines
  html = html.replace(/loadState\(\);\s*navigateTo\('dashboard'\);\s*\n/, '');
}

// 10. Add dark mode to state.settings
html = html.replace(
  "defaultTone: 'Neutral', currency: 'EUR'",
  "defaultTone: 'Neutral', currency: 'EUR', darkMode: false"
);

// Add texts to settings
html = html.replace(
  "defaultTone: 'Neutral', currency: 'EUR', darkMode: false",
  "defaultTone: 'Neutral', currency: 'EUR', darkMode: false,\n    texts: {\n      appName:'PayBack', balanceTitle:'Dein Stand',\n      owedLabel:'Dir werden geschuldet', oweLabel:'Du schuldest', netLabel:'Netto',\n      searchPlaceholder:'Person, Betrag oder Grund suchen',\n      reasonPlaceholder:'z.B. Essen, Taxi, Kleinanzeigen, Einkauf',\n      emptyTitle:'Alles ausgeglichen', emptyDesc:'Du hast aktuell keine offenen Beträge.',\n      navDashboard:'Übersicht', navDebts:'Schulden', navAdd:'Hinzufügen',\n      navGroups:'Gruppen', navSettings:'Einstellungen'\n    }"
);

// Update clearAllData to preserve texts
html = html.replace(
  "state.settings={name:'',paypal:'',paypalInMessage:false,defaultTone:'Neutral',currency:'EUR'};",
  "state.settings={name:'',paypal:'',paypalInMessage:false,defaultTone:'Neutral',currency:'EUR',darkMode:false,texts:{...state.settings.texts}};"
);

// Update renderSettings to include dark toggle
html = html.replace(
  "document.getElementById('settingsName').value=state.settings.name||'';",
  "document.getElementById('settingsName').value=state.settings.name||'';\n  var dm=document.getElementById('settingsDarkToggle'); if(dm) dm.classList.toggle('active',!!state.settings.darkMode);\n  applyTexts();"
);

// Update renderDashboard to use editable texts
html = html.replace(
  "document.getElementById('dashOwedToMe').textContent = formatMoney(owedToMe);",
  "var t=state.settings.texts||{};\n  var bt=document.querySelector('.balance-card .label'); if(bt) bt.textContent=t.balanceTitle||'Dein Stand';\n  var r1=document.querySelectorAll('.balance-row .lbl'); if(r1.length>0) r1[0].textContent=t.owedLabel||'Dir werden geschuldet';\n  var r2=document.querySelectorAll('.balance-row .lbl'); if(r2.length>1) r2[1].textContent=t.oweLabel||'Du schuldest';\n  var n=document.querySelector('.balance-net .lbl'); if(n) n.textContent=t.netLabel||'Netto';\n  document.getElementById('dashOwedToMe').textContent = formatMoney(owedToMe);"
);

// Update empty state in dashboard
html = html.replace(
  "container.innerHTML = '<div class=\"empty-state\"><div class=\"empty-icon\">✅</div><h3>Alles ausgeglichen</h3><p>Du hast aktuell keine offenen Beträge.</p></div>';",
  "container.innerHTML = '<div class=\"empty-state\"><div class=\"empty-icon\">✅</div><h3>'+t.emptyTitle+'</h3><p>'+t.emptyDesc+'</p></div>';"
);

// Update search placeholder
html = html.replace(
  "document.getElementById('debtSearch').placeholder = 'Person, Betrag oder Grund suchen';",
  "document.getElementById('debtSearch').placeholder = (state.settings.texts||{}).searchPlaceholder||'Person, Betrag oder Grund suchen';"
);

// Update reason placeholder in add form
html = html.replace(
  'document.getElementById(\'addReason\').placeholder=\'z.B. Essen, Taxi, Kleinanzeigen, Einkauf\';',
  "document.getElementById('addReason').placeholder=(state.settings.texts||{}).reasonPlaceholder||'z.B. Essen, Taxi, Kleinanzeigen, Einkauf';"
);

// Update version
html = html.replace('>1.0.0</span>', '>1.1.0</span>');

// Write result
fs.writeFileSync('C:/FlippyBird/PayBack/index.html', html, 'utf8');
console.log('Done! File size: ' + (html.length/1024).toFixed(1) + ' KB');
