import Media from "@/models/Media";

/**
 * Format date to human-readable text.
 * @param date
 */
export function formatDate(date: string | Date | undefined): string {
  if (!date) {
    return "TBA";
  }

  const d = new Date(date);
  return d.toLocaleDateString("cs-CZ");
}

/**
 * Convert item slug to alphabet letter. Used in combination with Alphabet component.
 * @param model
 */
export function slugToAlphabet(model: Media): string {
  const firstLetter = model.slug.charAt(0);
  return isNaN(parseFloat(firstLetter)) ? firstLetter : "#";
}

/**
 * Add alpha to hex color.
 * @param hex Color in hexadecimal format with no alpha. Example: #000000
 * @param alpha Alpha value from 0 to 1.
 */
export function colorToHexAlpha(hex: string, alpha: number): string {
  return hex + (Math.round(alpha * 255) | (1 << 8)).toString(16).slice(1);
}
