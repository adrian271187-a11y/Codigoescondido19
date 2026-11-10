import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { getFirestore, collection, query, where, orderBy, getDocs } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { firebaseConfig } from "./firebase.js";

const app  = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db   = getFirestore(app);

onAuthStateChanged(auth, async (user) => {
  if (!user) { window.location.href = 'login.html'; return; }

  document.getElementById('perfil-nombre').textContent = user.displayName || 'Miembro';
  document.getElementById('perfil-email').textContent  = user.email;

  const meta = user.metadata;
  if (meta?.creationTime) {
    const fecha = new Date(meta.creationTime).toLocaleDateString('es-ES', { day:'numeric', month:'long', year:'numeric' });
    document.getElementById('perfil-fecha').textContent = `Miembro desde ${fecha}`;
  }

  // Cargar posts exclusivos para miembros
  const grid = document.getElementById('miembros-posts');
  try {
    const q = query(
      collection(db, 'posts'),
      where('visibilidad', '==', 'miembros'),
      orderBy('fecha', 'desc')
    );
    const snap = await getDocs(q);
    if (snap.empty) {
      grid.innerHTML = '<p style="color:var(--gris);font-size:.88rem">Próximamente contenido exclusivo para miembros.</p>';
      return;
    }
    grid.innerHTML = '';
    snap.forEach(d => {
      const p = d.data();
      const fecha = p.fecha?.toDate ? p.fecha.toDate().toLocaleDateString('es-ES', {day:'numeric',month:'long',year:'numeric'}) : '';
      let videoHtml = '';
      if (p.youtube) {
        const m = p.youtube.match(/(?:v=|youtu\.be\/|embed\/)([a-zA-Z0-9_-]{11})/);
        if (m) videoHtml = `<div class="post-video"><iframe src="https://www.youtube.com/embed/${m[1]}" allowfullscreen loading="lazy"></iframe></div>`;
      } else if (p.tiktok) {
        const m = p.tiktok.match(/video\/(\d+)/);
        if (m) videoHtml = `<div class="post-video"><iframe src="https://www.tiktok.com/embed/${m[1]}" allowfullscreen loading="lazy"></iframe></div>`;
      }
      const card = document.createElement('div');
      card.className = 'post-card';
      card.innerHTML = `${videoHtml}<div class="post-body">
        <span class="post-badge badge-miembros">✦ Miembros</span>
        <div class="post-title">${escHTML(p.titulo)}</div>
        <p class="post-text">${escHTML(p.texto||'')}</p>
        <p class="post-fecha">${fecha}</p>
      </div>`;
      grid.appendChild(card);
    });
  } catch(err) {
    grid.innerHTML = '<p style="color:var(--rojo)">Error cargando contenido.</p>';
  }
});

document.getElementById('btn-logout')?.addEventListener('click', async (e) => {
  e.preventDefault();
  await signOut(auth);
  window.location.href = 'index.html';
});

function escHTML(str) {
  return String(str||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}
