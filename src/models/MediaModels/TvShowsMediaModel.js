import MediaModel from './MediaModel';
import Notification from '../Notification';
import Url from '../Helpers/Url';
import { Config } from '../../config';
import MovieDb from 'moviedb-promise';
import TmdbDb from '../Db/Vendors/Tmdb';
import GlobalStorage, { STORAGE_NAMES } from '../Helpers/GlobalStorage/GlobalStorage';
import OwnageStatus from '../Helpers/OwnageStatus';
import TvShows from '../Db/Media/TvShows';

/**
 * Media model for TvShows
 */
class TvShowsMediaModel extends MediaModel {
	name = 'tvShows';

	/**
	 * Returns ref to all DB items
	 * @return {firebase.database.Reference}
	 */
	getDbRef() {
		return TvShows.dbRef();
	}

	/**
	 * New instance of TvShows db item
	 * @return {TvShows}
	 */
	createItem() {
		return new TvShows();
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
	 * Shows info about tv show
	 * @param {"csfd" | "imdb" | "trakt" | string} vendor
	 * @param {string} title Tv Show title
	 */
	showItemInfo(vendor, title) {
		let searchUrl = '';

		switch (vendor) {
			case 'trakt':
				searchUrl = Config.vendors.traktTv.searchUrl;
				break;
			case 'csfd':
				searchUrl = Config.vendors.csfdCz.tvShowSearchUrl;
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
	 * Refreshes all items metadata. Downloads images, gets titles etc.
	 */
	handleItemsRefresh = () => {
		const loaderMsg = 'Refreshing tv shows...';

		super.handleItemsRefresh(loaderMsg);
	};

	/**
	 * Search items with name similar as searched text
	 * @param {string} title Game title
	 * @return {Promise<TvShows[]>}
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
				tmdb.searchTv({
					query: title,
				})
					.then((response) => {
						if (response.total_results) {
							const searchItems = response.results;
							const length = searchItems.length < 10 ? searchItems.length : 10;
							const items = [];

							for (let i = 0; i < length; i++) {
								const item = searchItems[i];
								const tvShow = this.createItem();
								tvShow.setId(item.id);
								tvShow.title = item.name;
								tvShow.imageUrl = item.poster_path
									? Config.vendors.tmdbOrg.imageUrl.icon + item.poster_path
									: '';
								tvShow.releaseDate = item.first_air_date || '';

								items.push(tvShow);
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
			loader.setText('Saving tv show...');
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
						const newTvShow = this.createItem();
						newTvShow.setId(itemId);
						newTvShow.setDefaults();
						newTvShow.push().then(() => {
							this._updateDbItems([itemId], loader, 'Saved');
							const trakt = GlobalStorage.getState(STORAGE_NAMES.trakt);
							trakt.addToWatchlist([itemId], 'shows').then(() => {
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
			.removeFromWatchlist([id], 'shows')
			.then(() => {
				loader.hide();
				super.removeItem(id);
			})
			.catch(() => {
				loader.hide();
			});
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
			.getAllItemsFromWatchlist('shows')
			.then((traktItems) => {
				this.getDbRef()
					.once('value')
					.then((snap) => {
						const toAdd = [];
						const dbItems = snap.val() || {};
						const count = traktItems.length;

						// find synced items
						for (let i = 0; i < count; i++) {
							const tmdbId = traktItems[i].show.ids.tmdb;
							if (tmdbId != null) {
								if (dbItems[tmdbId]) {
									delete dbItems[tmdbId];
								} else {
									toAdd.push(tmdbId);
								}
							}
						}

						// remove what's not in watchlist
						Object.keys(dbItems).forEach((id) => {
							const tvShow = this.createItem();
							tvShow.setId(id).remove();
						});

						// add what's only in watchlist
						if (toAdd.length) {
							// something to add
							let done = 0;
							const total = toAdd.length;

							toAdd.forEach((id) => {
								const tvShow = this.createItem();
								tvShow
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
	 * Updates metadata of all tv shows by id in DB
	 * @param {string[]} tvShowIds Tv show ids which should be updated
	 * @param {Notification} loader Loader to changed/close
	 * @param {string} loaderMsg Loader message
	 * @private
	 */
	_updateDbItems(tvShowIds, loader, loaderMsg) {
		let done = 0;
		const total = tvShowIds.length;

		TmdbDb.getApiKey().then((apiKey) => {
			if (!apiKey) {
				loader.hide();
			}

			const tmdb = new MovieDb(apiKey);

			tvShowIds.forEach((tvShowId) => {
				tmdb.tvInfo({
					id: tvShowId,
				})
					.then((tvShowData) => {
						const tvShow = this.createItem();
						tvShow.setId(tvShowId);
						tvShow.title = tvShowData.name;
						tvShow.imageUrl = tvShowData.poster_path
							? Config.vendors.tmdbOrg.imageUrl.thumb + tvShowData.poster_path
							: '';
						tvShow.releaseDate = tvShowData.first_air_date || '';
						tvShow.push();
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
			.getAllCollectedItems('shows')
			.then((traktItems) => {
				traktItems.forEach((traktItem) => {
					const id = traktItem.show.ids.tmdb;
					if (allDbItems[id] && allDbItems[id].status !== OwnageStatus.statuses.OWNED) {
						const tvShow = this.createItem();
						tvShow.setId(id);
						tvShow.status = OwnageStatus.statuses.OWNED;
						tvShow.push();
					}
				});
			})
			.catch((err) => {
				console.log(err);
			});
	}
}

export default TvShowsMediaModel;
