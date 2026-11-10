const express = require('express');
const path    = require('path');
const app     = express();

// Servir archivos estáticos desde la raíz del proyecto
app.use(express.static(path.join(__dirname)));

// Todas las rutas sirven archivos HTML directamente
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'index.html')));
app.get('/login', (req, res) => res.sendFile(path.join(__dirname, 'login.html')));
app.get('/admin', (req, res) => res.sendFile(path.join(__dirname, 'admin.html')));
app.get('/perfil', (req, res) => res.sendFile(path.join(__dirname, 'perfil.html')));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`CE19 corriendo en puerto ${PORT}`));
