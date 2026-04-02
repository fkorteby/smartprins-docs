const {
  renderMeta,
  renderFooter,
  renderCommonScripts,
  renderDocsHeader,
} = require("./common");

function renderDocsPage({
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
${renderDocsHeader({ homeHref })}

${mainHtml}
${renderFooter()}
${renderCommonScripts()}
  </body>
</html>
`;
}

module.exports = { renderDocsPage };
