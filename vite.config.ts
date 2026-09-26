import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import fs from 'fs';

export default defineConfig({
  base: './',
  plugins: [
    react(),
    {
      name: 'serve-data-directory',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          if (req.url && (req.url.startsWith('/data/') || req.url.startsWith('./data/'))) {
            const cleanUrl = req.url.replace(/^\.?\//, '');
            const filePath = path.resolve(__dirname, cleanUrl);
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
            const srcFile = path.resolve(srcData, file);
            const distFile = path.resolve(distData, file);
            if (fs.statSync(srcFile).isFile()) {
              fs.copyFileSync(srcFile, distFile);
            }
          }
          console.log('✓ Successfully copied data files to dist/data for deployment');
        }
      }
    }
  ],
  server: {
    port: 5173,
    host: true,
    open: false
  }
});
