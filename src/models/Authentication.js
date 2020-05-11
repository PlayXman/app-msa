import { auth } from 'firebase/app';

/**
 * Deals with user authentication
 */
class Authentication {
	/**
	 * Signs in a user
	 * @param {string} email
	 * @param {string} pass
	 * @return {Promise<firebase.auth.UserCredential>}
	 */
	static signIn(email, pass) {
		return auth().signInWithEmailAndPassword(email, pass);
	}

	/**
	 * Listens for user sign in and out
	 * @param {function(boolean)} callback Returns true if logged in, false otherwise
	 */
	static signInListener(callback) {
		auth().onAuthStateChanged((user) => {
			if (user) {
				callback(true);
			} else {
				callback(false);
			}
		});
	}
}

export default Authentication;
