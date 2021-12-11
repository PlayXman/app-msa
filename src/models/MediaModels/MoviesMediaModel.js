import MediaModel from './MediaModel';
import Movies from '../Db/Media/Movies';
import Notification from '../Notification';
import Url from '../Helpers/Url';
import { Config } from '../../config';
import MovieDb from 'moviedb-promise';
import TmdbDb from '../Db/Vendors/Tmdb';
import GlobalStorage, { STORAGE_NAMES } from '../Helpers/GlobalStorage/GlobalStorage';
import OwnageStatus from '../Helpers/OwnageStatus';

/**
 * Media model for Movies
 */
class MoviesMediaModel extends MediaModel {
	name = 'movies';

	/**
	 * Returns ref to all DB items
	 * @return {firebase.database.Reference}
	 */
	getDbRef() {
		return Movies.dbRef();
	}

	/**
	 * New instance of Movies db item
	 * @return {Movies}
	 */
	createItem() {
		return new Movies();
	}

	/**
	 * Finds out that movie is released.
	 * @param {string} date
	 * @return {boolean}
	 */
	isReleased(date) {
		const releaseDate = new Date(date);
		const now = new Date();
		return releaseDate <= now;
	}

	/**
	 * Shows info about movie
	 * @param {"csfd" | "imdb" | "trakt" | string} vendor
	 * @param {string} title Movie title
	 */
	showItemInfo(vendor, title) {
		let searchUrl = '';

		switch (vendor) {
			case 'trakt':
				searchUrl = Config.vendors.traktTv.searchUrl;
				break;
			case 'csfd':
				searchUrl = Config.vendors.csfdCz.searchUrl;
				break;
			case 'imdb':
			default:
				searchUrl = Config.vendors.imdbCom.searchUrl;
		}

		if (searchUrl.length) {
			Url.openNewTab(searchUrl + Url.encodeText(title));
		}
	}

	/**
	 * Refreshes all items meta data. Downloads images, gets titles etc.
	 */
	handleItemsRefresh = () => {
		const loaderMsg = 'Refreshing movies...';

		super.handleItemsRefresh(loaderMsg);
	};

	/**
	 * Search items with name similar as searched text
	 * @param {string} title Game title
	 * @return {Promise<Movies[]>}
	 */
	searchItem = (title) => {
		return new Promise((resolve, reject) => {
			const loader = new Notification(true);
			loader.setText('Searching...');
			loader.show();

			TmdbDb.getApiKey().then((apiKey) => {
				if (!apiKey) {
					loader.hide();
					reject();
				}

				const tmdb = new MovieDb(apiKey);
				tmdb.searchMovie({
					query: title,
				})
					.then((response) => {
						if (response.total_results) {
							const searchItems = response.results;
							const length = searchItems.length < 10 ? searchItems.length : 10;
							const items = [];

							for (let i = 0; i < length; i++) {
								const item = searchItems[i];
								const movie = this.createItem();
								movie.setId(item.id);
								movie.title = item.title;
								movie.imageUrl = item.poster_path
									? Config.vendors.tmdbOrg.imageUrl.icon + item.poster_path
									: '';
								movie.releaseDate = item.release_date;

								items.push(movie);
							}

							resolve(items);
						} else {
							// nothing found
							resolve([]);
						}

						loader.hide();
					})
					.catch((err) => {
						console.log(err);
						loader.hide();
						const msg = new Notification();
						msg.setText('Error during the search');
						msg.showAndHide();

						reject();
					});
			});
		});
	};

	/**
	 * Add new item to DB
	 * @param {string} itemId Media item ID
	 * @return {Promise<{alreadySaved: boolean}>} `Object.alreadySaved` says if the item was already saved in DB
	 */
	addItem = (itemId) => {
		return new Promise((resolve, reject) => {
			const loader = new Notification(true);
			loader.setText('Saving movie...');
			loader.show();

			this.getDbRef()
				.child(itemId)
				.once('value')
				.then((snap) => {
					if (snap.val()) {
						loader.hide();
						resolve({
							alreadySaved: true,
						});
					} else {
						const newMovie = this.createItem();
						newMovie.setId(itemId);
						newMovie.setDefaults();
						newMovie.push().then(() => {
							this._updateDbItems([itemId], loader, 'Saved');
							const trakt = GlobalStorage.getState(STORAGE_NAMES.trakt);
							trakt.addToWatchlist([itemId], 'movies').then(() => {
								resolve({
									alreadySaved: false,
								});
							});
						});
					}
				})
				.catch((err) => {
					console.error(err);
					loader.hide();
					reject();
				});
		});
	};

