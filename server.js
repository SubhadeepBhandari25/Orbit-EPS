import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

// Serve static files from public directory
app.use(express.static(path.join(__dirname, 'public')));

// Serve node_modules for Three.js
app.use('/three', express.static(path.join(__dirname, 'node_modules/three/build')));
app.use('/three-src', express.static(path.join(__dirname, 'node_modules/three')));

// Root route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`
╔══════════════════════════════════════════════════════════╗
║   ORBIT-EPS: JWST 3D Electrical Power System Simulator   ║
║                                                          ║
║   Server running at: http://localhost:${PORT}         ║
║                                                          ║
║   Press Ctrl+C to stop the server                       ║
╚══════════════════════════════════════════════════════════╝
  `);
});
