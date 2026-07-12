// Build a single self-contained index.html from the multi-file site.
// Inlines the vendored libs (latin1 — they carry non-UTF8 codepage bytes) and
// the Cyrillic scripts (utf8). Output is a complete HTML document.
// Usage: node site/build.js [output-path]   (default: site/standalone.html)
const fs = require('fs');
const path = require('path');

const SITE = __dirname;
const src = fs.readFileSync(path.join(SITE, 'index.html'), 'utf8');
const style = (src.match(/<style>[\s\S]*?<\/style>/) || [''])[0];
let body = (src.match(/<body>([\s\S]*?)<\/body>/) || ['', ''])[1];

const LIBS = new Set([
  'lib/xlsx.full.min.js', 'lib/pdf-lib.min.js',
  'lib/fontkit.umd.min.js', 'lib/jszip.min.js',
]);
body = body.replace(/<script src="([^"]+)"><\/script>/g, (m, s) => {
  const enc = LIBS.has(s) ? 'latin1' : 'utf8';
  const code = fs.readFileSync(path.join(SITE, s), enc).replace(/<\/script>/gi, '<\\/script>');
  return '<script>\n' + code + '\n<\/script>';
});

const out =
  '<!doctype html>\n<html lang="ru">\n<head>\n' +
  '<meta charset="utf-8">\n' +
  '<meta name="viewport" content="width=device-width, initial-scale=1.0">\n' +
  '<title>Etihad — Генератор ваучеров</title>\n' +
  style + '\n</head>\n<body>\n' +
  body + '\n</body>\n</html>\n';

const dest = process.argv[2] || path.join(SITE, 'standalone.html');
fs.mkdirSync(path.dirname(dest), { recursive: true });
fs.writeFileSync(dest, out);
console.log('built', dest, Buffer.byteLength(out), 'bytes');
