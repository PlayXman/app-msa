import jsonpRequest from '../Helpers/jsonpRequest';
import { Config } from '../../config';
import Url from '../Helpers/Url';
import GiantBombDb from '../Db/Vendors/GiantBomb';

/**
 * Vendor handler
 */
class GiantBomb {
	/**
	 * Formats date
	 * @param {string|null} ord original_release_date
	 * @param {string|null} erm expected_release_month
	 * @param {string|null} erd expected_release_day
	 * @param {string|null} erq expected_release_quarter
	 * @param {string|null} ery expected_release_year
	 * @returns {string} date
	 */
	static formatDate = function (ord, erd, erm, erq, ery) {
		if (ord) {
			const dateObj = new Date(ord);
			return `${dateObj.getFullYear()}-${dateObj.getMonth() + 1}-${dateObj.getDate()}`;
		} else {
			let date = [];

			if (erm) {
				if (ery) date.push(ery);
				date.push(erm);
				if (erd) date.push(erd);

				date = date.join('-');
			} else if (erq) {
				date.push(`Q${erq}`);
				if (ery) date.push(ery);

				date = date.join(' ');
			} else if (ery) {
				date = ery;
			}

			return date.length ? date : '';
		}
	};

	/**
	 *
	 * @param gameTitle
	 * @param {function(Object[]|null)} callback It's called at the end. Returns objects for items or null if error
	 */
	static searchGame(gameTitle, callback) {
		GiantBombDb.getApiKey()
			.then((apiKey) => {
				const urlParams = new URLSearchParams({
					api_key: apiKey,
					format: 'jsonp',
					query: Url.encodeText(gameTitle),
					field_list:
						'name,id,image,original_release_date,expected_release_day,expected_release_month,expected_release_quarter,expected_release_year',
					resources: 'game',
				});

				jsonpRequest(`${Config.vendors.giantBombCom.apiUrl}search/?${urlParams.toString()}`)
					.then((data) => {
						if (data.error === 'OK') {
							callback(data.results);
						} else {
							// vendor returned error
							console.error('GiantBomb responded with error');
							callback(null);
						}
					})
					.catch((err) => {
						// connection error (usually 404)
						console.error(err);
						callback(null);
					});
			})
			.catch(() => {
				callback(null);
			});
	}

	/**
	 * According the ids it gets games from vendor
	 * @param {string[]} gamesIds Ids of items saved in DB
	 * @param {function(Object[]|null)} callback It's called at the end. Returns objects for items or null if error
	 */
	static getGames(gamesIds, callback) {
		GiantBombDb.getApiKey()
			.then((apiKey) => {
				const urlParams = {
					api_key: apiKey,
					format: 'jsonp',
					sort: 'name:asc',
					offset: 0,
					field_list:
						'name,id,image,original_release_date,expected_release_day,expected_release_month,expected_release_quarter,expected_release_year',
					filter: `id:${gamesIds.join('|')}`,
				};

				this._fetchAllGames(urlParams, gamesIds.length, [], callback);
			})
			.catch(() => {
				callback(null);
			});
	}

	/**
	 * Recursive fce. It's fetching games according the ids. Vendor has limit of 100 items per request. That's why
	 * multiple requests
	 * @param {{}} urlParamsObj Url parameters
	 * @param {number} itemCount Total items count saved in DB
	 * @param {Object[]} items Returned and parsed items from vendor
	 * @param {function} callback It's called at the end or at error
	 * @private
	 */
	static _fetchAllGames(urlParamsObj, itemCount, items, callback) {
		const limit = 100;

		if (urlParamsObj.offset <= itemCount) {
			// not in limit; fetch
			const urlParams = new URLSearchParams(urlParamsObj);
			jsonpRequest(`${Config.vendors.giantBombCom.apiUrl}games/?${urlParams.toString()}`)
				.then((data) => {
					if (data.error === 'OK') {
						urlParamsObj.offset += limit;
						items = items.concat(data.results);

						this._fetchAllGames(urlParamsObj, itemCount, items, callback);
					} else {
						// vendor returned error
						console.error('GiantBomb responded with error');
						callback(null);
					}
				})
				.catch((err) => {
					// connection error (usually 404)
					console.error(err);
					callback(null);
				});
		} else {
			// limit reached; return
			callback(items);
		}
	}
}

export default GiantBomb;
