import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig(({ command }) => {
  const isBuild = command === 'build';
  const base = isBuild ? '/plex-media-catalog/' : '/';

  return {
    base,
    plugins: [
      react(),
      {
        name: 'serve-data-and-posters-directory',
        configureServer(server) {
          server.middlewares.use((req: any, res: any, next: any) => {
            if (req.url && req.url.includes('/data/')) {
              const urlParts = req.url.split('/data/');
              const relativePath = 'data/' + decodeURIComponent(urlParts[1].split('?')[0]);
              const filePath = path.resolve(__dirname, relativePath);
              if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
                if (filePath.endsWith('.json')) {
                  res.setHeader('Content-Type', 'application/json; charset=utf-8');
                } else if (filePath.endsWith('.csv')) {
                  res.setHeader('Content-Type', 'text/csv; charset=utf-8');
                }
                res.setHeader('Access-Control-Allow-Origin', '*');
                fs.createReadStream(filePath).pipe(res);
                return;
              }
            }

            if (req.url && req.url.includes('/posters/')) {
              const urlParts = req.url.split('/posters/');
              const relativePath = 'public/posters/' + decodeURIComponent(urlParts[1].split('?')[0]);
              const filePath = path.resolve(__dirname, relativePath);
              if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
                res.setHeader('Content-Type', 'image/webp');
                res.setHeader('Cache-Control', 'public, max-age=3600');
                res.setHeader('Access-Control-Allow-Origin', '*');
                fs.createReadStream(filePath).pipe(res);
                return;
              }
            }

            next();
          });
        },
        closeBundle() {
          const srcData = path.resolve(__dirname, 'data');
          const distData = path.resolve(__dirname, 'dist', 'data');
          if (fs.existsSync(srcData)) {
            if (!fs.existsSync(distData)) {
              fs.mkdirSync(distData, { recursive: true });
            }
            const files = fs.readdirSync(srcData);
            for (const file of files) {
              if (file.endsWith('.csv')) continue;
              const srcFile = path.resolve(srcData, file);
              const distFile = path.resolve(distData, file);
              if (fs.statSync(srcFile).isFile()) {
                fs.copyFileSync(srcFile, distFile);
              }
            }
            console.log('✓ Successfully copied catalog data file to dist/data for deployment');
          }
        }
      }
    ],
    server: {
      port: 5173,
      host: true,
      open: false,
      watch: {
        ignored: ['**/public/posters/**', '**/data/**']
      }
    }
  };
});
