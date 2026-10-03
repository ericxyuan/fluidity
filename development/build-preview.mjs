import { build } from 'esbuild';
import { mkdir, writeFile } from 'node:fs/promises';
await mkdir('.validation/preview', { recursive: true });
await build({ entryPoints: ['development/preview.tsx'], bundle: true,
  outdir: '.validation/preview', format: 'esm', sourcemap: true, jsx: 'automatic' });
await writeFile('.validation/preview/index.html', `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Fluidity component validation</title><link rel="stylesheet" href="/preview.css"></head>
<body><div id="root"></div><script type="module" src="/preview.js"></script></body></html>`);
