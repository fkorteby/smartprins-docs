/**
 * SmartPrints language switcher.
 *
 * Current pages can keep both languages in one file.
 * Future pages can opt into separate files by adding:
 *   <html data-lang-en="page.html" data-lang-ar="page-ar.html">
 */

(function () {
  const STORAGE_KEY = "sp_lang";
  const html = document.documentElement;
  const KNOWN_AR_PAGES = new Set([
    "index-ar.html",
    "getting-started-ar.html",
    "cloud-pos-ar.html",
    "cloud-administration-ar.html",
    "smart-kiosk-ar.html",
    "smart-menu-ar.html",
    "smart-kitchen-app-ar.html",
    "smart-whatsapp-ar.html",
    "smart-waiter-ar.html",
    "inventory-intro0-ar.html",
    "inventory-intro-ar.html",
    "inventory-ingredients-ar.html",
    "inventory-suppliers-recipies-ar.html",
    "inventory-live-ar.html",
    "inventory-purchasing-ar.html",
    "inventory-stock-control-ar.html",
    "inventory-transfers-preparation-ar.html",
    "inventory-reports-ar.html",
  ]);

  function injectDocsHeaderStyles() {
    if (!document.querySelector(".docs-sidebar")) {
      return;
    }

    if (document.getElementById("sp-docs-header-style")) {
      return;
    }

    const style = document.createElement("style");
    style.id = "sp-docs-header-style";
    style.textContent = `
      html[lang="ar"] .docs-branding > .container-fluid > .row,
      html[lang="ar"] .docs-branding .container-fluid > .row {
        display: flex;
        flex-wrap: nowrap;
        align-items: center;
        justify-content: space-between;
        gap: 2rem;
      }

      html[lang="ar"] .docs-branding .container-fluid > .row > .col-4.col-md-3.col-lg-2.d-flex.align-items-center {
        order: 3;
        flex: 0 0 auto;
        width: auto;
        max-width: none;
        justify-content: flex-end;
        margin-left: 0;
      }

      html[lang="ar"] .docs-branding .container-fluid > .row > .col-4.col-md-6.col-lg-8.d-none.d-lg-block {
        order: 2;
        flex: 1 1 auto;
        width: auto;
        max-width: none;
      }

      html[lang="ar"] .docs-branding .container-fluid > .row > .col-8.col-md-3.col-lg-2.d-flex.justify-content-end.align-items-center.gap-2 {
        order: 1;
        flex: 0 0 auto;
        width: auto;
        max-width: none;
        justify-content: flex-start !important;
        margin-right: auto;
      }

      html[lang="ar"] .docs-branding .navbar-brand {
        flex-direction: row-reverse;
        margin-left: 0 !important;
        margin-right: 0 !important;
      }

      html[lang="ar"] .docs-branding .logo-icon {
        margin-right: 0 !important;
        margin-left: 0.5rem !important;
      }
    `;

    document.head.appendChild(style);
  }

  function normalizeLang(lang) {
    return lang === "ar" ? "ar" : "en";
  }

  function syncTitle(lang) {
    const titleAr = html.dataset.titleAr;
    const titleEn = html.dataset.titleEn;

    if (lang === "ar" && titleAr) {
      document.title = titleAr;
    }

    if (lang === "en" && titleEn) {
      document.title = titleEn;
    }
  }

  function getCurrentPageName() {
    return window.location.pathname.split("/").pop() || "";
  }

  function toLanguageHref(href, lang) {
    if (!href || href.startsWith("#")) {
      return href;
    }

    if (/^(https?:|mailto:|tel:|javascript:)/i.test(href)) {
      return href;
    }

    const [pathPart, hashPart] = href.split("#");
    const fileName = pathPart.split("/").pop() || "";

    if (!fileName.endsWith(".html")) {
      return href;
    }

    const directory = pathPart.slice(0, pathPart.length - fileName.length);
    let localizedFile = fileName;

    if (lang === "ar") {
      const arabicCandidate = fileName.endsWith("-ar.html")
        ? fileName
        : fileName.replace(/\.html$/i, "-ar.html");

      if (KNOWN_AR_PAGES.has(arabicCandidate)) {
        localizedFile = arabicCandidate;
      }
    } else if (fileName.endsWith("-ar.html")) {
      localizedFile = fileName.replace(/-ar\.html$/i, ".html");
    }

    return `${directory}${localizedFile}${hashPart ? `#${hashPart}` : ""}`;
  }

  function localizeInternalLinks(lang) {
    document.querySelectorAll("a[href]").forEach((anchor) => {
      const originalHref = anchor.dataset.originalHref || anchor.getAttribute("href");
      if (!originalHref) {
        return;
      }

      if (!anchor.dataset.originalHref) {
        anchor.dataset.originalHref = originalHref;
      }

      anchor.setAttribute("href", toLanguageHref(anchor.dataset.originalHref, lang));
    });
  }

  function getPageLanguage() {
    const currentPage = getCurrentPageName();

    if (html.dataset.langAr && currentPage === html.dataset.langAr) {
      return "ar";
    }

    if (html.dataset.langEn && currentPage === html.dataset.langEn) {
      return "en";
    }

    return normalizeLang(html.lang);
  }

  function showLoadingOverlay(nextLang) {
    const overlayId = "sp-lang-loading";
    const existing = document.getElementById(overlayId);

    if (existing) {
      return;
    }

    const overlay = document.createElement("div");
    overlay.id = overlayId;
    overlay.setAttribute("dir", nextLang === "ar" ? "rtl" : "ltr");
    overlay.style.position = "fixed";
    overlay.style.inset = "0";
    overlay.style.zIndex = "99999";
    overlay.style.display = "flex";
    overlay.style.flexDirection = "column";
    overlay.style.alignItems = "center";
    overlay.style.justifyContent = "center";
    overlay.style.gap = "16px";
    overlay.style.background = "rgba(255, 255, 255, 0.92)";
    overlay.style.backdropFilter = "blur(4px)";
    overlay.style.fontFamily = nextLang === "ar" ? "\"Tajawal\", sans-serif" : "\"Poppins\", sans-serif";
    overlay.innerHTML = `
      <div style="width:48px;height:48px;border:4px solid rgba(83,104,253,.18);border-top-color:#5368fd;border-radius:50%;animation:sp-lang-spin 0.75s linear infinite;"></div>
      <div style="font-size:16px;font-weight:600;color:#2d3748;">
        ${nextLang === "ar" ? "جارٍ التبديل إلى العربية..." : "Switching to English..."}
      </div>
    `;

    if (!document.getElementById("sp-lang-loading-style")) {
      const style = document.createElement("style");
      style.id = "sp-lang-loading-style";
      style.textContent = "@keyframes sp-lang-spin { to { transform: rotate(360deg); } }";
      document.head.appendChild(style);
    }

    document.body.appendChild(overlay);
  }

  function removeLoadingOverlay() {
    const overlay = document.getElementById("sp-lang-loading");
    if (overlay) {
      overlay.remove();
    }
  }

  function applyLang(lang) {
    const nextLang = normalizeLang(lang);
    const nextDir = nextLang === "ar" ? "rtl" : "ltr";

    html.lang = nextLang;
    html.dir = nextDir;

    if (document.body) {
      document.body.dir = nextDir;
    }

    syncTitle(nextLang);
  }

  function getTargetPage(lang) {
    return lang === "ar" ? html.dataset.langAr : html.dataset.langEn;
  }

  function redirectToLanguagePage(lang) {
    const targetPage = getTargetPage(lang);

    if (!targetPage) {
      return false;
    }

    const currentPage = window.location.pathname.split("/").pop() || "";
    if (targetPage === currentPage) {
      return false;
    }

    showLoadingOverlay(lang);
    const nextUrl = `${targetPage}${window.location.hash || ""}`;
    window.location.assign(nextUrl);
    return true;
  }

  window.toggleLanguage = function (forceLang) {
    const currentLang = getPageLanguage();
    const nextLang = normalizeLang(forceLang || (currentLang === "en" ? "ar" : "en"));

    localStorage.setItem(STORAGE_KEY, nextLang);

    if (redirectToLanguagePage(nextLang)) {
      return;
    }

    applyLang(nextLang);
  };

  const pageLang = getPageLanguage();
  const savedLang = normalizeLang(localStorage.getItem(STORAGE_KEY) || pageLang || html.lang || "en");
  const initialLang = getTargetPage(pageLang) ? pageLang : savedLang;

  injectDocsHeaderStyles();
  localStorage.setItem(STORAGE_KEY, initialLang);
  applyLang(initialLang);
  localizeInternalLinks(initialLang);
  removeLoadingOverlay();

  document.addEventListener("DOMContentLoaded", function () {
    applyLang(initialLang);
    localizeInternalLinks(initialLang);
    removeLoadingOverlay();
  });

  window.addEventListener("load", removeLoadingOverlay);
  window.addEventListener("pageshow", removeLoadingOverlay);
  window.addEventListener("pagehide", removeLoadingOverlay);
  window.addEventListener("beforeunload", removeLoadingOverlay);
})();
