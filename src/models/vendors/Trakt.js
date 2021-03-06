import { Config } from '../../config';
import TraktDb from '../Db/Vendors/Trakt';

/**
 * Functions over "Trakt.tv" api
 */
class Trakt {
	accessToken = '';
	keys = {
		clientId: '',
		clientSecret: '',
	};
	redirectUri = '';

	constructor() {
		this.redirectUri = window.location.origin + window.location.pathname;
	}

	/**
	 * Authenticates user with Trakt. Prepares all tokens needed for further communication
	 * @return {Promise}
	 */
	authenticate() {
		return new Promise((resolve, reject) => {
			TraktDb.getApiKeys()
				.then((apiKeys) => {
					if (!apiKeys) {
						reject();
						return false;
					}

					this.keys.clientId = apiKeys.clientId;
					this.keys.clientSecret = apiKeys.clientSecret;

					if (!apiKeys.refreshToken) {
						// no refresh token
						this._refreshTokenByCode().then((refreshToken) => {
							TraktDb.setRefreshToken(refreshToken)
								.then(() => {
									resolve();
								})
								.catch(() => {
									reject();
								});
						});
					} else if (!this.accessToken.length) {
						// no access token
						this._accessTokenByRefreshToken(apiKeys.refreshToken).then(
							(refreshToken) => {
								TraktDb.setRefreshToken(refreshToken)
									.then(() => {
										resolve();
									})
									.catch(() => {
										reject();
									});
							}
						);
					} else {
						// have all
						resolve();
					}
				})
				.catch(() => {
					reject();
				});
		});
	}

	/**
	 * Saves movie(s) by id in Trakt user watchlist
	 * @param {string[]|number[]} tmdbId Tmdb ids
	 * @return {Promise}
	 */
	addToWatchlist(tmdbId) {
		return new Promise((resolve, reject) => {
			const movies = [];
			tmdbId.forEach((id) => {
				movies.push({
					ids: {
						tmdb: id,
					},
				});
			});

			fetch(`${Config.vendors.traktTv.apiUrl}sync/watchlist`, {
				headers: this._getHeader(),
				method: 'POST',
				body: JSON.stringify({
					movies: movies,
				}),
				cache: 'no-cache',
			})
				.then((response) => {
					if (!response.ok) {
						throw new Error('Not saved in watchlist');
					}

					resolve();
				})
				.catch(() => {
					reject();
				});
		});
	}

	/**
	 * Removes movie(s) by id from Trakt user watchlist
	 * @param {string[]|number[]} tmdbId Tmdb ids
	 * @return {Promise}
	 */
	removeFromWatchlist(tmdbId) {
		return new Promise((resolve, reject) => {
			const movies = [];
			tmdbId.forEach((id) => {
				movies.push({
					ids: {
						tmdb: id,
					},
				});
			});

			fetch(`${Config.vendors.traktTv.apiUrl}sync/watchlist/remove`, {
				headers: this._getHeader(),
				method: 'POST',
				body: JSON.stringify({
					movies: movies,
				}),
				cache: 'no-cache',
			})
				.then((response) => {
					if (!response.ok) {
						throw new Error('Not removed from watchlist');
					}

					resolve();
				})
				.catch(() => {
					reject();
				});
		});
	}

	/**
	 * Fetches all movies from user's Trakt watchlist
	 * @return {Promise<Array>}
	 */
	getAllMoviesFromWatchlist() {
		return fetch(`${Config.vendors.traktTv.apiUrl}sync/watchlist/movies`, {
			method: 'GET',
			headers: this._getHeader(),
			cache: 'no-cache',
		}).then((response) => {
			if (!response.ok) {
				throw new Error('Trakt connection error');
			}

			return response.json();
		});
	}

	/**
	 * Fetches all movies from user's Trakt collection
	 * @returns {Promise<any>}
	 */
	getAllCollectedMovies() {
		return fetch(`${Config.vendors.traktTv.apiUrl}sync/collection/movies`, {
			method: 'GET',
			headers: this._getHeader(),
			cache: 'no-cache',
		}).then((response) => {
			if (!response.ok) {
				throw new Error('Trakt connection error');
			}

			return response.json();
		});
	}

	/**
	 * Fetches refresh token from Trakt using "code"
	 * @return {Promise<string>} Returns refresh token if fetched
	 * @private
	 */
	_refreshTokenByCode() {
		return new Promise((resolve, reject) => {
			const currentUrl = new URL(window.location.href);
			if (currentUrl.searchParams.get('code')) {
				// "code" obtained

				fetch(`${Config.vendors.traktTv.apiUrl}oauth/token`, {
					headers: {
						'Content-Type': 'application/json',
					},
					method: 'POST',
					body: JSON.stringify({
						code: currentUrl.searchParams.get('code'),
						client_id: this.keys.clientId,
						client_secret: this.keys.clientSecret,
						redirect_uri: this.redirectUri,
						grant_type: 'authorization_code',
					}),
					cache: 'no-cache',
				})
					.then((resolved) => {
						return resolved.json();
					})
					.then((response) => {
						this.accessToken = response.access_token;
						resolve(response.refresh_token);
					})
					.catch((err) => {
						console.log(err);
						reject();
					});
			} else {
				// "code" must be obtained

				const url = new URL(`${Config.vendors.traktTv.traktUrl}oauth/authorize`);
				url.searchParams.set('response_type', 'code');
				url.searchParams.set('client_id', this.keys.clientId);
				url.searchParams.set('redirect_uri', this.redirectUri);
				window.location = url.toString();
			}
		});
	}

	/**
	 * Fetches access token from Trakt using refresh token
	 * @param {string} refreshToken
	 * @return {Promise<string>} Returns refresh token if fetched
	 * @private
	 */
	_accessTokenByRefreshToken(refreshToken) {
		return new Promise((resolve, reject) => {
			fetch(`${Config.vendors.traktTv.apiUrl}oauth/token`, {
				headers: new Headers({
					'Content-Type': 'application/json',
				}),
				method: 'POST',
				body: JSON.stringify({
					refresh_token: refreshToken,
					client_id: this.keys.clientId,
					client_secret: this.keys.clientSecret,
					redirect_uri: this.redirectUri,
					grant_type: 'refresh_token',
				}),
				cache: 'no-cache',
			})
				.then((resolved) => {
					if (resolved.status === 401) {
						throw new Error('Wrong refresh token');
					}

					return resolved.json();
				})
				.then((response) => {
					this.accessToken = response.access_token;
					resolve(response.refresh_token);
				})
				.catch((err) => {
					console.error(err);
					// saved wrong refresh token. Tries to get a new one
					this._refreshTokenByCode()
						.then((refreshToken) => {
							resolve(refreshToken);
						})
						.catch(() => {
							reject();
						});
				});
		});
	}

	/**
	 * Returns header for all data operations
	 * @return {{}}
	 * @private
	 */
	_getHeader() {
		return {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${this.accessToken}`,
			'trakt-api-version': '2',
			'trakt-api-key': this.keys.clientId,
		};
	}
}

export default Trakt;
