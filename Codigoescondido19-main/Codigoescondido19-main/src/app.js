import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { getFirestore, collection, query, where, orderBy, getDocs } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { firebaseConfig, ADMIN_UID } from "./firebase.js";

const app  = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db   = getFirestore(app);

// ── AUTH STATE ──
onAuthStateChanged(auth, async (user) => {
  const navLogin   = document.getElementById('nav-login');
  const navLogout  = document.getElementById('nav-logout');
  const navPerfil  = document.getElementById('nav-perfil');
  const navAdmin   = document.getElementById('nav-admin');
  const ctaSub     = document.getElementById('cta-suscribir');

  if (user) {
    navLogin?.style && (navLogin.style.display  = 'none');
    navLogout?.style && (navLogout.style.display = 'list-item');
    navPerfil?.style && (navPerfil.style.display = 'list-item');
    if (ctaSub) ctaSub.style.display = 'none';

    const usuarioEl = document.getElementById('nav-usuario');
    if (usuarioEl) usuarioEl.textContent = user.displayName || 'Mi perfil';

    if (user.uid === ADMIN_UID && navAdmin) {
      navAdmin.style.display = 'list-item';
    }
  } else {
    navLogin?.style && (navLogin.style.display   = 'list-item');
    navLogout?.style && (navLogout.style.display  = 'none');
    navPerfil?.style && (navPerfil.style.display  = 'none');
    if (navAdmin) navAdmin.style.display = 'none';
  }

  await cargarPosts(user);
});

// ── LOGOUT ──
document.getElementById('btn-logout')?.addEventListener('click', async (e) => {
  e.preventDefault();
  await signOut(auth);
  window.location.reload();
});

// ── CARGAR POSTS ──
async function cargarPosts(user) {
  const grid = document.getElementById('posts-grid');
  if (!grid) return;

  try {
    // Publicaciones públicas
    const qPub = query(
      collection(db, 'posts'),
      where('visibilidad', '==', 'publico'),
      orderBy('fecha', 'desc')
    );
    const snapPub = await getDocs(qPub);
    const posts = [];
    snapPub.forEach(d => posts.push({ id: d.id, ...d.data() }));

    // Si está logueado, también las de miembros
    if (user) {
      const qMem = query(
        collection(db, 'posts'),
        where('visibilidad', '==', 'miembros'),
        orderBy('fecha', 'desc')
      );
      const snapMem = await getDocs(qMem);
      snapMem.forEach(d => posts.push({ id: d.id, ...d.data() }));
      posts.sort((a, b) => b.fecha?.seconds - a.fecha?.seconds);
    }

    if (posts.length === 0) {
      grid.innerHTML = '<p class="loading">Próximamente nuevo contenido. ¡Suscríbete para no perderte nada!</p>';
      return;
    }

    grid.innerHTML = posts.map(p => renderPost(p, user)).join('');

  } catch (err) {
    grid.innerHTML = '<p class="loading">Error cargando contenido.</p>';
    console.error(err);
  }
}

function renderPost(p, user) {
  const fecha = p.fecha?.toDate ? p.fecha.toDate().toLocaleDateString('es-ES', { day:'numeric', month:'long', year:'numeric' }) : '';
  const badge = p.visibilidad === 'miembros'
    ? '<span class="post-badge badge-miembros">✦ Miembros</span>'
    : '<span class="post-badge badge-publico">Público</span>';

  let videoHtml = '';
  if (p.youtube) {
    const vid = extraerYouTubeId(p.youtube);
    if (vid) videoHtml = `<div class="post-video"><iframe src="https://www.youtube.com/embed/${vid}" allowfullscreen loading="lazy"></iframe></div>`;
  } else if (p.tiktok) {
    const tid = extraerTikTokId(p.tiktok);
    if (tid) videoHtml = `<div class="post-video"><iframe src="https://www.tiktok.com/embed/${tid}" allowfullscreen loading="lazy"></iframe></div>`;
  }

  // Post de miembros no logueados: mostrar solo título y candado
  if (p.visibilidad === 'miembros' && !user) {
    return `<div class="post-card">
      <div class="post-body">
        ${badge}
        <div class="post-title">${escHTML(p.titulo)}</div>
        <p class="locked-msg">🔒 Contenido exclusivo — <a href="login.html" style="color:var(--dorado)">Regístrate gratis</a> para verlo.</p>
      </div>
    </div>`;
  }

  return `<div class="post-card">
    ${videoHtml}
    <div class="post-body">
      ${badge}
      <div class="post-title">${escHTML(p.titulo)}</div>
      <p class="post-text">${escHTML(p.texto || '')}</p>
      <p class="post-fecha">${fecha}</p>
    </div>
  </div>`;
}

