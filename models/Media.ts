import {
  getDatabase,
  remove,
  ref,
  set,
  get,
  query,
  orderByChild,
} from "firebase/database";
import { slugify } from "@/models/utils/urlHelpers";
import { Props as InfoLink } from "@/app/(media)/_components/MediaGrid/MediaGridItemMenuInfoLink";

export enum Status {
  DEFAULT = "DEFAULT",
  DOWNLOADABLE = "DOWNLOADABLE",
  OWNED = "OWNED",
}

/**
 * Base class for all media types.
 */
export default abstract class Media<VendorIds extends Record<any, any> = any> {
  /** DB key. */
  id: string = "";
  /** External provider IDs. */
  vendorIds: VendorIds | null = null;
  slug: string = "";
  title: string = "";
  status: Status = Status.DEFAULT;
  labels: string[] = [];
  imageUrl: string = "";
  releaseDate: string = "";

  constructor(obj?: Record<string, any>) {
    if (obj) {
      Object.assign(this, obj);
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
   * List of links to external info pages about the item.
   */
  abstract get infoLinks(): InfoLink[];

  /**
   * Link to external info page about the item on search page.
   */
  abstract get searchInfoLink(): string;

  /**
   * Is the item released already?
   */
  get isReleased(): boolean {
    const releaseDate = new Date(this.releaseDate);
    if (isNaN(releaseDate.valueOf())) {
      return false;
    }

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

  /**
   * Clone this instance.
   */
  clone(): this {
    return new (this.constructor as any)(
      Object.fromEntries(Object.entries(this)),
    );
  }

  /**
   * Update items from external sources.
   */
  abstract refresh(items: Media<VendorIds>[]): Promise<Media<VendorIds>[]>;

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
   * Fetch items from external source, like Trakt.tv. The items will then be merged with the current item list and the new ones will be refreshed with latest info.
   *
   * @returns null if not implemented/applicable.
   */
  async fetchItemsFromExternalSource(): Promise<Media<VendorIds>[] | null> {
    return null;
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

  protected getDbPath(...chunks: string[]): string {
    return ["/Media", this.modelName, ...chunks].join("/");
  }

  /**
   * Convert this to DB payload.
   * @protected
   */
  protected toDb(): object {
    return {
      slug: this.slug || slugify(this.title),
      vendorIds: this.vendorIds,
      title: this.title,
      status: this.status,
      labels: this.labels,
      imageUrl: this.imageUrl,
      releaseDate: this.releaseDate,
    };
  }
}
