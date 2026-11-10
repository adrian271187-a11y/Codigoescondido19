# Código Escondido 19 — Sitio Web

## Estructura
```
ce19/
├── index.html          ← Página principal pública
├── login.html          ← Registro / Inicio de sesión
├── admin.html          ← Panel de administrador (solo Adrian)
├── perfil.html         ← Perfil del miembro
├── server.js           ← Servidor Express para Railway
├── package.json
└── src/
    ├── firebase.js     ← Configuración Firebase
    ├── style.css       ← Estilos globales
    ├── app.js          ← Lógica principal + posts públicos
    ├── auth.js         ← Login / Registro / Reset
    ├── admin.js        ← Panel admin
    ├── perfil.js       ← Perfil de miembro
    └── tools.js        ← Traductor + Calendario Babilónico
```

## Pasos para publicar

### 1. Firebase — Habilitar servicios
En Firebase Console (codigoescondido19):
- **Authentication** → Sign-in method → Activar **Email/Password**
- **Firestore Database** → Crear base de datos en modo producción
- Ir a **Reglas de Firestore** y pegar esto:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Posts: todos pueden leer públicos, solo admin escribe
    match /posts/{postId} {
      allow read: if resource.data.visibilidad == 'publico' || request.auth != null;
      allow write: if request.auth.uid == 'jk8IPGVWWUgjSYM4IUzhN3BxaC43';
    }
    // Usuarios: solo el propio usuario o admin
    match /usuarios/{uid} {
      allow read: if request.auth.uid == uid || request.auth.uid == 'jk8IPGVWWUgjSYM4IUzhN3BxaC43';
      allow write: if request.auth.uid == uid;
    }
  }
}
```

### 2. GitHub — Subir el código
```bash
git init
git add .
git commit -m "Código Escondido 19 - v1.0"
git remote add origin https://github.com/TU_USUARIO/codigoescondido19.git
git push -u origin main
```

### 3. Railway — Publicar
1. Entra a https://railway.app
2. **New Project** → **Deploy from GitHub repo**
3. Selecciona el repositorio `codigoescondido19`
4. Railway detecta automáticamente el `package.json` y corre `npm start`
5. Ve a **Settings → Domains** y genera tu URL pública

## Funcionalidades
- ✦ Página principal con videos YouTube/TikTok embebidos
- ✦ Registro y login de usuarios (Firebase Auth)
- ✦ Contenido público y contenido exclusivo para miembros
- ✦ Panel de administrador protegido (solo tú)
- ✦ Traductor letra → número (alfabeto español codificado)
- ✦ Calculadora del calendario babilónico (360 días/año)
