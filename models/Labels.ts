import { get, getDatabase, ref, set } from "firebase/database";
import Media from "@/models/Media";

/**
 * Stores labels for media in DB collection.
 */
export default class Labels {
  readonly mediaName: string;
  /**
   * Pair of label name and its number of occurrences.
   */
  labels: Map<string, number> = new Map();

  constructor(mediaName: string) {
    this.mediaName = mediaName;
  }

  getDbPath(...chunks: string[]): string {
    return ["/Labels", this.mediaName, ...chunks].join("/");
  }

  /**
   * Convert to list of labels.
   */
  toArray(): string[] {
    return Array.from(this.labels.keys());
  }

  /**
   * Sanitize new label.
   * @param text
   */
  static createNewLabel(text: string): string {
    return text
      .split(/[\s-_]/g)
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join("");
  }

  clone(): Labels {
    const nextLabels = new Labels(this.mediaName);
    nextLabels.labels = new Map(this.labels);
    return nextLabels;
  }

  /**
   * Update label occurrences in DB. Allows to add new or remove unused.
   * @param labels
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

    return this.saveLabels();
  }

  /**
   * Fetch all labels from DB.
   */
  async load(): Promise<void> {
    const snapshot = await get(ref(getDatabase(), this.getDbPath()));

    if (!snapshot.exists()) {
      return;
    }

    this.labels = new Map(Object.entries<number>(snapshot.val()));
  }

  /**
   * Recalculate label occurrences from media list.
   * @param mediaList
   */
  refresh(mediaList: Media[]): Promise<void> {
    const nextLabels: typeof this.labels = new Map();

    for (const media of mediaList) {
      for (const label of media.labels) {
        const count = nextLabels.get(label) ?? 0;
        nextLabels.set(label, count + 1);
      }
    }

    this.labels = nextLabels;
    return this.saveLabels();
  }

  /**
   * Persist labels in DB.
   * @protected
   */
  protected saveLabels() {
    return set(
      ref(getDatabase(), this.getDbPath()),
      Object.fromEntries(this.labels),
    );
  }
}
