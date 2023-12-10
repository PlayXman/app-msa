import {
  getDatabase,
  remove,
  ref,
  set,
  get,
  query,
  orderByChild,
} from "firebase/database";
import UrlHelpers from "@/models/utils/UrlHelpers";

export enum Status {
  DEFAULT = "DEFAULT",
  DOWNLOADABLE = "DOWNLOADABLE",
  OWNED = "OWNED",
}

/**
 * Base class for all media types.
 */
export default abstract class Media {
  id: string = "";
  slug: string = "";
  title: string = "";
  status: Status = Status.DEFAULT;
  labels: string[] = [];
  imageUrl: string = "";
  releaseDate: string = "";

  constructor(obj?: Record<string, any>) {
    if (obj) {
      for (const key of Object.keys(this)) {
        const prop = key as keyof this;
        const value = obj[key];
        this[prop] = typeof value === typeof this[prop] ? value : this[prop];
      }
    }
  }

  /**
   * Name of the model. Lowercase, and used as a key in DB.
   */
  abstract get modelName(): string;

  /**
   * Number of parallel requests in batch operations.
   */
  abstract get batchOperationConcurrencyLimit(): number;

  /**
   * Update items from external sources.
   */
  abstract refresh(items: Media[]): Promise<Media[]>;

  /**
   * Is the item released already?
   */
  get isReleased(): boolean {
    const releaseDate = new Date(this.releaseDate);
    const now = new Date();
    return releaseDate <= now;
  }

  /**
   * Update item in DB.
   */
  save(): Promise<void> {
    if (!this.id) {
      throw new Error(`Missing ID for ${this.title}`);
    }

    return set(ref(getDatabase(), this.getDbPath(this.id)), this.toDb());
  }

  /**
   * Delete item from DB.
   */
  delete(): Promise<void> {
    if (!this.id) {
      return Promise.resolve();
    }

    return remove(ref(getDatabase(), this.getDbPath(this.id)));
  }

  clone(): this {
    return new (this.constructor as any)(
      Object.fromEntries(Object.entries(this)),
    );
  }

  getDbPath(...chunks: string[]): string {
    return ["/Media", this.modelName, ...chunks].join("/");
  }

  /**
   * Should display?
   * @param filter
   */
  display(filter: {
    text?: string;
    status?: Status;
    isReleased?: boolean;
  }): boolean {
    let result = true;

    if (filter.isReleased != null) {
      result = result && filter.isReleased === this.isReleased;
    }

    if (filter.status != null && result) {
      result = result && filter.status === this.status;
    }

    if (filter.text && result) {
      if (this.labels.includes(filter.text)) {
        result = result && true;
      } else if (this.title.toLowerCase().includes(filter.text.toLowerCase())) {
        result = result && true;
      } else {
        result = false;
      }
    }

    return result;
  }

  /**
   * Fetches all items from DB and creates instances of the given class.
   * @param mediaType Class name. E.g. `Movies` or `Games`.
   */
  static async fetchAll<T extends Media>(
    mediaType: new (...args: any) => T,
  ): Promise<T[]> {
    const dbPath = new mediaType().getDbPath();
    const snapshot = await get(
      query(ref(getDatabase(), dbPath), orderByChild("slug")),
    );

    if (!snapshot.exists()) {
      return [];
    }

    const result: T[] = [];
    snapshot.forEach((child) => {
      result.push(
        new mediaType({
          ...child.val(),
          id: child.key,
        }),
      );
    });

    return result;
  }

  /**
   * Convert this to DB payload.
   * @protected
   */
  protected toDb(): object {
    return {
      slug: this.slug || UrlHelpers.slugify(this.title),
      title: this.title,
      status: this.status,
      labels: this.labels,
      imageUrl: this.imageUrl,
      releaseDate: this.releaseDate,
    };
  }
}
