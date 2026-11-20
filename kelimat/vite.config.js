import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { viteSingleFile } from 'vite-plugin-singlefile';

// `npm run build:share` (ARTIFACT=1) builds one self-contained HTML file for sharing as a link,
// without the service worker (the sharing host doesn't allow one).
const artifact = process.env.ARTIFACT === '1';

export default defineConfig({
  plugins: [react(), tailwindcss(), ...(artifact ? [viteSingleFile()] : [])],
  define: { __SHARE_BUILD__: JSON.stringify(artifact) },
  build: artifact ? { outDir: 'dist-share' } : {},
  server: { host: true },
  preview: { host: true },
});
