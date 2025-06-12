// crawler.js
//
// Menú interactivo para elegir:
//   1) URL base a scrapear
//   2) Formato de salida: html o json
//
// Si introduces la URL sin protocolo (p.ej. "www.ejemplo.com"),
// se antepone automáticamente "https://".
//
// Luego arranca un crawler recursivo y guarda en ./pages_html/
// o ./pages_json/ cada página en el formato elegido.

// ----------------------
//  Importar librerías
// ----------------------
const axios    = require('axios');
const cheerio  = require('cheerio');
const fs       = require('fs-extra');
const path     = require('path');
const urlMod   = require('url');
const readline = require('readline');

// ----------------------
//  Función de menú
// ----------------------
async function promptMenu() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  const question = q => new Promise(res => rl.question(q, ans => res(ans.trim())));

  console.log('\n=== CRAWLER INTERACTIVO ===\n');

  // 1) URL base
  let rawUrl = await question('1) Introduce la URL base (ej: https://www.ejemplo.com/): ');
  if (!/^https?:\/\//i.test(rawUrl)) {
    rawUrl = 'https://' + rawUrl;
  }
  if (!rawUrl.endsWith('/')) {
    rawUrl += '/';
  }

  // 2) Formato de salida
  let format;
  while (!['html','json'].includes(format)) {
    format = (await question('2) Elige formato de salida ("html" o "json"): ')).toLowerCase();
  }

  rl.close();
  return { targetUrl: rawUrl, format };
}

// ----------------------
//  Variables a inicializar
// ----------------------
let BASE_URL;         // p.ej. "https://www.olmedadelasfuentes.es/"
let BASE_DOMAIN;      // p.ej. "www.olmedadelasfuentes.es"
let OUTPUT_FORMAT;    // "html" o "json"
let OUTPUT_DIR;       // p.ej. "./pages_html" o "./pages_json"
const REQUEST_DELAY_MS = 500;

// Cola de URLs y conjunto de visitadas
const visited = new Set();
const toVisit = [];

// ----------------------
//  Auxiliares
// ----------------------
function normalizeAndCheckInternal(href, currentPage) {
  try {
    if (!href || href.startsWith('#')) return null;
    let absolute;
    if (/^https?:\/\//i.test(href)) {
      absolute = href;
    } else {
      absolute = urlMod.resolve(currentPage, href);
    }
    const parsed = new URL(absolute);
    if (parsed.hostname === BASE_DOMAIN) {
      parsed.hash   = '';
      parsed.search = '';
      return parsed.toString();
    }
  } catch (e) {
    // URL inválida → ignorar
  }
  return null;
}

function urlToFilename(pageUrl) {
  const parsed = new URL(pageUrl);
  let pathname = parsed.pathname || '/';
  if (pathname === '/') pathname = '/home';
  const safe = pathname
    .replace(/^\//, '')
    .replace(/\//g, '-')
    .replace(/[^a-zA-Z0-9\-_\.]/g, '');
  return safe || 'home';
}

function delay(ms) {
  return new Promise(res => setTimeout(res, ms));
}

// ----------------------
//  Función principal: crawl()
// ----------------------
async function crawl() {
  while (toVisit.length > 0) {
    const currentUrl = toVisit.shift();
    if (visited.has(currentUrl)) continue;
    console.log(`\n📥  Descargando: ${currentUrl}`);
    visited.add(currentUrl);

    try {
      const response = await axios.get(currentUrl, {
        timeout: 10000,
        headers: { 'User-Agent': 'Mozilla/5.0 (Node.js crawler)' }
      });
      const html = response.data;
      const filenameBase = urlToFilename(currentUrl);
      const extension = OUTPUT_FORMAT === 'html' ? '.html' : '.json';
      const filepath = path.join(OUTPUT_DIR, filenameBase + extension);

      if (OUTPUT_FORMAT === 'html') {
        // Guardar HTML crudo
        await fs.outputFile(filepath, html, 'utf8');
        console.log(`✅  Guardado HTML en: ${filepath}`);
      } else {
        // Extraer datos y guardar JSON
        const $ = cheerio.load(html);

        const pageTitle = $('h1').first().text().trim() || null;

        const paragraphs = [];
        $('.entry-content p').each((i, p) => {
          const t = $(p).text().trim();
          if (t) paragraphs.push(t);
        });

        const images = [];
        $('.entry-content img').each((i, img) => {
          const src = $(img).attr('src');
          if (src) {
            const norm = normalizeAndCheckInternal(src, currentUrl)
              || new URL(src, BASE_URL).toString();
            images.push(norm);
          }
        });

        const documents = [];
        $('.entry-content a[href$=".pdf"], .entry-content a[href$=".doc"], .entry-content a[href$=".docx"], .entry-content a[href$=".xls"], .entry-content a[href$=".xlsx"]').each((i, a) => {
          const href = $(a).attr('href');
          if (href) {
            const norm = normalizeAndCheckInternal(href, currentUrl)
              || new URL(href, BASE_URL).toString();
            documents.push(norm);
          }
        });

        const pageLinks = [];
        $('.entry-content a').each((i, a) => {
          const href = $(a).attr('href');
          const norm = normalizeAndCheckInternal(href, currentUrl);
          if (norm) pageLinks.push(norm);
        });

        const data = {
          url: currentUrl,
          title: pageTitle,
          paragraphs,
          images,
          documents,
          links: pageLinks
        };
        await fs.outputFile(filepath, JSON.stringify(data, null, 2), 'utf8');
        console.log(`✅  Guardado JSON en: ${filepath}`);
      }

      // Encolar enlaces internos
      const $ = cheerio.load(html);
      $('a').each((i, elem) => {
        const norm = normalizeAndCheckInternal($(elem).attr('href'), currentUrl);
        if (norm && !visited.has(norm)) {
          toVisit.push(norm);
        }
      });
    } catch (err) {
      console.error(`⚠️  Error en ${currentUrl}: ${err.message}`);
    }

    await delay(REQUEST_DELAY_MS);
  }

  console.log(`\n🏁  Crawler finalizado. Páginas visitadas: ${visited.size}`);
}

// ----------------------
//  Inicio del script
// ----------------------
(async () => {
  const { targetUrl, format } = await promptMenu();
  BASE_URL      = targetUrl;
  BASE_DOMAIN   = new URL(BASE_URL).hostname;
  OUTPUT_FORMAT = format;                   
  OUTPUT_DIR    = path.join(__dirname, 'pages_' + format);

  console.log(`\n🚀  Arrancando crawler en: ${BASE_URL}`);
  console.log(`💾  Guardando archivos en: ${OUTPUT_DIR}\n`);

  await fs.ensureDir(OUTPUT_DIR);
  toVisit.push(BASE_URL);
  await crawl();
})();