	/**
	 * Removes item from Trakt watchlist and DB
	 * @param {string|number} id Item ID
	 */
	removeItem(id) {
		const loader = new Notification(true);
		loader.setText('Removing from watchlist...');
		loader.show();

		const trakt = GlobalStorage.getState(STORAGE_NAMES.trakt);
		trakt
			.removeFromWatchlist([id], 'movies')
			.then(() => {
				loader.hide();
				super.removeItem(id);
			})
			.catch(() => {
				loader.hide();
			});
	}

	/**
	 * Marks the item in Trakt as watched and removes it from DB. The item is auto removed from Trakt's watchlist if marked as watched
	 * @param {string|number} id Media item id
	 * @return {Promise<void>}
	 */
	async markItemAsWatched(id) {
		const loader = new Notification(true);
		loader.setText('Adding to watched history...');
		loader.show();

		const trakt = GlobalStorage.getState(STORAGE_NAMES.trakt);

		try {
			await trakt.markAsWatched([id], 'movies');
			loader.hide();
			await this._removeItemFromDb(id);
		} catch (e) {
			loader.hide();
			const msg = new Notification();
			msg.setText('Failed to set item as watched');
			msg.showAndHide();
		}
	}

	/**
	 * Synchronizes Trakt watchlist with DB. Removes DB items if they're not in watchlist. Adds new items which are not
	 * in DB
	 */
	syncItems() {
		const loaderMsg = 'Syncing with Trakt...';
		const loader = new Notification(true);
		loader.setText(loaderMsg);
		loader.show();

		const trakt = GlobalStorage.getState(STORAGE_NAMES.trakt);
		trakt
			.getAllItemsFromWatchlist('movies')
			.then((traktItems) => {
				this.getDbRef()
					.once('value')
					.then((snap) => {
						const toAdd = [];
						const dbItems = snap.val() || {};
						const count = traktItems.length;

						// find synced items
						for (let i = 0; i < count; i++) {
							const tmdbId = traktItems[i].movie.ids.tmdb;
							if (dbItems[tmdbId]) {
								delete dbItems[tmdbId];
							} else {
								toAdd.push(tmdbId);
							}
						}

						// remove what's not in watchlist
						Object.keys(dbItems).forEach((id) => {
							const movie = this.createItem();
							movie.setId(id).remove();
						});

						// add what's only in watchlist
						if (toAdd.length) {
							// something to add
							let done = 0;
							const total = toAdd.length;

							toAdd.forEach((id) => {
								const movie = this.createItem();
								movie
									.setDefaults()
									.setId(id)
									.push()
									.then(() => {
										done++;
										if (done >= total) {
											// get metadata
											this._updateDbItems(toAdd, loader, loaderMsg);
											this._updateCollectedItems(snap.val());
										}
									});
							});
						} else {
							// nothing to add
							this._updateCollectedItems(snap.val());
							loader.hide();
						}
					});
			})
			.catch((err) => {
				console.log(err);
				loader.hide();
				const msg = new Notification();
				msg.setText('Watchlist sync error');
				msg.showAndHide();
			});
	}

	/**
	 * Updates metadata of all movies by id in DB
	 * @param {string[]} moviesIds Movie ids which should be updated
	 * @param {Notification} loader Loader to changed/close
	 * @param {string} loaderMsg Loader message
	 * @private
	 */
	_updateDbItems(moviesIds, loader, loaderMsg) {
		let done = 0;
		const total = moviesIds.length;

		TmdbDb.getApiKey().then((apiKey) => {
			if (!apiKey) {
				loader.hide();
			}

			const tmdb = new MovieDb(apiKey);

			moviesIds.forEach((movieId) => {
				tmdb.movieInfo({
					id: movieId,
				})
					.then((movieData) => {
						const movie = this.createItem();
						movie.setId(movieId);
						movie.title = movieData.title;
						movie.imageUrl = movieData.poster_path
							? Config.vendors.tmdbOrg.imageUrl.thumb + movieData.poster_path
							: '';
						movie.releaseDate = movieData.release_date || '';
						movie.push();
					})
					.finally(() => {
						done++;
						loader.setText(`${loaderMsg} ${done}/${total}`);

						if (done >= total) {
							loader.hide();
						}
					});
			});
		});
	}

	_updateCollectedItems(allDbItems) {
		GlobalStorage.getState(STORAGE_NAMES.trakt)
			.getAllCollectedItems('movies')
			.then((traktItems) => {
				traktItems.forEach((traktItem) => {
					const id = traktItem.movie.ids.tmdb;
					if (allDbItems[id] && allDbItems[id].status !== OwnageStatus.statuses.OWNED) {
						const movie = this.createItem();
						movie.setId(id);
						movie.status = OwnageStatus.statuses.OWNED;
						movie.push();
					}
				});
			})
			.catch((err) => {
				console.log(err);
			});
	}
}

export default MoviesMediaModel;
