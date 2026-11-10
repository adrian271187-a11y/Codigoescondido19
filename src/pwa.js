// ══════════════════════════════════════════
//  PWA — Registro del Service Worker
//        + Modal de instalación
// ══════════════════════════════════════════

// ── 1. REGISTRAR SERVICE WORKER ──
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(reg => console.log('SW registrado:', reg.scope))
      .catch(err => console.log('SW error:', err));
  });
}

// ── 2. MODAL DE INSTALACIÓN ──
// Inyectar el HTML del modal
const modalHTML = `
<div id="pwa-modal" style="display:none;position:fixed;inset:0;z-index:9999;
     background:rgba(0,0,0,.7);backdrop-filter:blur(6px);
     align-items:flex-end;justify-content:center;padding:1rem;">
  <div style="background:#1a1a2e;width:100%;max-width:480px;padding:2rem;
              border-top:2px solid #c9a84c;position:relative;">
    <button onclick="cerrarPWA()" style="position:absolute;top:1rem;right:1rem;
            background:none;border:none;color:#9494a4;font-size:1.3rem;cursor:pointer;">✕</button>

    <div style="display:flex;align-items:center;gap:1rem;margin-bottom:1.2rem;">
      <img src="assets/icons/icon-192.png" alt="CE19"
           style="width:56px;height:56px;border-radius:12px;">
      <div>
        <div style="font-family:'Cinzel',serif;color:#c9a84c;font-size:1rem;font-weight:700;">
          Código Escondido 19
        </div>
        <div style="color:#9494a4;font-size:.78rem;margin-top:.2rem;">
          Instala la app en tu celular
        </div>
      </div>
    </div>

    <p style="color:#f0eee8;font-size:.88rem;line-height:1.6;margin-bottom:1.4rem;">
      Accede a las enseñanzas, herramientas y contenido exclusivo directamente
      desde tu pantalla de inicio — sin necesidad de abrir el navegador.
    </p>

    <div style="display:flex;gap:.75rem;flex-wrap:wrap;">
      <button id="pwa-instalar" onclick="instalarPWA()"
              style="flex:1;background:#c9a84c;color:#0a0a0f;font-family:'Lato',sans-serif;
                     font-weight:700;font-size:.88rem;padding:.85rem 1.5rem;
                     border:none;cursor:pointer;min-width:140px;">
        📲 Instalar app
      </button>
      <button onclick="cerrarPWA()"
              style="flex:1;background:transparent;color:#9494a4;
                     font-family:'Lato',sans-serif;font-size:.85rem;
                     padding:.85rem 1.5rem;border:1px solid rgba(201,168,76,.3);
                     cursor:pointer;min-width:120px;">
        Ahora no
      </button>
    </div>

    <!-- Instrucciones iOS (Safari no soporta beforeinstallprompt) -->
    <div id="pwa-ios" style="display:none;margin-top:1.2rem;padding:1rem;
         background:rgba(201,168,76,.08);border-left:3px solid #c9a84c;">
      <p style="color:#c9a84c;font-size:.8rem;font-weight:700;margin-bottom:.5rem;">
        En iPhone / iPad:
      </p>
      <p style="color:#9494a4;font-size:.82rem;line-height:1.6;">
        1. Toca el botón <strong style="color:#f0eee8;">Compartir</strong> 
           (el cuadrado con flecha ↑ en Safari)<br>
        2. Selecciona <strong style="color:#f0eee8;">"Agregar a pantalla de inicio"</strong><br>
        3. Toca <strong style="color:#f0eee8;">"Agregar"</strong>
      </p>
    </div>

  </div>
</div>`;

document.body.insertAdjacentHTML('beforeend', modalHTML);

// ── 3. LÓGICA DE INSTALACIÓN ──
let deferredPrompt = null;

// Android / Chrome: capturar el evento de instalación
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;

  // Mostrar modal después de 3 segundos si no lo han cerrado antes
  const yaRechazo = sessionStorage.getItem('pwa-rechazo');
  if (!yaRechazo && !estaInstalada()) {
    setTimeout(mostrarModal, 3000);
  }
});

// Detectar si ya está instalada
window.addEventListener('appinstalled', () => {
  deferredPrompt = null;
  cerrarPWA();
  console.log('PWA instalada correctamente');
});

function estaInstalada() {
  return window.matchMedia('(display-mode: standalone)').matches ||
         window.navigator.standalone === true;
}

function esIOS() {
  return /iphone|ipad|ipod/i.test(navigator.userAgent) && !window.MSStream;
}

function mostrarModal() {
  if (estaInstalada()) return;
  const modal = document.getElementById('pwa-modal');
  modal.style.display = 'flex';

  // Si es iOS mostrar instrucciones manuales
  if (esIOS()) {
    document.getElementById('pwa-instalar').style.display = 'none';
    document.getElementById('pwa-ios').style.display = 'block';
  }
}

window.instalarPWA = async function() {
  if (!deferredPrompt) return;
  deferredPrompt.prompt();
  const { outcome } = await deferredPrompt.userChoice;
  deferredPrompt = null;
  cerrarPWA();
};

window.cerrarPWA = function() {
  document.getElementById('pwa-modal').style.display = 'none';
  sessionStorage.setItem('pwa-rechazo', '1');
};

// iOS: mostrar modal si no está instalada y es Safari
if (esIOS() && !estaInstalada()) {
  const yaRechazo = sessionStorage.getItem('pwa-rechazo');
  if (!yaRechazo) {
    setTimeout(mostrarModal, 3000);
  }
}
