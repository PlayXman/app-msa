import GlobalStorageObserver from './GlobalStorageObserver';

/**
 * Lite version of Redux. Serves as global storage. Data are saved as ket-data pair and functions listen for particular
 * data changes
 */
class GlobalStorage {
	/**
	 * @type {{}} all stored data
	 * @private
	 */
	static _storage = {};

	/**
	 * Sets/updates data in storage. There's only key-data pair
	 * @param {string} key Key name
	 * @param {*} data
	 */
	static set(key, data) {
		this._storage[key] = data;

		const event = new CustomEvent(this._createEventKey(key), {
			detail: this.getState(key),
		});
		document.dispatchEvent(event);
	}

	/**
	 * Listen for some key changes. It returns null if the key isn't set yet. Callback is called even at first
	 * connection
	 * @param {string} key Key name
	 * @param {function(*)} callback Function called when the key is changed
	 * @return {GlobalStorageObserver}
	 */
	static connect(key, callback) {
		const observer = new GlobalStorageObserver(callback);

		callback(this.getState(key));
		observer.listen(this._createEventKey(key));

		return observer;
	}

	/**
	 * Returns current state of data from storage
	 * @param {string} key Key name
	 * @return {*|null} null if the key is not set
	 */
	static getState(key) {
		return this._storage[key] || null;
	}

	/**
	 * Creates event name for observers
	 * @param {string} key Key name
	 * @return {string}
	 * @private
	 */
	static _createEventKey(key) {
		return `storage_${key}`;
	}
}

export default GlobalStorage;
