import MediaModel from './MediaModel';
import Games from '../Db/Media/Games';
import GiantBomb from '../vendors/GiantBomb';
import Notification from '../Notification';
import Url from '../Helpers/Url';
import { Config } from '../../config';
import WarezBB from '../vendors/WarezBB';

/**
 * Media model for Games
 */
class GamesMediaModel extends MediaModel {
	/**
	 * Returns ref to all DB items
	 * @return {firebase.database.Reference}
	 */
	getDbRef() {
		return Games.dbRef();
	}

	/**
	 * New instance of Games db item
	 * @return {Games}
	 */
	createItem() {
		return new Games();
	}

	/**
	 * Finds out that game is released.
	 * @param {string} date
	 * @return {boolean}
	 */
	isReleased(date) {
		const releaseDate = new Date(date);
		const now = new Date();
		return releaseDate <= now;
	}

	/**
	 * Shows info about game
	 * @param {string} title Game title
	 */
	showItemInfo(title) {
		Url.openNewTab(Config.vendors.gamesCz.searchUrl + Url.encodeText(title));
	}

	/**
	 * Opens warez-bb.org forum with pre-searched item
	 * @param {string} title
	 */
	downloadItem(title) {
		WarezBB.searchFor(title, Config.vendors.warezBbOrg.forumId.games);
	}

	/**
	 * Refreshes all items meta data. Downloads images, gets titles etc.
	 */
	handleItemsRefresh = () => {
		const loaderMsg = 'Refreshing games...';

		super.handleItemsRefresh(loaderMsg);
	};

	/**
	 * Search items with name similar as searched text
	 * @param {string} title Game title
	 * @return {Promise<Games[]>}
	 */
	searchItem = (title) => {
		return new Promise((resolve, reject) => {
			const loader = new Notification(true);
			loader.setText('Searching...');
			loader.show();

			GiantBomb.searchGame(title, (response) => {
				if (response) {
					const items = [];

					response.forEach((item) => {
						const game = this._createGameItem(item);
						items.push(game);
					});

					resolve(items);
					loader.hide();
				} else {
					// nothing returned
					loader.hide();
					const msg = new Notification();
					msg.setText('Error during the search');
					msg.showAndHide();

					reject();
				}
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
			loader.setText('Saving game...');
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
						const newGame = this.createItem();
						newGame.setId(itemId);
						newGame.setDefaults();
						newGame.push().then(() => {
							this._updateDbItems([itemId], loader, 'Saved');

							resolve({
								alreadySaved: false,
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
	 * Updates metadata of all games in DB
	 * @param {string[]} gamesIds Game ids which should be updated
	 * @param {Notification} loader Loader to changed/close
	 * @param {string} loaderMsg Loader message
	 * @private
	 */
	_updateDbItems(gamesIds, loader, loaderMsg) {
		let done = 0;
		const total = gamesIds.length;

		GiantBomb.getGames(gamesIds, (response) => {
			if (response) {
				response.forEach((item) => {
					// update games
					const game = this._createGameItem(item);
					game.push().finally(() => {
						//update loader
						done++;
						loader.setText(`${loaderMsg} ${done}/${total}`);

						if (done >= total) {
							loader.hide();
						}
					});
				});
			} else {
				// nothing returned
				loader.hide();
				const msg = new Notification();
				msg.setText('Error during the sync');
				msg.showAndHide();
			}
		});
	}

	/**
	 * Prepares Games DB object with data from GiantBomb fetch
	 * @param {{}} giantBombItemObj One item object fetched from GiantBomb
	 * @return {Games}
	 * @private
	 */
	_createGameItem(giantBombItemObj) {
		const game = this.createItem();
		game.setId(giantBombItemObj.id);
		game.title = giantBombItemObj.name;
		game.imageUrl =
			giantBombItemObj.image && giantBombItemObj.image.small_url
				? giantBombItemObj.image.small_url
				: '';
		game.releaseDate = GiantBomb.formatDate(
			giantBombItemObj.original_release_date,
			giantBombItemObj.expected_release_day,
			giantBombItemObj.expected_release_month,
			giantBombItemObj.expected_release_quarter,
			giantBombItemObj.expected_release_year
		);

		return game;
	}
}

export default GamesMediaModel;
