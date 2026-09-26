import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { existsSync } from 'node:fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

const PORT = Number(process.env.PORT || 8080);

const API_TARGET =
  process.env.API_TARGET || 'http://localhost:3000';

app.get('/frontend-health', (_req, res) => {
  res.status(200).json({
    success: true,
    service: 'employee-frontend',
    apiTargetConfigured: Boolean(process.env.API_TARGET)
  });
});

app.use(
  createProxyMiddleware({
    pathFilter: '/api',
    target: API_TARGET,
    changeOrigin: true,
    xfwd: true
  })
);

const possibleBrowserDirs = [
  path.join(__dirname, 'dist', 'frontend', 'browser'),
  path.join(__dirname, 'dist', 'frontend')
];

const browserDir =
  possibleBrowserDirs.find((directory) =>
    existsSync(path.join(directory, 'index.html'))
  );

if (!browserDir) {
  throw new Error(
    'No se encontró el build de Angular. Ejecute npm run build antes de iniciar producción.'
  );
}

app.use(express.static(browserDir));

app.use((req, res, next) => {
  if (req.method !== 'GET') {
    return next();
  }

  res.sendFile(
    path.join(browserDir, 'index.html')
  );
});

app.listen(PORT, () => {
  console.log(
    `Frontend disponible en puerto ${PORT}`
  );

  console.log(
    `Proxy API configurado hacia ${API_TARGET}`
  );
});