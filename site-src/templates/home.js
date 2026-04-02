const {
  renderMeta,
  renderFooter,
  renderCommonScripts,
  renderHomeHeader,
} = require("./common");

function renderHomePage({
  title,
  description,
  lang,
  dir,
  dataLangEn,
  dataLangAr,
  homeHref,
  extraHead,
  mainHtml,
}) {
  return `${renderMeta({
    title,
    description,
    lang,
    dir,
    dataLangEn,
    dataLangAr,
    extraHead,
  })}
  <body>
${renderHomeHeader({ locale: lang, homeHref })}

${mainHtml}
${renderFooter()}
${renderCommonScripts()}
  </body>
</html>
`;
}

module.exports = { renderHomePage };
