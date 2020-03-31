import firebase from 'firebase/app';

/** @type {string} DB path */
const DB_PATH = '/Vendors/traktTv';

/**
 * DB object handler
 */
class Trakt {
	/**
	 * Gets api key from DB
	 * @return {Promise<{clientId: string, clientSecret: string, refreshToken: string}>} Param is api keys or null
	 */
	static getApiKeys() {
		return firebase
			.database()
			.ref(`${DB_PATH}/key`)
			.once('value')
			.then((traktSnap) => {
				if (!traktSnap.val()) {
					return null;
				}

				return traktSnap.val();
			});
	}

	/**
	 * Gets refresh token from DB
	 * @return {Promise<string>} Param is token or null
	 */
	static getRefreshToken() {
		return firebase
			.database()
			.ref(`${DB_PATH}/key/refreshToken`)
			.once('value')
			.then((traktSnap) => {
				if (!traktSnap.val()) {
					return null;
				}

				return traktSnap.val();
			});
	}

	/**
	 * Saves refresh token to DB
	 * @param {string|null} refreshToken Trakt refresh token
	 * @return {Promise<any>}
	 */
	static setRefreshToken(refreshToken) {
		return firebase.database().ref(`${DB_PATH}/key/refreshToken`).set(refreshToken);
	}
}

export default Trakt;