function extraerYouTubeId(url) {
  const m = url.match(/(?:v=|youtu\.be\/|embed\/)([a-zA-Z0-9_-]{11})/);
  return m ? m[1] : null;
}
function extraerTikTokId(url) {
  const m = url.match(/video\/(\d+)/);
  return m ? m[1] : null;
}
function escHTML(str) {
  return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

// ── ESTRELLAS HERO con destellos ──
const canvas = document.getElementById('stars');
if (canvas) {
  const ctx = canvas.getContext('2d');
  function resizeC() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
  resizeC();
  window.addEventListener('resize', resizeC);

  // Estrellas normales
  const stars = Array.from({length: 180}, () => ({
    x: Math.random(), y: Math.random(),
    r: Math.random() * 1.3 + .2,
    a: Math.random() * Math.PI * 2,
    speed: Math.random() * .005 + .002
  }));

  // Estrellas con destello en cruz (sparkle)
  const sparkles = Array.from({length: 18}, () => ({
    x: Math.random(), y: Math.random(),
    r: Math.random() * 2.5 + 1.5,
    a: Math.random() * Math.PI * 2,
    speed: Math.random() * .008 + .003,
    rot: Math.random() * Math.PI
  }));

  function drawCross(x, y, size, alpha) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(Math.PI / 4);
    ctx.globalAlpha = alpha;
    // Cruz de 4 puntas
    for (let i = 0; i < 4; i++) {
      ctx.rotate(Math.PI / 2);
      ctx.beginPath();
      ctx.moveTo(0, 0);
      const grad = ctx.createLinearGradient(0, 0, 0, -size * 3);
      grad.addColorStop(0, 'rgba(255,240,180,1)');
      grad.addColorStop(1, 'rgba(255,240,180,0)');
      ctx.strokeStyle = grad;
      ctx.lineWidth = size * .6;
      ctx.lineCap = 'round';
      ctx.lineTo(0, -size * 3);
      ctx.stroke();
    }
    // Punto central brillante
    ctx.globalAlpha = alpha;
    ctx.beginPath();
    ctx.arc(0, 0, size * .8, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255,248,210,1)';
    ctx.fill();
    ctx.restore();
  }

  function drawStars() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Estrellas normales
    stars.forEach(s => {
      s.a += s.speed;
      const alpha = .1 + .5 * Math.abs(Math.sin(s.a));
      ctx.beginPath();
      ctx.arc(s.x * canvas.width, s.y * canvas.height, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(240,220,160,${alpha})`;
      ctx.fill();
    });

    // Sparkles con cruz
    sparkles.forEach(s => {
      s.a += s.speed;
      const alpha = Math.max(0, Math.sin(s.a));
      if (alpha > 0.05) {
        drawCross(s.x * canvas.width, s.y * canvas.height, s.r, alpha * .9);
      }
      // Reubicar cuando desaparece
      if (s.a > Math.PI * 2) {
        s.a = 0;
        s.x = Math.random();
        s.y = Math.random();
        s.r = Math.random() * 2.5 + 1.5;
      }
    });

    requestAnimationFrame(drawStars);
  }

  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) drawStars();
}
