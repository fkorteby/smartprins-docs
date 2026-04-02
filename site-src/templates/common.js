const socialLinks = `
  <ul class="social-list list-unstyled pb-4 mb-0">
    <li class="list-inline-item">
      <a href="https://wa.me/966566240665"><i class="fa-brands fa-whatsapp fa-fw"></i></a>
    </li>
    <li class="list-inline-item">
      <a href="https://www.youtube.com/channel/UCNfxY0P_RuxuuKAo842kpbw"><i class="fa-brands fa-youtube fa-fw"></i></a>
    </li>
    <li class="list-inline-item">
      <a href="https://www.linkedin.com/company/smart-prints/"><i class="fa-brands fa-linkedin fa-fw"></i></a>
    </li>
    <li class="list-inline-item">
      <a href="https://www.instagram.com/smartprintsksa/"><i class="fa-brands fa-instagram fa-fw"></i></a>
    </li>
  </ul>
`;

function renderMeta({
  title,
  description,
  lang,
  dir,
  dataLangEn,
  dataLangAr,
  extraHead = "",
}) {
  return `<!doctype html>
<html lang="${lang}" dir="${dir}" data-lang-en="${dataLangEn}" data-lang-ar="${dataLangAr}">
  <head>
    <title>${title}</title>
    <meta charset="utf-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content="${description}" />
    <meta name="author" content="SmartPrints Team" />
    <link rel="shortcut icon" href="favicon.ico" />
    <link href="https://fonts.googleapis.com/css2?family=Tajawal:wght@300;400;500;700&display=swap" rel="stylesheet" />
    <link href="https://fonts.googleapis.com/css?family=Poppins:300,400,500,600,700&display=swap" rel="stylesheet" />
    <script defer src="assets/fontawesome/js/all.min.js"></script>
    <link rel="stylesheet" href="//cdnjs.cloudflare.com/ajax/libs/highlight.js/9.15.2/styles/atom-one-dark.min.css" />
    <link rel="stylesheet" href="assets/plugins/simplelightbox/simple-lightbox.min.css" />
    <link id="theme-style" rel="stylesheet" href="assets/css/theme.css" />
    <script src="https://kit.fontawesome.com/7336bd56cb.js" crossorigin="anonymous"></script>
${extraHead}
    <script>
      (function () {
        var l = localStorage.getItem("sp_lang");
        if (l) document.documentElement.lang = l;
      })();
    </script>
  </head>`;
}

function renderFooter() {
  return `
    <footer class="footer">
      <div class="footer-bottom text-center py-5">
${socialLinks}
        <small class="copyright">
          &copy; Copyright 2025
          <a class="theme-link" href="https://smartprints-ksa.com/" target="_blank">Smart Prints</a>
          All Rights Reserved. Designed with
          <i class="fas fa-heart" style="color: #fb866a"></i> by
          <a class="theme-link" href="http://themes.3rdwavemedia.com" target="_blank">XR</a>.
        </small>
      </div>
    </footer>`;
}

function renderCommonScripts() {
  return `
    <script src="assets/plugins/popper.min.js"></script>
    <script src="assets/plugins/bootstrap/js/bootstrap.min.js"></script>
    <script src="assets/plugins/smoothscroll.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.15.8/highlight.min.js"></script>
    <script src="assets/js/highlight-custom.js"></script>
    <script src="assets/plugins/simplelightbox/simple-lightbox.min.js"></script>
    <script src="assets/plugins/gumshoe/gumshoe.polyfills.min.js"></script>
    <script src="assets/js/docs.js"></script>
    <script src="assets/js/lang.js"></script>`;
}

function renderHomeHeader({ locale, homeHref }) {
  return `
    <header class="header fixed-top">
      <div class="branding docs-branding">
        <div class="container-fluid py-2">
          <div class="row align-items-center home-header-row">
            <div class="home-header-brand">
              <div class="site-logo">
                <a class="navbar-brand" href="${homeHref}">
                  <img class="logo-icon me-2" src="assets/images/sticky_logo.png" alt="logo" style="height: 60px" />
                  <span class="logo-text">
                    <small class="text-alt lang-en">Documentation</small>
                    <small class="text-alt lang-ar">التوثيق</small>
                    <small class="version-text">v1.0</small>
                  </span>
                </a>
              </div>
            </div>
            <div class="home-header-actions">
              <ul class="social-list list-inline home-social-list mx-md-3 mx-lg-4 d-none d-lg-flex">
                <li class="list-inline-item"><a href="https://wa.me/966566240665"><i class="fa-brands fa-whatsapp"></i></a></li>
                <li class="list-inline-item"><a href="https://www.youtube.com/channel/UCNfxY0P_RuxuuKAo842kpbw"><i class="fa-brands fa-youtube"></i></a></li>
                <li class="list-inline-item"><a href="https://www.linkedin.com/company/smart-prints/"><i class="fa-brands fa-linkedin"></i></a></li>
                <li class="list-inline-item"><a href="https://www.instagram.com/smartprintsksa/"><i class="fa-brands fa-instagram"></i></a></li>
              </ul>
              <button id="lang-toggle" onclick="toggleLanguage()">
                <span class="lang-en">&#127480;&#127462; العربية</span>
                <span class="lang-ar">&#127468;&#127463; English</span>
              </button>
              <a href="#" class="btn btn-primary d-none d-lg-flex ms-2 lang-en home-download-btn">Download</a>
              <a href="#" class="btn btn-primary d-none d-lg-flex lang-ar home-download-btn">تحميل</a>
            </div>
          </div>
        </div>
      </div>
    </header>`;
}

function renderDocsHeader({ homeHref }) {
  return `
    <header class="header fixed-top">
      <div class="branding docs-branding">
        <div class="container-fluid py-2">
          <div class="row align-items-center">
            <div class="col-4 col-md-3 col-lg-2 d-flex align-items-center">
              <a class="navbar-brand" href="${homeHref}">
                <div class="site-logo">
                  <img class="logo-icon me-2" src="assets/images/sticky_logo.png" alt="logo" style="height: 60px" />
                </div>
              </a>
            </div>
            <div class="col-4 col-md-6 col-lg-8 d-none d-lg-block">
              <form class="search-form position-relative d-flex justify-content-center">
                <div class="position-relative w-75 autocomplete-container">
                  <input type="text" placeholder="Search the docs..." name="search" class="form-control search-input pe-5" />
                  <div class="autocomplete-suggestions"></div>
                  <button type="submit" class="btn position-absolute top-50 end-0 translate-middle-y me-2 p-0 border-0 bg-transparent">
                    <i class="fa-light fa-magnifying-glass text-muted"></i>
                  </button>
                </div>
              </form>
            </div>
            <div class="col-8 col-md-3 col-lg-2 d-flex justify-content-end align-items-center gap-2">
              <button id="lang-toggle" onclick="toggleLanguage()">
                <span class="lang-en">🇸🇦 العربية</span>
                <span class="lang-ar">&#127468;&#127463; English</span>
              </button>
              <a href="#" class="btn btn-primary d-none d-lg-flex lang-en">Download</a>
              <a href="#" class="btn btn-primary d-none d-lg-flex lang-ar">تحميل</a>
            </div>
          </div>
        </div>
      </div>
    </header>`;
}

module.exports = {
  renderMeta,
  renderFooter,
  renderCommonScripts,
  renderHomeHeader,
  renderDocsHeader,
};
