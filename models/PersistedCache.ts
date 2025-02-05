import Media from "@/models/Media";

export class PersistedCache {
  private readonly dbName = "MediaModelDb";
  private readonly storeName = "media";
  mediaModel: new (...args: any) => Media;

  /**
   * @param mediaModel Reference of media model class.
   */
  constructor(mediaModel: new (...args: any) => Media) {
    this.mediaModel = mediaModel;
  }

  /**
   * Get all items from cache for the current media model.
   */
  async get(): Promise<Media[]> {
    const db = await this.connect();
    const transaction = db.transaction([this.storeName], "readonly");
    const store = transaction.objectStore(this.storeName);

    return new Promise((resolve, reject) => {
      const request: IDBRequest<MediaObject> = store.get(this.getModelName());

      request.onsuccess = () => {
        db.close();

        resolve(
          request.result?.items?.map((i) => new this.mediaModel(i)) ?? [],
        );
      };

      request.onerror = () => {
        db.close();

        reject(request.error);
      };
    });
  }

  /**
   * Set items in cache for the current media model.
   * @param data
   */
  async set(data: Media[]): Promise<void> {
    const db = await this.connect();
    const transaction = db.transaction(this.storeName, "readwrite");
    const store = transaction.objectStore(this.storeName);

    return new Promise((resolve, reject) => {
      const request = store.put({
        model: this.getModelName(),
        items: data,
      });

      request.onsuccess = () => {
        db.close();
        resolve();
      };

      request.onerror = () => {
        db.close();

        reject(request.error);
      };
    });
  }

  private connect(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, 1);

      /**
       * Create object store if it doesn't exist. The older version store is cleared and recreated empty.
       * @param event
       */
      request.onupgradeneeded = (event) => {
        const db = request.result;

        const { oldVersion, newVersion } = event;

        if (oldVersion >= (newVersion ?? 0)) {
          // Do nothing.
          return;
        }

        // Clear cache.
        if (db.objectStoreNames.contains(this.storeName)) {
          db.deleteObjectStore(this.storeName);
        }

        db.createObjectStore(this.storeName, {
          keyPath: "model",
        });
      };

      request.onsuccess = () => {
        resolve(request.result);
      };

      request.onerror = () => {
        reject(request.error);
      };
    });
  }

  private getModelName(): string {
    const mediaController = new this.mediaModel();
    return mediaController.modelName;
  }
}

interface MediaObject {
  model: string;
  items: object[];
}
