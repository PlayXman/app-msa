/**
 * Handles clipboard operations.
 */
class Clipboard {
	/**
	 * Copies string into clipboard.
	 * @param {string} text
	 */
	static copy(text) {
		const el = document.createElement('textarea');
		el.value = text;
		document.body.appendChild(el);
		el.select();
		document.execCommand('copy');
		document.body.removeChild(el);
	}
}

export default Clipboard;
