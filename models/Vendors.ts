import { get, getDatabase, ref, set } from "firebase/database";

const DB_PATH = "Vendors";

/**
 * This class is used to interact with the Vendors table in the database. The table holds vendor keys and similar.
 */
export class Vendors {
  name: string;

  constructor(name: string) {
    this.name = name;
  }

  /**
   * @param path E.g. `key` or `directory/key`.
   */
  async get<Data = any>(path: string): Promise<Data | null> {
    const snapshot = await get(
      ref(getDatabase(), `${DB_PATH}/${this.name}/${path}`),
    );

    if (snapshot.exists()) {
      return snapshot.val();
    }

    return null;
  }

  /**
   * @param data Data to set.
   * @param path Optional. Subpath under the vendor's name. E.g. `key` will set data under `/Vendors/vendorName/key`.
   */
  async set(data: any, path?: string): Promise<void> {
    let dbPath = `${DB_PATH}/${this.name}`;
    if (path) {
      dbPath += `/${path}`;
    }

    return set(ref(getDatabase(), dbPath), data);
  }
}
