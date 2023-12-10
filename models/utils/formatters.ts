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
