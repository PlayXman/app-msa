/**
 * Handles clipboard operations.
 */
class Clipboard {
	/**
	 * Copies string into clipboard.
	 * @param {string} text
	 * @returns {Promise<void>}
	 */
	static copy(text) {
		return navigator.clipboard.writeText(text);
	}
}

export default Clipboard;
