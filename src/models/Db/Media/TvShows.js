import firebase from 'firebase/app';
import OwnageStatus from '../../Helpers/OwnageStatus';
import Media from './Media';

/** @type {string} database reference path */
const DB_PATH = '/Media/TvShows';

/**
 * Database model for TvShows
 */
class TvShows extends Media {
	/** @type {string} */
	title;
	/** @type {string} OwnageStatus */
	status;
	/** @type {string[]} */
	labels;
	/** @type {string} */
	imageUrl;
	/** @type {string} */
	releaseDate;

	/**
	 * Reference for all items in DB
	 * @return {firebase.database.Reference}
	 */
	static dbRef() {
		return firebase.database().ref(DB_PATH);
	}

	/**
	 * Sets defaults to all params
	 * @return {TvShows}
	 */
	setDefaults() {
		this.title = '';
		this.status = OwnageStatus.getDefault();
		this.labels = [];
		this.imageUrl = '';
		this.releaseDate = '';
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

export default TvShows;
