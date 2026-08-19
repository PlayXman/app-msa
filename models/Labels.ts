import Media from "@/models/Media";

/**
 * Processes the labels in the React context.
 */
export default class Labels {
  /**
   * Pair of label name and its number of occurrences.
   */
  labels: Map<string, number> = new Map();

  /**
   * Convert to list of labels.
   */
  toArray(): string[] {
    return Array.from(this.labels.keys());
  }

  /**
   * Sanitize new label.
   */
  static createNewLabel(text: string): string {
    return text
      .split(/[\s-_]/g)
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join("");
  }

  clone(): Labels {
    const nextLabels = new Labels();
    nextLabels.labels = new Map(this.labels);
    return nextLabels;
  }

  /**
   * Update label occurrences in DB. Allows to add new or remove unused.
   */
  async update(labels: { add?: string[]; remove?: string[] }): Promise<void> {
    for (const label of labels.add ?? []) {
      let count = this.labels.get(label) ?? 0;
      count++;
      this.labels.set(label, count);
    }

    for (const label of labels.remove ?? []) {
      let count = this.labels.get(label) ?? 0;
      count--;

      if (count <= 0) {
        this.labels.delete(label);
      } else {
        this.labels.set(label, count);
      }
    }
  }

  /**
   * Recalculate label occurrences from media list.
   */
  async set(mediaList: Media[]): Promise<void> {
    const nextLabels: typeof this.labels = new Map();

    for (const media of mediaList) {
      for (const label of media.labels) {
        const count = nextLabels.get(label) ?? 0;
        nextLabels.set(label, count + 1);
      }
    }

    this.labels = nextLabels;
  }
}
