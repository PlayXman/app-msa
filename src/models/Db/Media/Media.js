import { database } from 'firebase/app';
import Url from '../../Helpers/Url';

class Media {
	/** @type {string} */
	_id = '';
	/** @type {string} */
	sort = '';
	/** @type {string} */
	title;

	/**
	 * @return {string}
	 */
	getId() {
		return this._id;
	}

	/**
	 * @param {string} id
	 * @return {Media}
	 */
	setId(id) {
		this._id = id;
		return this;
	}

	/**
	 * Sets default values to all parameters
	 * @return {this}
	 */
	setDefaults() {
		//@OVERRIDE should be defined
	}

	/**
	 * Fills this instance with data. Keys must be same as the object expects
	 * @param {{}} dbObj Object from DB snapshot
	 * @return {this}
	 */
	fillObj(dbObj) {
		Object.keys(dbObj).forEach((paramName) => {
			if (paramName === 'title') {
				this._setSort(dbObj[paramName]);
			}
			this[paramName] = dbObj[paramName];
		});

		return this;
	}

	/**
	 * Pushes data to DB
	 * @return {Promise<any>}
	 */
	push() {
		if (this._id.length === 0) {
			throw new Error('Missing id!');
		}
		if (this.title) {
			this._setSort(this.title);
		}

		const obj = this._prepareDbObj();
		return database().ref(`${this._getDbRef()}/${this.getId()}`).update(obj);
	}

	/**
	 * Removes object from DB
	 * @return {Promise<any>}
	 */
	remove() {
		if (this._id.length === 0) {
			throw new Error('Missing id!');
		}

		return database().ref(`${this._getDbRef()}/${this.getId()}`).remove();
	}

	/**
	 * Sets sort param
	 * @param {string} text
	 * @private
	 */
	_setSort(text) {
		this.sort = Url.slugify(text);
	}

	/**
	 * @return {string} Ref path to DB object "table" (eg. "/users")
	 * @private
	 */
	_getDbRef() {
		//@OVERRIDE Must be defined
	}

	/**
	 * Gets all class parameters and creates object only with filled ones. Creates object for db push
	 * @private
	 */
	_prepareDbObj() {
		const params = Object.getOwnPropertyNames(this);
		let obj = {};

		params.forEach((key) => {
			if (this[key] !== undefined && key !== '_id') {
				obj[key] = this[key];
			}
		});

		return obj;
	}
}

export default Media;
