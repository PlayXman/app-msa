/**
 * Event handler for GlobalStorage
 */
class GlobalStorageObserver {
	/** @type {function} */
	callback;
	/** @type {string} */
	key;

	/**
	 * @param {function} callback
	 */
	constructor(callback) {
		this.callback = (e) => {
			callback(e.detail);
		};
	}

	/**
	 * Starts event listener for callback function
	 * @param {string} key Event name
	 */
	listen(key) {
		if (key) {
			this.key = key;
			document.addEventListener(key, this.callback);
		}
	}

	/**
	 * Disconnects event listener for data change
	 */
	disconnect() {
		document.removeEventListener(this.key, this.callback);
	}
}

export default GlobalStorageObserver;
