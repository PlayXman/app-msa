import firebase from 'firebase/app';

/** @type {string} DB path */
const DB_PATH = '/Vendors/giantBomb';

/**
 * DB object handler
 */
class GiantBomb {

	/**
	 * Gets api key from DB
	 * @return {Promise<firebase.database.DataSnapshot>} Param is api key or null
	 */
	static getApiKey() {
		return firebase.database().ref( `${DB_PATH}/key` ).once( 'value' ).then( ( giantBombSnap ) => {
			if ( !giantBombSnap.val() ) {
				return false;
			}

			return giantBombSnap.val();
		} );
	}

}

export default GiantBomb;
