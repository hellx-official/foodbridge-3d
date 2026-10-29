/* Build-time mirror of the two Google Fonts CSS responses.
 * Fontsource distributes the same Google Fonts under the SIL Open Font License.
 * Absolute font URLs are read from disk by next/font/google's offline loader.
 * No runtime requests, altered font binaries, or browser-side mocking occur.
 */
const families = [
  { name: "Inter", slug: "inter", weights: [400, 500, 600] },
  { name: "Space Grotesk", slug: "space-grotesk", weights: [500, 700] },
];

module.exports = Object.fromEntries(
  families.map(({ name, slug, weights }) => {
    const url = `https://fonts.googleapis.com/css2?family=${name.replaceAll(" ", "+")}:wght@${weights.join(";")}&display=swap`;
    const css = weights
      .map((weight) => {
        const file = require.resolve(`@fontsource/${slug}/files/${slug}-latin-${weight}-normal.woff2`);
        return `/* latin */\n@font-face { font-family: '${name}'; font-style: normal; font-weight: ${weight}; font-display: swap; src: url(${file}) format('woff2'); }`;
      })
      .join("\n");
    return [url, css];
  }),
);
