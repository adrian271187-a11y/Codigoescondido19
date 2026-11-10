// ══════════════════════════════════════════
//  PWA — Service Worker + Modal instalación
//  Chrome / Edge: botón directo
//  Safari iOS:    instrucciones paso a paso
//  Safari macOS:  instrucciones Archivo > Añadir
// ══════════════════════════════════════════

// ── 1. SERVICE WORKER ──
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/Codigoescondido19/sw.js').catch(() => {});
  });
}

// ── 2. DETECTORES ──
const isIOS     = /iphone|ipad|ipod/i.test(navigator.userAgent) && !window.MSStream;
const isAndroid = /android/i.test(navigator.userAgent);
const isSafari  = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
const isMac     = /macintosh/i.test(navigator.userAgent) && isSafari;

function yaInstalada() {
  return window.matchMedia('(display-mode: standalone)').matches ||
         navigator.standalone === true;
}

if (yaInstalada()) { /* ya instalada, no mostrar nada */ } else {

// ── 3. MODAL HTML ──
document.body.insertAdjacentHTML('beforeend', `
<div id="pwa-overlay" style="
  display:none; position:fixed; inset:0; z-index:9999;
  background:rgba(0,0,0,.75); backdrop-filter:blur(8px);
  align-items:flex-end; justify-content:center; padding:1rem;
  font-family:'Lato',sans-serif;">

  <div id="pwa-box" style="
    background:#1a1a2e; width:100%; max-width:460px;
    border-top:3px solid #c9a84c; position:relative;
    padding:0; overflow:hidden; border-radius:0 0 4px 4px;">

    <!-- Header con arcoíris -->
    <div style="
      background:linear-gradient(135deg,#2d1b69 0%,#1a1a2e 60%);
      padding:1.5rem 1.5rem 1rem;
      border-bottom:1px solid rgba(201,168,76,.2);">
      <button onclick="cerrarPWA()" style="
        position:absolute; top:.8rem; right:1rem;
        background:none; border:none; color:#9494a4;
        font-size:1.4rem; cursor:pointer; line-height:1;">✕</button>

      <div style="display:flex; align-items:center; gap:1rem;">
        <img src="assets/icons/icon-192.png" style="
          width:60px; height:60px; border-radius:14px;
          border:2px solid rgba(201,168,76,.4);" alt="CE19">
        <div>
          <div style="font-family:'Cinzel',serif; color:#c9a84c;
                      font-size:1.05rem; font-weight:700;">
            Código Escondido 19
          </div>
          <div style="color:#9494a4; font-size:.78rem; margin-top:.2rem;">
            codigoescondido19
          </div>
        </div>
      </div>

      <p style="color:#f0eee8; font-size:.88rem; line-height:1.6;
                margin:.9rem 0 0;">
        Instala la app y accede a las enseñanzas, herramientas
        y el calendario sumerio directamente desde tu pantalla de inicio.
      </p>
    </div>

    <!-- Cuerpo según plataforma -->
    <div style="padding:1.2rem 1.5rem 1.5rem;">

      <!-- Chrome / Edge: botón directo -->
      <div id="pwa-chrome">
        <button onclick="instalarPWA()" id="pwa-btn-instalar" style="
          width:100%; background:#c9a84c; color:#0a0a0f;
          font-family:'Lato',sans-serif; font-weight:700;
          font-size:.95rem; padding:1rem; border:none;
          cursor:pointer; letter-spacing:.05em;
          display:flex; align-items:center; justify-content:center; gap:.6rem;">
          <span style="font-size:1.2rem;">📲</span> Instalar app gratis
        </button>
        <p style="color:#9494a4; font-size:.75rem; text-align:center;
                  margin:.6rem 0 0;">
          Sin App Store · Sin Play Store · Gratis
        </p>
      </div>

      <!-- Safari iOS: instrucciones -->
      <div id="pwa-ios" style="display:none;">
        <p style="color:#c9a84c; font-weight:700; font-size:.85rem;
                  margin:0 0 .8rem;">Instalar en iPhone / iPad:</p>
        <div style="display:flex; flex-direction:column; gap:.6rem;">
          <div style="display:flex; align-items:center; gap:.8rem;
                      background:rgba(201,168,76,.08); padding:.7rem 1rem;">
            <span style="font-size:1.5rem; min-width:2rem;">1️⃣</span>
            <span style="color:#f0eee8; font-size:.85rem;">
              Toca el botón <strong style="color:#c9a84c;">Compartir</strong>
              <span style="font-size:1rem;"> ⬆️</span> en la barra de Safari
            </span>
          </div>
          <div style="display:flex; align-items:center; gap:.8rem;
                      background:rgba(201,168,76,.08); padding:.7rem 1rem;">
            <span style="font-size:1.5rem; min-width:2rem;">2️⃣</span>
            <span style="color:#f0eee8; font-size:.85rem;">
              Desplázate y toca
              <strong style="color:#c9a84c;">"Agregar a pantalla de inicio"</strong>
            </span>
          </div>
          <div style="display:flex; align-items:center; gap:.8rem;
                      background:rgba(201,168,76,.08); padding:.7rem 1rem;">
            <span style="font-size:1.5rem; min-width:2rem;">3️⃣</span>
            <span style="color:#f0eee8; font-size:.85rem;">
              Toca <strong style="color:#c9a84c;">"Agregar"</strong>
              en la esquina superior derecha
            </span>
          </div>
        </div>
      </div>

      <!-- Safari macOS -->
      <div id="pwa-mac" style="display:none;">
        <p style="color:#c9a84c; font-weight:700; font-size:.85rem;
                  margin:0 0 .8rem;">Instalar en Mac (Safari):</p>
        <div style="display:flex; flex-direction:column; gap:.6rem;">
          <div style="display:flex; align-items:center; gap:.8rem;
                      background:rgba(201,168,76,.08); padding:.7rem 1rem;">
            <span style="font-size:1.5rem; min-width:2rem;">1️⃣</span>
            <span style="color:#f0eee8; font-size:.85rem;">
              En el menú <strong style="color:#c9a84c;">Archivo</strong>
              de Safari
            </span>
          </div>
          <div style="display:flex; align-items:center; gap:.8rem;
                      background:rgba(201,168,76,.08); padding:.7rem 1rem;">
            <span style="font-size:1.5rem; min-width:2rem;">2️⃣</span>
            <span style="color:#f0eee8; font-size:.85rem;">
              Selecciona
              <strong style="color:#c9a84c;">"Añadir al Dock"</strong>
            </span>
          </div>
        </div>
      </div>

      <button onclick="cerrarPWA()" style="
        width:100%; margin-top:.8rem; background:transparent;
        color:#9494a4; font-family:'Lato',sans-serif;
        font-size:.82rem; padding:.6rem;
        border:1px solid rgba(148,148,164,.3); cursor:pointer;">
        Ahora no
      </button>
    </div>
  </div>
</div>

<!-- Botón fijo en esquina para abrir el modal manualmente -->
<button id="pwa-fab" onclick="mostrarModal()" style="
  display:none; position:fixed; bottom:1.5rem; right:1.5rem;
  z-index:9000; background:#c9a84c; color:#0a0a0f;
  font-family:'Lato',sans-serif; font-weight:700;
  font-size:.78rem; padding:.6rem 1rem;
  border:none; cursor:pointer; letter-spacing:.05em;
  box-shadow:0 4px 20px rgba(201,168,76,.4);">
  📲 Instalar app
</button>
`);

// ── 4. LÓGICA ──
let deferredPrompt = null;

// Mostrar sección correcta según plataforma
function configurarPlataforma() {
  document.getElementById('pwa-chrome').style.display = 'none';
  document.getElementById('pwa-ios').style.display    = 'none';
  document.getElementById('pwa-mac').style.display    = 'none';

  if (isIOS) {
    document.getElementById('pwa-ios').style.display = 'block';
  } else if (isMac) {
    document.getElementById('pwa-mac').style.display = 'block';
  } else {
    document.getElementById('pwa-chrome').style.display = 'block';
  }
}

function mostrarModal() {
  if (yaInstalada()) return;
  configurarPlataforma();
  const overlay = document.getElementById('pwa-overlay');
  overlay.style.display = 'flex';
  document.body.style.overflow = 'hidden';
}

window.cerrarPWA = function() {
  document.getElementById('pwa-overlay').style.display = 'none';
  document.body.style.overflow = '';
  sessionStorage.setItem('pwa-cerrado', '1');
  // Mostrar FAB para que puedan instalarlo después
  document.getElementById('pwa-fab').style.display = 'block';
};

window.instalarPWA = async function() {
  if (!deferredPrompt) return;
  deferredPrompt.prompt();
  const { outcome } = await deferredPrompt.userChoice;
  deferredPrompt = null;
  cerrarPWA();
  document.getElementById('pwa-fab').style.display = 'none';
};

// Chrome / Edge: capturar evento
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  // Mostrar FAB siempre en Chrome/Edge
  document.getElementById('pwa-fab').style.display = 'block';
  // Modal automático si no lo cerró antes
  if (!sessionStorage.getItem('pwa-cerrado')) {
    setTimeout(mostrarModal, 2500);
  }
});

window.addEventListener('appinstalled', () => {
  deferredPrompt = null;
  document.getElementById('pwa-fab').style.display = 'none';
  document.getElementById('pwa-overlay').style.display = 'none';
});

// iOS / Safari: mostrar modal automático
if ((isIOS || isMac) && !sessionStorage.getItem('pwa-cerrado')) {
  setTimeout(mostrarModal, 2500);
}

// Cerrar al hacer clic fuera del modal
document.getElementById('pwa-overlay').addEventListener('click', function(e) {
  if (e.target === this) cerrarPWA();
});

} // fin if(!yaInstalada)
