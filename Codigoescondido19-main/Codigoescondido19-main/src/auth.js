import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail, updateProfile, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { getFirestore, doc, setDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { firebaseConfig } from "./firebase.js";

const app  = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db   = getFirestore(app);

// Si ya está logueado, redirigir
onAuthStateChanged(auth, (user) => {
  if (user) window.location.href = 'index.html';
});

function showError(msg) {
  const el = document.getElementById('msg-error');
  el.textContent = msg; el.style.display = 'block';
  document.getElementById('msg-ok').style.display = 'none';
}
function showOk(msg) {
  const el = document.getElementById('msg-ok');
  el.textContent = msg; el.style.display = 'block';
  document.getElementById('msg-error').style.display = 'none';
}
function tradError(code) {
  const map = {
    'auth/email-already-in-use':    'Este correo ya está registrado.',
    'auth/weak-password':           'La contraseña debe tener al menos 6 caracteres.',
    'auth/invalid-email':           'El correo no es válido.',
    'auth/user-not-found':          'No existe una cuenta con ese correo.',
    'auth/wrong-password':          'Contraseña incorrecta.',
    'auth/too-many-requests':       'Demasiados intentos. Intenta más tarde.',
    'auth/invalid-credential':      'Correo o contraseña incorrectos.',
  };
  return map[code] || 'Ocurrió un error. Intenta de nuevo.';
}

// ── LOGIN ──
document.getElementById('form-login')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = document.getElementById('login-email').value.trim();
  const pass  = document.getElementById('login-pass').value;
  try {
    await signInWithEmailAndPassword(auth, email, pass);
    window.location.href = 'index.html';
  } catch (err) {
    showError(tradError(err.code));
  }
});

// ── REGISTRO ──
document.getElementById('form-register')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const nombre = document.getElementById('reg-name').value.trim();
  const email  = document.getElementById('reg-email').value.trim();
  const pass   = document.getElementById('reg-pass').value;
  try {
    const cred = await createUserWithEmailAndPassword(auth, email, pass);
    await updateProfile(cred.user, { displayName: nombre });
    // Guardar en Firestore
    await setDoc(doc(db, 'usuarios', cred.user.uid), {
      nombre, email,
      uid: cred.user.uid,
      fechaRegistro: serverTimestamp(),
      suscrito: true
    });
    window.location.href = 'index.html';
  } catch (err) {
    showError(tradError(err.code));
  }
});

// ── RESET ──
document.getElementById('form-reset')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = document.getElementById('reset-email').value.trim();
  try {
    await sendPasswordResetEmail(auth, email);
    showOk('Te enviamos un enlace a tu correo para restablecer tu contraseña.');
  } catch (err) {
    showError(tradError(err.code));
  }
});
