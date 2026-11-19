#!/usr/bin/env node
/* Renderiza sakamoto-s2.html a slide-01.png … slide-05.png (1080x1350, PNG sin pérdida).

   node render.cjs

   Fuentes: el HTML pide Bebas Neue, Inter y Noto Sans JP a Google Fonts. Para que el
   render no dependa de internet, este script responde esa petición con los archivos de
   @fontsource instalados en el entorno (no se suben al repo):
     npm install --no-save @fontsource/bebas-neue @fontsource/inter @fontsource/noto-sans-jp
   o define FONTSOURCE_DIR=/ruta/a/node_modules/@fontsource. Si no las encuentra, usa
   Google Fonts en línea. */
const fs = require('fs'), path = require('path'), { execFileSync } = require('child_process');
let chromium;
try { ({ chromium } = require('playwright')); }
catch { ({ chromium } = require(path.join(execFileSync('npm', ['root', '-g']).toString().trim(), 'playwright'))); }

const D = __dirname;
const candidates = [process.env.FONTSOURCE_DIR, path.join(D, 'node_modules/@fontsource'),
  path.join(process.cwd(), 'node_modules/@fontsource')].filter(Boolean);
const FS = candidates.find(d => ['bebas-neue', 'inter', 'noto-sans-jp'].every(p => fs.existsSync(path.join(d, p))));

function localCss() {
  const pick = [['bebas-neue', [400]], ['inter', [400, 500, 600, 700, 800, 900]], ['noto-sans-jp', [500, 700, 900]]];
  let css = '';
  for (const [pkg, weights] of pick)
    for (const w of weights)
      css += fs.readFileSync(path.join(FS, pkg, `${w}.css`), 'utf8')
        .replace(/url\(\.\/files\/([^)]+)\)/g, (_, f) => `url(file://${path.join(FS, pkg, 'files', f)})`)
        .replace(/font-display:\s*swap/g, 'font-display: block');
  return css;
}

(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1080, height: 1350 }, deviceScaleFactor: 1 });
  if (FS) {
    const css = localCss();
    await p.route('https://fonts.googleapis.com/**', r => r.fulfill({ contentType: 'text/css', body: css }));
    console.log('fuentes locales:', FS);
  } else console.log('AVISO: sin @fontsource local, uso Google Fonts en línea');

  await p.goto('file://' + path.join(D, 'sakamoto-s2.html') + '?raw', { waitUntil: 'networkidle' });
  // carga explícita de cada fuente con los caracteres que se usan
  const jp = '「交錯する因縁争奪戦、開幕」パパはいまだにJuvenile鈴木祐斗集英社製作委員会©因';
  const ok = await p.evaluate(async jp => {
    const specs = [['400 100px "Bebas Neue"', 'ABC¡!¿?'], ['700 40px Inter', 'Aá'], ['900 40px "Noto Sans JP"', jp], ['500 40px "Noto Sans JP"', jp]];
    for (const [f, t] of specs) await document.fonts.load(f, t);
    await document.fonts.ready;
    return specs.map(([f, t]) => `${f}: ${document.fonts.check(f, t)}`);
  }, jp);
  console.log(ok.join('\n'));
  await p.waitForFunction(() => [...document.images].every(i => i.complete && i.naturalWidth > 0));

  // avisos: texto a menos de 60 px del borde
  const warn = await p.evaluate(() => [...document.querySelectorAll('.slide')].flatMap((s, i) => {
    const o = s.getBoundingClientRect(), out = [];
    s.querySelectorAll('h1,h2,p,.tag,.pill,.credit,.swipe,.day,.mon,.lbl,.panel,.ask').forEach(e => {
      const r = e.getBoundingClientRect();
      const m = Math.min(r.left - o.left, r.top - o.top, o.right - r.right, o.bottom - r.bottom);
      if (m < 58) out.push(`slide ${i + 1}: "${e.textContent.trim().slice(0, 30)}" a ${Math.round(m)}px del borde`);
      if (e.scrollWidth > e.clientWidth + 2) out.push(`slide ${i + 1}: "${e.textContent.trim().slice(0, 30)}" se sale a lo ancho`);
    });
    return out;
  }));
  console.log(warn.length ? warn.join('\n') : 'márgenes OK');

  const slides = await p.$$('.slide');
  for (let i = 0; i < slides.length; i++)
    await slides[i].screenshot({ path: path.join(D, `slide-${String(i + 1).padStart(2, '0')}.png`), type: 'png' });
  await b.close();
})();
