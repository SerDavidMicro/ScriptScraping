````markdown
# 🕷️ Crawler Web Interactivo

Un crawler ligero en Node.js con **menú interactivo** para elegir la URL de destino y el formato de salida (`html` o `json`).  
Guarda cada página interna en `pages_html/` o `pages_json/` según tu elección.

---

## 🚀 Características

- 💬 **Menú CLI interactivo**  
  1. Introduce la URL base (añade `https://` si falta)  
  2. Elige el formato de salida: `html` o `json`  
- 🔗 **Recorrido recursivo** de todos los enlaces internos en el mismo dominio  
- ⏱️ **Retraso configurable** entre peticiones (por defecto 500 ms)  
- 📂 **Carpeta por formato**:  
  - `pages_html/` → `.html`  
  - `pages_json/` → `.json`  

---

## 📋 Prerrequisitos

- **Node.js** ≥ v12 (se probó en v16+)  
- **npm** (incluido con Node.js)  

---

## ⚙️ Instalación

1. **Clona este repositorio**  
   ```bash
   git clone https://github.com/<tu-usuario>/interactive-web-crawler.git
   cd interactive-web-crawler
````

2. **Instala dependencias**

   ```bash
   npm install axios cheerio fs-extra
   ```

---

## ▶️ Uso

1. **Lanza el crawler**

   ```bash
   node crawler.js
   ```
2. **Responde al menú**

   ```
   === CRAWLER INTERACTIVO ===

   1) Introduce la URL base (ej: https://www.ejemplo.com/):
   2) Elige formato de salida ("html" o "json"):
   ```
3. **Espera** a que el script descargue y guarde todas las páginas internas.
4. **Revisa** la carpeta generada (`pages_html/` o `pages_json/`).

---

## 📂 Estructura de carpetas

```
.
├── crawler.js         # Script principal
├── package.json       # Definición de dependencias
├── pages_html/        # (modo html) archivos .html
└── pages_json/        # (modo json) archivos .json
```

---

## 🔧 Configuración

* **REQUEST\_DELAY\_MS**
  Ajusta el retraso entre peticiones en `crawler.js` (por defecto 500 ms).
* **Extracción JSON**
  Edita la sección de Cheerio en `crawl()` para capturar otros selectores o campos.

---

## 🚨 Precauciones

* Respeta el `robots.txt` y los términos de servicio del sitio.
* No procesa JavaScript dinámico ni “infinite scroll”.
* Para sitios grandes, considera:

  * Limitar profundidad de crawl
  * Controlar concurrencia
  * Añadir reintentos ante errores

---

## 📝 Licencia

Este proyecto se distribuye bajo la **Licencia MIT**.
¡Feliz crawling! 🚀


*------------------------------------------------------*
````markdown
# 🕷️ Interactive Web Crawler

A lightweight, interactive Node.js crawler that lets you:

- 🔍 **Choose a base URL** at runtime (auto-prepends `https://` if missing)  
- 🎛️ **Select output format** on the fly: `html` or `json`  
- 🔗 **Recursively crawl** every internal link on the same domain  
- ⏱️ **Respect a configurable delay** between requests (default: 500 ms)  
- 📁 **Save pages** into format-specific folders:  
  - `pages_html/` → raw `.html` files  
  - `pages_json/` → structured `.json` files  

---

## 📋 Prerequisites

- **Node.js** v12+ (tested on v16+)  
- **npm** (bundled with Node.js)  

---

## ⚙️ Installation

1. **Clone this repository**  
   ```bash
   git clone https://github.com/<your-username>/interactive-web-crawler.git
   cd interactive-web-crawler
````

2. **Install dependencies**

   ```bash
   npm install axios cheerio fs-extra
   ```

---

## ▶️ Usage

1. **Run the crawler**

   ```bash
   node crawler.js
   ```

2. **Follow the interactive prompts**

   ```
   === INTERACTIVE CRAWLER ===

   1) Enter the base URL (e.g. https://www.example.com/):
   2) Choose output format ("html" or "json"):
   ```

3. **Wait** for the crawler to download and save every internal page.

4. **Inspect** the output folder (`pages_html/` or `pages_json/`) for results.

---

## 📂 Folder Structure

```
.
├── crawler.js         # Main crawler script
├── package.json       # Dependency manifest
├── pages_html/        # (html mode) raw .html files
└── pages_json/        # (json mode) structured .json files
```

---

## 🔧 Configuration

* **REQUEST\_DELAY\_MS**
  Adjust the delay between requests (default is 500 ms) in `crawler.js`.

* **Data Extraction**
  Customize the Cheerio selectors inside the `crawl()` function to capture additional fields.

---

## 🚨 Caveats & Tips

* ✅ Always obey the site’s **robots.txt** and **Terms of Service**.
* 🚫 This crawler does **not** execute JavaScript or handle infinite-scroll pages.
* 🔧 For large sites, consider adding:

  * **Max depth** limits
  * **Concurrency** control
  * **Retry logic** on failure

---

## 📝 License

This project is released under the **MIT License**.
Happy crawling! 🚀

```
```


