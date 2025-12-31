// eslint-disable-next-line @typescript-eslint/no-require-imports
const path = require("path");

const buildEslintCommand = (filenames) =>
  `eslint --fix ${filenames
    .map((f) => `"${path.relative(process.cwd(), f)}"`)
    .join(" ")}`;

module.exports = {
  "app/**/*.{js,jsx,ts,tsx}": [buildEslintCommand],
  "components/**/*.{js,jsx,ts,tsx}": [buildEslintCommand],
  "models/**": [buildEslintCommand],
  "public/**/*.{html,css}": [buildEslintCommand],
};
