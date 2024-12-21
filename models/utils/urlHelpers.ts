/**
 * Formats text, mainly media title, for url get param.
 */
export function encodeText(text: string): string {
  return encodeURIComponent(text.replace(/:/g, "")).replace(/%20/g, "+");
}

/**
 * Opens url in new tab
 */
export function openNewTab(url: string) {
  window.open(url, "_blank");
}

/**
 * Creates "slug" from text. Replaces all special chars, spaces etc. and creates simple lowercase string.
 */
export function slugify(text: string): string {
  const a =
    "àáäâãåăæąçćčđďèéěėëêęǵḧìíïîįłḿǹńňñòóöôœøṕŕřßśšșťțùúüûǘůűūųẃẍÿýźžż·/_,:;";
  const b =
    "aaaaaaaaacccddeeeeeeeghiiiiilmnnnnooooooprrssssttuuuuuuuuuwxyyzzz------";
  const p = new RegExp(a.split("").join("|"), "g");

  return text
    .toString()
    .toLowerCase()
    .replace(/^(the|a|an) /, "") // Remove leading articles
    .replace(/\s+/g, "-") // Replace spaces with -
    .replace(p, (c) => b.charAt(a.indexOf(c))) // Replace special characters
    .replace(/&/g, "-and-") // Replace & with 'and'
    .replace(/[^\w-]+/g, "") // Remove all non-word characters
    .replace(/--+/g, "-") // Replace multiple - with single -
    .replace(/^-+/, "") // Trim - from start of text
    .replace(/-+$/, ""); // Trim - from end of text
}
