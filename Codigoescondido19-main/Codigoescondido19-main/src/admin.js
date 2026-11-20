import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { getFirestore, collection, addDoc, getDocs, deleteDoc, doc, orderBy, query, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { firebaseConfig, ADMIN_UID } from "./firebase.js";

const app  = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db   = getFirestore(app);

// ── PROTEGER RUTA ──
onAuthStateChanged(auth, (user) => {
  if (!user || user.uid !== ADMIN_UID) {
    window.location.href = 'index.html';
  }
});

// ── LOGOUT ──
document.getElementById('btn-logout')?.addEventListener('click', async (e) => {
  e.preventDefault();
  await signOut(auth);
  window.location.href = 'index.html';
});

// ── PUBLICAR ──
window.publicar = async function() {
  const titulo       = document.getElementById('pub-titulo').value.trim();
  const texto        = document.getElementById('pub-texto').value.trim();
  const youtube      = document.getElementById('pub-youtube').value.trim();
  const tiktok       = document.getElementById('pub-tiktok').value.trim();
  const visibilidad  = document.getElementById('pub-visibilidad').value;
  const msgEl        = document.getElementById('pub-msg');

  if (!titulo) { alert('El título es obligatorio.'); return; }

  try {
    await addDoc(collection(db, 'posts'), {
      titulo, texto, youtube, tiktok, visibilidad,
      fecha: serverTimestamp()
    });
    msgEl.textContent = '✦ Publicación creada exitosamente.';
    msgEl.style.display = 'block';
    document.getElementById('pub-titulo').value   = '';
    document.getElementById('pub-texto').value    = '';
    document.getElementById('pub-youtube').value  = '';
    document.getElementById('pub-tiktok').value   = '';
    setTimeout(() => msgEl.style.display = 'none', 3000);
  } catch (err) {
    alert('Error al publicar: ' + err.message);
  }
};

// ── CARGAR POSTS ADMIN ──
async function cargarPostsAdmin() {
  const listEl = document.getElementById('admin-posts-list');
  if (!listEl) return;
  try {
    const q = query(collection(db, 'posts'), orderBy('fecha', 'desc'));
    const snap = await getDocs(q);
    if (snap.empty) { listEl.innerHTML = '<p style="color:var(--gris)">Sin publicaciones aún.</p>'; return; }
    listEl.innerHTML = '';
    snap.forEach(d => {
      const p = d.data();
      const fecha = p.fecha?.toDate ? p.fecha.toDate().toLocaleDateString('es-ES') : '';
      const item = document.createElement('div');
      item.className = 'admin-item';
      item.innerHTML = `
        <div class="admin-item-info">
          <div class="admin-item-title">${escHTML(p.titulo)}</div>
          <div class="admin-item-meta">${p.visibilidad === 'miembros' ? '✦ Miembros' : 'Público'} · ${fecha}</div>
        </div>
        <div class="admin-item-actions">
          <button class="btn-danger" onclick="eliminarPost('${d.id}')">Eliminar</button>
        </div>`;
      listEl.appendChild(item);
    });
  } catch (err) {
    listEl.innerHTML = '<p style="color:var(--rojo)">Error cargando publicaciones.</p>';
  }
}

// ── ELIMINAR POST ──
window.eliminarPost = async function(id) {
  if (!confirm('¿Eliminar esta publicación?')) return;
  try {
    await deleteDoc(doc(db, 'posts', id));
    cargarPostsAdmin();
  } catch (err) {
    alert('Error al eliminar: ' + err.message);
  }
};

// ── CARGAR USUARIOS ──
async function cargarUsuarios() {
  const listEl = document.getElementById('admin-users-list');
  if (!listEl) return;
  try {
    const snap = await getDocs(collection(db, 'usuarios'));
    if (snap.empty) { listEl.innerHTML = '<p style="color:var(--gris)">Sin suscriptores aún.</p>'; return; }
    listEl.innerHTML = '';
    snap.forEach(d => {
      const u = d.data();
      const fecha = u.fechaRegistro?.toDate ? u.fechaRegistro.toDate().toLocaleDateString('es-ES') : '';
      const item = document.createElement('div');
      item.className = 'admin-item';
      item.innerHTML = `
        <div class="admin-item-info">
          <div class="admin-item-title">${escHTML(u.nombre || 'Sin nombre')}</div>
          <div class="admin-item-meta">${escHTML(u.email)} · Registrado: ${fecha}</div>
        </div>`;
      listEl.appendChild(item);
    });
  } catch (err) {
    listEl.innerHTML = '<p style="color:var(--rojo)">Error cargando usuarios.</p>';
  }
}

cargarPostsAdmin();
cargarUsuarios();

function escHTML(str) {
  return String(str||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}
