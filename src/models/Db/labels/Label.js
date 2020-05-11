class Label {
	params = {
		key: '',
		count: 0,
	};

	/**
	 * @param {string} name
	 */
	set key(name) {
		let key = name.toLowerCase();
		key = key
			.split(/[\s-_]/g)
			.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
			.join('');
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
}

export default Label;
