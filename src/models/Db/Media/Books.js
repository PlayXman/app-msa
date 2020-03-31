import firebase from 'firebase/app';
import OwnageStatus from '../../Helpers/OwnageStatus';
import Media from './Media';

/** @type {string} database reference path */
const DB_PATH = '/Media/Books';

/**
 * Database model for Books
 */
class Books extends Media {
	/** @type {string} */
	title;
	/** @type {string} OwnageStatus */
	status;
	/** @type {string} */
	note;
	/** @type {string} */
	imageUrl;
	/** @type {string} */
	releaseDate;
	/** @type {string} */
	infoUrl;

	/**
	 * Reference for all items in DB
	 * @return {firebase.database.Reference}
	 */
	static dbRef() {
		return firebase.database().ref(DB_PATH);
	}

	/**
	 * Sets defaults to all params
	 * @return {Books}
	 */
	setDefaults() {
		this.title = '';
		this.status = OwnageStatus.getDefault();
		this.note = '';
		this.imageUrl = '';
		this.releaseDate = '';
		this.infoUrl = '';
		return this;
	}

	/**
	 * Sets db path
	 * @return {string}
	 * @private
	 */
	_getDbRef() {
		return DB_PATH;
	}
}

export default Books;
