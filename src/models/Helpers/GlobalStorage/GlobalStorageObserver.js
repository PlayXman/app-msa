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
	constructor( callback ) {
		this.callback = callback;
	}

	/**
	 * Starts event listener for callback function
	 * @param {string} key Event name
	 */
	listen( key ) {
		this.key = key;
		document.addEventListener( key, ( e ) => {
			this.callback( e.detail );
		} );
	}

	/**
	 * Disconnects event listener for data change
	 */
	disconnect() {
		document.removeEventListener( this.key, ( e ) => {
			this.callback( e.detail );
		} );
	}

}

export default GlobalStorageObserver;
