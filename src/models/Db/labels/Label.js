class Label {
	params = {
		key: '',
		count: 0,
	};

	/**
	 * @param {string} key
	 */
	set key(key) {
		this.params.key = key;
	}

	/**
	 * @returns {string}
	 */
	get key() {
		return this.params.key;
	}

	/**
	 * @param {number} count
	 */
	set count(count) {
		this.params.count = count;
	}

	/**
	 * @returns {number}
	 */
	get count() {
		return this.params.count;
	}

	/**
	 * Creates a new key from "name"
	 * @param {string} name
	 */
	newKey(name) {
		let key = name.toLowerCase();
		key = key
			.split(/[\s-_]/g)
			.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
			.join('');
		this.params.key = key;
	}
}

export default Label;
