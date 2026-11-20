# Código Escondido 19

## Publicar en GitHub Pages (gratis)

1. Sube todos estos archivos a tu repositorio GitHub
2. Ve a **Settings → Pages**
3. En **Source** selecciona: `Deploy from a branch`
4. Branch: `main` / Folder: `/ (root)`
5. Clic en **Save**
6. En 1-2 minutos tu sitio estará en:
   `https://TU_USUARIO.github.io/codigoescondido19/`

## Pasos Firebase (si no lo hiciste)

- Authentication → Sign-in method → activar **Email/Password**
- Firestore → crear base de datos en modo producción
- Agregar estas reglas en Firestore:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /posts/{postId} {
      allow read: if resource.data.visibilidad == 'publico' || request.auth != null;
      allow write: if request.auth.uid == 'jk8IPGVWWUgjSYM4IUzhN3BxaC43';
    }
    match /usuarios/{uid} {
      allow read: if request.auth.uid == uid || request.auth.uid == 'jk8IPGVWWUgjSYM4IUzhN3BxaC43';
      allow write: if request.auth.uid == uid;
    }
  }
}
```

## También agregar el dominio en Firebase

Firebase Console → Authentication → Settings → **Authorized domains**
→ Agregar: `TU_USUARIO.github.io`
