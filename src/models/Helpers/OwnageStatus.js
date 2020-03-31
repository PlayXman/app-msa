/**
 * Handles media item statuses. Changes statuses, defines default status etc.
 */
class OwnageStatus {
	static statuses = {
		DEFAULT: 'DEFAULT',
		DOWNLOADABLE: 'DOWNLOADABLE',
		OWNED: 'OWNED',
	};

	/**
	 * Returns next state
	 * @param {string} currentState One of `OwnageState.statuses.*`
	 * @return {string}
	 */
	static getNext(currentState) {
		const keys = Object.getOwnPropertyNames(OwnageStatus.statuses);
		const currIndex = keys.indexOf(currentState);
		const nextIndex = (currIndex + 1) % keys.length;

		return keys[nextIndex];
	}

	/**
	 * @return {string} Default start state
	 */
	static getDefault() {
		return this.statuses.DEFAULT;
	}
}

export default OwnageStatus;
