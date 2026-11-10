// PWA — CE19

// 1. SERVICE WORKER
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js').catch(() => {});
  });
}

function yaInstalada() {
  return window.matchMedia('(display-mode: standalone)').matches ||
         navigator.standalone === true;
}

if (yaInstalada()) return;

const isIOS    = /iphone|ipad|ipod/i.test(navigator.userAgent) && !window.MSStream;
const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
const isMac    = /macintosh/i.test(navigator.userAgent) && isSafari;

// 2. MODAL
document.body.insertAdjacentHTML('beforeend', `
<div id="pwa-overlay" style="display:none;position:fixed;inset:0;z-index:9999;
  background:rgba(42,15,0,.85);backdrop-filter:blur(8px);
  align-items:flex-end;justify-content:center;padding:1rem;
  font-family:'Lato',sans-serif;">
  <div style="background:#4e2300;width:100%;max-width:460px;
    border-top:3px solid #e85d04;position:relative;border-radius:0 0 6px 6px;overflow:hidden;">

    <div style="background:linear-gradient(135deg,#7a2800 0%,#4e2300 60%);
      padding:1.5rem 1.5rem 1rem;border-bottom:1px solid rgba(232,93,4,.2);">
      <button onclick="cerrarPWA()" style="position:absolute;top:.8rem;right:1rem;
        background:none;border:none;color:#d4a882;font-size:1.4rem;cursor:pointer;">✕</button>
      <div style="display:flex;align-items:center;gap:1rem;">
        <img src="./assets/icons/icon-192.png" style="width:60px;height:60px;
          border-radius:14px;border:2px solid rgba(232,93,4,.5);" alt="CE19">
        <div>
          <div style="font-family:'Cinzel',serif;color:#f48c06;font-size:1.05rem;font-weight:700;">
            Código Escondido 19</div>
          <div style="color:#d4a882;font-size:.78rem;margin-top:.2rem;">Instala la app gratis</div>
        </div>
      </div>
      <p style="color:#fff8f0;font-size:.88rem;line-height:1.6;margin:.9rem 0 0;">
        Accede a las enseñanzas, herramientas y el calendario sumerio
        directamente desde tu pantalla de inicio.</p>
    </div>

    <div style="padding:1.2rem 1.5rem 1.5rem;">
      <div id="pwa-chrome">
        <button onclick="instalarPWA()" style="width:100%;background:#e85d04;color:#fff8f0;
          font-family:'Lato',sans-serif;font-weight:700;font-size:.95rem;padding:1rem;
          border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:.6rem;">
          📲 Instalar app gratis
        </button>
        <p style="color:#d4a882;font-size:.75rem;text-align:center;margin:.6rem 0 0;">
          Sin App Store · Sin Play Store · Gratis</p>
      </div>
      <div id="pwa-ios" style="display:none;">
        <p style="color:#f48c06;font-weight:700;font-size:.85rem;margin:0 0 .8rem;">
          Instalar en iPhone / iPad:</p>
        <div style="display:flex;flex-direction:column;gap:.6rem;">
          <div style="display:flex;align-items:center;gap:.8rem;
            background:rgba(232,93,4,.1);padding:.7rem 1rem;">
            <span style="font-size:1.4rem;min-width:2rem;">1️⃣</span>
            <span style="color:#fff8f0;font-size:.85rem;">Toca el botón
              <strong style="color:#f48c06;">Compartir ⬆️</strong> en Safari</span>
          </div>
          <div style="display:flex;align-items:center;gap:.8rem;
            background:rgba(232,93,4,.1);padding:.7rem 1rem;">
            <span style="font-size:1.4rem;min-width:2rem;">2️⃣</span>
            <span style="color:#fff8f0;font-size:.85rem;">Toca
              <strong style="color:#f48c06;">"Agregar a pantalla de inicio"</strong></span>
          </div>
          <div style="display:flex;align-items:center;gap:.8rem;
            background:rgba(232,93,4,.1);padding:.7rem 1rem;">
            <span style="font-size:1.4rem;min-width:2rem;">3️⃣</span>
            <span style="color:#fff8f0;font-size:.85rem;">Toca
              <strong style="color:#f48c06;">"Agregar"</strong></span>
          </div>
        </div>
      </div>
      <button onclick="cerrarPWA()" style="width:100%;margin-top:.8rem;background:transparent;
        color:#d4a882;font-family:'Lato',sans-serif;font-size:.82rem;padding:.6rem;
        border:1px solid rgba(212,168,130,.3);cursor:pointer;">
        Ahora no
      </button>
    </div>
  </div>
</div>

<button id="pwa-fab" onclick="mostrarModal()" style="display:none;position:fixed;
  bottom:1.5rem;right:1.5rem;z-index:9000;background:#e85d04;color:#fff8f0;
  font-family:'Lato',sans-serif;font-weight:700;font-size:.78rem;
  padding:.7rem 1.2rem;border:none;cursor:pointer;
  box-shadow:0 4px 20px rgba(232,93,4,.5);">
  📲 Instalar app
</button>
`);

let deferredPrompt = null;

function configurarPlataforma() {
  document.getElementById('pwa-chrome').style.display = isIOS ? 'none' : 'block';
  document.getElementById('pwa-ios').style.display    = isIOS ? 'block' : 'none';
}

function mostrarModal() {
  if (yaInstalada()) return;
  configurarPlataforma();
  document.getElementById('pwa-overlay').style.display = 'flex';
  document.body.style.overflow = 'hidden';
}

window.cerrarPWA = function() {
  document.getElementById('pwa-overlay').style.display = 'none';
  document.body.style.overflow = '';
  sessionStorage.setItem('pwa-cerrado', '1');
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

window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  document.getElementById('pwa-fab').style.display = 'block';
  if (!sessionStorage.getItem('pwa-cerrado')) {
    setTimeout(mostrarModal, 2000);
  }
});

window.addEventListener('appinstalled', () => {
  deferredPrompt = null;
  document.getElementById('pwa-fab').style.display = 'none';
  document.getElementById('pwa-overlay').style.display = 'none';
});

if (isIOS && !sessionStorage.getItem('pwa-cerrado')) {
  setTimeout(mostrarModal, 2000);
}

document.getElementById('pwa-overlay').addEventListener('click', function(e) {
  if (e.target === this) cerrarPWA();
});
