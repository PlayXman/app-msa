import { database } from 'firebase/app';

/** @type {string} DB path */
const DB_PATH = '/Vendors/tmdb';

/**
 * DB object handler
 */
class Tmdb {
	/**
	 * Gets api key from DB
	 * @return {Promise<firebase.database.DataSnapshot>} Param is api key or null
	 */
	static getApiKey() {
		return database()
			.ref(`${DB_PATH}/key`)
			.once('value')
			.then((tmdbSnap) => {
				if (!tmdbSnap.val()) {
					return false;
				}

				return tmdbSnap.val();
			});
	}
}

export default Tmdb;
