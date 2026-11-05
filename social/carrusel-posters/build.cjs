// Inline fonts/images into carrusel.html, then export each slide as a 1080x1350 PNG.
// Usage: node build.cjs   (needs Playwright + Chromium)
const fs = require('fs'), path = require('path');
const { chromium } = require('playwright');
const D = __dirname;
const MIME = { '.woff2': 'font/woff2', '.png': 'image/png', '.jpg': 'image/jpeg' };
const data = p => `data:${MIME[path.extname(p)]};base64,` + fs.readFileSync(path.join(D, p)).toString('base64');

const html = fs.readFileSync(path.join(D, 'carrusel.src.html'), 'utf8')
  .replace(/url\((fonts\/[^)]+)\)/g, (_, p) => `url(${data(p)})`)
  .replace(/src="((?:posters|logos)\/[^"]+)"/g, (_, p) => `data-img="${p}"`);
// embed each image once; a tiny loader assigns it to every <img> that uses it
const used = [...new Set([...html.matchAll(/data-img="([^"]+)"/g)].map(m => m[1]))];
const map = Object.fromEntries(used.map(p => [p, data(p)]));
const loader = `<script>(function(){var I=${JSON.stringify(map)};document.querySelectorAll('img[data-img]').forEach(function(e){e.src=I[e.getAttribute('data-img')]})})();</script>`;
fs.writeFileSync(path.join(D, 'carrusel.html'), html.replace('</body>', loader + '\n</body>'));
fs.mkdirSync(path.join(D, 'export'), { recursive: true });

(async () => {
  const b = await chromium.launch();
  const pg = await b.newPage({ viewport: { width: 1080, height: 1350 }, deviceScaleFactor: 1 });
  await pg.goto('file://' + path.join(D, 'carrusel.html') + '?raw');
  await pg.evaluate(() => document.fonts.ready);
  await pg.waitForFunction(() => [...document.images].every(i => i.complete && i.naturalWidth > 0));
  console.log('fonts:', await pg.evaluate(() => [...document.fonts].map(f => `${f.family} ${f.weight} ${f.status}`).join(', ')));
  const slides = await pg.$$('section.slide');
  for (let i = 0; i < slides.length; i++)
    await slides[i].screenshot({ path: path.join(D, 'export', `slide-${String(i + 1).padStart(2, '0')}.png`) });
  await b.close();
})();
