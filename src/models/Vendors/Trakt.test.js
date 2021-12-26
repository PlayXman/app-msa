import Trakt from "./Trakt";
import TraktDb from "../Db/Vendors/Trakt";

describe('Trakt', () => {
	const fetchMock = jest.spyOn(global, 'fetch');

	afterEach(() => {
		fetchMock.mockReset();
	})

	afterAll(() => {
		fetchMock.mockRestore();
	})

	describe('.authenticate', () => {
		const windowLocationMock = jest.spyOn(window, 'location', 'get').mockReturnValue(new URL('http://dummy.com/some/path?param=1'));
		const getApiKeysMock = jest.spyOn(TraktDb, 'getApiKeys')
		const setRefreshTokenMock = jest.spyOn(TraktDb, 'setRefreshToken')

		afterEach(() => {
			windowLocationMock.mockClear();
			getApiKeysMock.mockReset();
			setRefreshTokenMock.mockReset();
		});

		afterAll(() => {
			windowLocationMock.mockRestore();
			getApiKeysMock.mockRestore();
			setRefreshTokenMock.mockRestore();
		});

		test('redirectUri used by refresh and access token generations', () => {
			const trakt = new Trakt();

			expect(windowLocationMock).toHaveBeenCalled();
			expect(trakt.redirectUri).toBe('http://dummy.com/some/path');
		});

		test('.authenticate no api keys', async () => {
			getApiKeysMock.mockRejectedValue('Error value');

			const t = new Trakt();

			await expect(t.authenticate()).rejects.toBeUndefined();
			expect(getApiKeysMock).toHaveBeenCalled();

			getApiKeysMock.mockResolvedValue(null);
			await expect(t.authenticate()).rejects.toBeUndefined();
		});

		test('.authenticate access and refresh tokens are correct', async () => {
			const t = new Trakt();
			t.accessToken = 'a123';

			getApiKeysMock.mockResolvedValue({
				clientId: 'Client ID',
				clientSecret: 'Client Secret',
				refreshToken: 'r123'
			});

			await expect(t.authenticate()).resolves.toBeUndefined();
		});

		test('.authenticate refresh token re-fetch', async () => {
			const t = new Trakt();

			// No "code" search param in the url
			getApiKeysMock.mockResolvedValue({
				clientId: 'Client ID',
				clientSecret: 'Client Secret'
			});

			const spyOnHref = jest.spyOn(window.location, 'href', 'set');

			await expect(t.authenticate()).rejects.toBeUndefined();
			expect(spyOnHref).toHaveBeenCalledWith('https://trakt.tv/oauth/authorize?response_type=code&client_id=Client+ID&redirect_uri=http%3A%2F%2Fdummy.com%2Fsome%2Fpath');
			spyOnHref.mockReset();


			windowLocationMock.mockReturnValue(new URL('http://dummy.com/some/path?code=c123'));

			// Communication error
			fetchMock.mockRejectedValue('No connection');
			await expect(t.authenticate()).rejects.toBeUndefined();
			expect(fetchMock).toHaveBeenCalled();

			// Server returned access and refresh token but not saved in DB
			fetchMock.mockResolvedValueOnce({
				async json() {
					return {
						access_token: 'a132_1',
						refresh_token: 'r132_1'
					}
				}
			}).mockResolvedValueOnce({
				async json() {
					return {
						access_token: 'a132_2',
						refresh_token: 'r132_2'
					}
				}
			});
			setRefreshTokenMock.mockRejectedValue(undefined);

			await expect(t.authenticate()).rejects.toBeUndefined();
			expect(t.accessToken).toBe('a132_1');
			expect(setRefreshTokenMock).toHaveBeenCalledWith('r132_1');

			// Server returned access and refresh token with saved refresh token in DB
			setRefreshTokenMock.mockResolvedValue(undefined);
			await expect(t.authenticate()).resolves.toBeUndefined();
			expect(t.accessToken).toBe('a132_2');
			expect(setRefreshTokenMock).toHaveBeenCalledWith('r132_2');
		});

		test('.authenticate accessToken re-fetch', async () => {
			getApiKeysMock.mockResolvedValue({
				clientId: 'Client ID',
				clientSecret: 'Client Secret',
				refreshToken: 'r123'
			});

			// Wrong refresh token saved, failed to save in DB
			let t = new Trakt();

			fetchMock.mockRejectedValueOnce(async () => {
				throw new Error('Connection error')
			}).mockResolvedValueOnce({
				async json() {
					return {
						access_token: 'a123',
						refresh_token: 'r123'
					}
				}
			});
			windowLocationMock.mockReturnValue(new URL('http://dummy.com/some/path?code=c123'));
			setRefreshTokenMock.mockRejectedValue(undefined);

			await expect(t.authenticate()).rejects.toBeUndefined();
			expect(t.accessToken).toBe('a123');

			// Wrong refresh token saved, successful save in DB
			t = new Trakt();

			fetchMock.mockRejectedValueOnce(async () => {
				throw new Error('Connection error')
			}).mockResolvedValueOnce({
				async json() {
					return {
						access_token: 'a123_2',
						refresh_token: 'r123_2'
					}
				}
			});
			setRefreshTokenMock.mockResolvedValue(undefined);

			await expect(t.authenticate()).resolves.toBeUndefined();
			expect(t.accessToken).toBe('a123_2');

			// Refresh token saved
			t = new Trakt();

			fetchMock.mockResolvedValueOnce({
				async json() {
					return {
						access_token: 'a123_3',
						refresh_token: 'r123_3'
					}
				}
			});

			await expect(t.authenticate()).resolves.toBeUndefined();
			expect(t.accessToken).toBe('a123_3');
		});
	});

	describe('.addToWatchlist', () => {
		let trakt;

		beforeEach(() => {
			trakt = new Trakt();

			trakt.accessToken = 'a789';
			trakt.keys.clientId = 'clientId1';
			trakt.keys.clientSecret = 'clientSecret1';
		});

		test('no ids provided', async () => {
			await expect(trakt.addToWatchlist([], 'movies')).rejects.toBeUndefined();
			await expect(trakt.addToWatchlist([], 'shows')).rejects.toBeUndefined();
			expect(fetchMock).not.toHaveBeenCalled();
		});

		test('no connection', async () => {
			fetchMock.mockRejectedValue('No connection');

			await expect(trakt.addToWatchlist([123], 'movies')).rejects.toBeUndefined();
			await expect(trakt.addToWatchlist([123, 'm111'], 'movies')).rejects.toBeUndefined();
			await expect(trakt.addToWatchlist([123], 'shows')).rejects.toBeUndefined();
			await expect(trakt.addToWatchlist([123, 's111'], 'shows')).rejects.toBeUndefined();

			expect(fetchMock).toHaveBeenCalledTimes(4);
			expect(fetchMock).toHaveBeenLastCalledWith('https://api.trakt.tv/sync/watchlist', {
				"body": "{\"shows\":[{\"ids\":{\"tmdb\":123}},{\"ids\":{\"tmdb\":\"s111\"}}]}",
				"cache": "no-cache",
				"headers": {
					"Authorization": "Bearer a789",
					"Content-Type": "application/json",
					"trakt-api-key": "clientId1",
					"trakt-api-version": "2"
				},
				"method": "POST"
			});
		});

		test('success', async () => {
			fetchMock.mockResolvedValue({
				ok: true
			});

			await expect(trakt.addToWatchlist([123], 'movies')).resolves.toBeUndefined();
			await expect(trakt.addToWatchlist([123, 'm111'], 'movies')).resolves.toBeUndefined();
			await expect(trakt.addToWatchlist([123], 'shows')).resolves.toBeUndefined();
			await expect(trakt.addToWatchlist([123, 's111'], 'shows')).resolves.toBeUndefined();

			expect(fetchMock).toHaveBeenCalledTimes(4);
			expect(fetchMock).toHaveBeenLastCalledWith('https://api.trakt.tv/sync/watchlist', {
				"body": "{\"shows\":[{\"ids\":{\"tmdb\":123}},{\"ids\":{\"tmdb\":\"s111\"}}]}",
				"cache": "no-cache",
				"headers": {
					"Authorization": "Bearer a789",
					"Content-Type": "application/json",
					"trakt-api-key": "clientId1",
					"trakt-api-version": "2"
				},
				"method": "POST"
			});
		});
	});

	describe('.removeFromWatchlist', () => {
		let trakt;

		beforeEach(() => {
			trakt = new Trakt();

			trakt.accessToken = 'a789';
			trakt.keys.clientId = 'clientId1';
			trakt.keys.clientSecret = 'clientSecret1';
		});

		test('no ids provided', async () => {
			await expect(trakt.removeFromWatchlist([], 'movies')).rejects.toBeUndefined();
			await expect(trakt.removeFromWatchlist([], 'shows')).rejects.toBeUndefined();
			expect(fetchMock).not.toHaveBeenCalled();
		});

		test('no connection', async () => {
			fetchMock.mockRejectedValue('No connection');

			await expect(trakt.removeFromWatchlist([123], 'movies')).rejects.toBeUndefined();
			await expect(trakt.removeFromWatchlist([123, 'm111'], 'movies')).rejects.toBeUndefined();
			await expect(trakt.removeFromWatchlist([123], 'shows')).rejects.toBeUndefined();
			await expect(trakt.removeFromWatchlist([123, 's111'], 'shows')).rejects.toBeUndefined();

			expect(fetchMock).toHaveBeenCalledTimes(4);
			expect(fetchMock).toHaveBeenLastCalledWith('https://api.trakt.tv/sync/watchlist/remove', {
				"body": "{\"shows\":[{\"ids\":{\"tmdb\":123}},{\"ids\":{\"tmdb\":\"s111\"}}]}",
				"cache": "no-cache",
				"headers": {
					"Authorization": "Bearer a789",
					"Content-Type": "application/json",
					"trakt-api-key": "clientId1",
					"trakt-api-version": "2"
				},
				"method": "POST"
			});
		});

		test('success', async () => {
			fetchMock.mockResolvedValue({
				ok: true
			});

			await expect(trakt.removeFromWatchlist([123], 'movies')).resolves.toBeUndefined();
			await expect(trakt.removeFromWatchlist([123, 'm111'], 'movies')).resolves.toBeUndefined();
			await expect(trakt.removeFromWatchlist([123], 'shows')).resolves.toBeUndefined();
			await expect(trakt.removeFromWatchlist([123, 's111'], 'shows')).resolves.toBeUndefined();

			expect(fetchMock).toHaveBeenCalledTimes(4);
			expect(fetchMock).toHaveBeenLastCalledWith('https://api.trakt.tv/sync/watchlist/remove', {
				"body": "{\"shows\":[{\"ids\":{\"tmdb\":123}},{\"ids\":{\"tmdb\":\"s111\"}}]}",
				"cache": "no-cache",
				"headers": {
					"Authorization": "Bearer a789",
					"Content-Type": "application/json",
					"trakt-api-key": "clientId1",
					"trakt-api-version": "2"
				},
				"method": "POST"
			});
		});
	});

	describe('.markAsWatched', () => {
		const dateMock = jest.spyOn(Date.prototype, 'toISOString').mockReturnValue(new Date('2022-01-02T12:11:32.00000Z').toISOString());

		let trakt;

		beforeEach(() => {
			trakt = new Trakt();

			trakt.accessToken = 'a789';
			trakt.keys.clientId = 'clientId1';
			trakt.keys.clientSecret = 'clientSecret1';

			dateMock.mockClear();
		});

		afterAll(() => {
			dateMock.mockRestore();
		});

		test('no ids provided', async () => {
			await expect(trakt.markAsWatched([], 'movies')).rejects.toThrowError('No items provided');
			await expect(trakt.markAsWatched([], 'shows')).rejects.toThrowError('No items provided');
			expect(fetchMock).not.toHaveBeenCalled();
		});

		test('no connection', async () => {
			fetchMock.mockRejectedValue('No connection');

			await expect(trakt.markAsWatched([123], 'movies')).rejects.toThrowError('Could not connect to Trakt');
			await expect(trakt.markAsWatched([123, 'm111'], 'movies')).rejects.toThrowError('Could not connect to Trakt');
			await expect(trakt.markAsWatched([123], 'shows')).rejects.toThrowError('Could not connect to Trakt');
			await expect(trakt.markAsWatched([123, 's111'], 'shows')).rejects.toThrowError('Could not connect to Trakt');

			expect(fetchMock).toHaveBeenCalledTimes(4);
			expect(fetchMock).toHaveBeenLastCalledWith('https://api.trakt.tv/sync/history', {
				"body": "{\"shows\":[{\"ids\":{\"tmdb\":123},\"watched_at\":\"2022-01-02T12:11:32.000Z\"},{\"ids\":{\"tmdb\":\"s111\"},\"watched_at\":\"2022-01-02T12:11:32.000Z\"}]}",
				"cache": "no-cache",
				"headers": {
					"Authorization": "Bearer a789",
					"Content-Type": "application/json",
					"trakt-api-key": "clientId1",
					"trakt-api-version": "2"
				},
				"method": "POST"
			});
		});

		test('server fail', async () => {
			fetchMock.mockResolvedValue({
				ok: false
			});

			await expect(trakt.markAsWatched([123], 'movies')).rejects.toThrowError('Not marked as watched');
			await expect(trakt.markAsWatched([123, 'm111'], 'movies')).rejects.toThrowError('Not marked as watched');
			await expect(trakt.markAsWatched([123], 'shows')).rejects.toThrowError('Not marked as watched');
			await expect(trakt.markAsWatched([123, 's111'], 'shows')).rejects.toThrowError('Not marked as watched');

			expect(fetchMock).toHaveBeenCalledTimes(4);
			expect(fetchMock).toHaveBeenLastCalledWith('https://api.trakt.tv/sync/history', {
				"body": "{\"shows\":[{\"ids\":{\"tmdb\":123},\"watched_at\":\"2022-01-02T12:11:32.000Z\"},{\"ids\":{\"tmdb\":\"s111\"},\"watched_at\":\"2022-01-02T12:11:32.000Z\"}]}",
				"cache": "no-cache",
				"headers": {
					"Authorization": "Bearer a789",
					"Content-Type": "application/json",
					"trakt-api-key": "clientId1",
					"trakt-api-version": "2"
				},
				"method": "POST"
			});
		});

		test('success', async () => {
			fetchMock.mockResolvedValue({
				ok: true
			});

			await expect(trakt.markAsWatched([123], 'movies')).resolves.toBeUndefined();
			await expect(trakt.markAsWatched([123, 'm111'], 'movies')).resolves.toBeUndefined();
			await expect(trakt.markAsWatched([123], 'shows')).resolves.toBeUndefined();
			await expect(trakt.markAsWatched([123, 's111'], 'shows')).resolves.toBeUndefined();

			expect(fetchMock).toHaveBeenCalledTimes(4);
			expect(fetchMock).toHaveBeenLastCalledWith('https://api.trakt.tv/sync/history', {
				"body": "{\"shows\":[{\"ids\":{\"tmdb\":123},\"watched_at\":\"2022-01-02T12:11:32.000Z\"},{\"ids\":{\"tmdb\":\"s111\"},\"watched_at\":\"2022-01-02T12:11:32.000Z\"}]}",
				"cache": "no-cache",
				"headers": {
					"Authorization": "Bearer a789",
					"Content-Type": "application/json",
					"trakt-api-key": "clientId1",
					"trakt-api-version": "2"
				},
				"method": "POST"
			});
		});
	});

	describe('.getAllItemsFromWatchlist', () => {
		let trakt;

		beforeEach(() => {
			trakt = new Trakt();

			trakt.accessToken = 'a789';
			trakt.keys.clientId = 'clientId1';
			trakt.keys.clientSecret = 'clientSecret1';
		});

		test('no connection', async () => {
			fetchMock.mockRejectedValue('No connection');

			await expect(trakt.getAllItemsFromWatchlist('movies')).rejects.toBe('No connection');
			await expect(trakt.getAllItemsFromWatchlist('shows')).rejects.toBe('No connection');

			expect(fetchMock).toHaveBeenCalledTimes(2);
			expect(fetchMock).toHaveBeenLastCalledWith('https://api.trakt.tv/sync/watchlist/shows', {
				"cache": "no-cache",
				"headers": {
					"Authorization": "Bearer a789",
					"Content-Type": "application/json",
					"trakt-api-key": "clientId1",
					"trakt-api-version": "2"
				},
				"method": "GET"
			});
		});

		test('success', async () => {
			fetchMock.mockResolvedValue({
				ok: true,
				async json() {
					return ['Item1', 'Item2'];
				}
			});

			await expect(trakt.getAllItemsFromWatchlist('movies')).resolves.toStrictEqual(['Item1', 'Item2']);
			await expect(trakt.getAllItemsFromWatchlist('shows')).resolves.toStrictEqual(['Item1', 'Item2']);

			expect(fetchMock).toHaveBeenCalledTimes(2);
			expect(fetchMock).toHaveBeenLastCalledWith('https://api.trakt.tv/sync/watchlist/shows', {
				"cache": "no-cache",
				"headers": {
					"Authorization": "Bearer a789",
					"Content-Type": "application/json",
					"trakt-api-key": "clientId1",
					"trakt-api-version": "2"
				},
				"method": "GET"
			});
		});
	});

	describe('.getAllCollectedItems', () => {
		let trakt;

		beforeEach(() => {
			trakt = new Trakt();

			trakt.accessToken = 'a789';
			trakt.keys.clientId = 'clientId1';
			trakt.keys.clientSecret = 'clientSecret1';
		});

		test('no connection', async () => {
			fetchMock.mockRejectedValue('No connection');

			await expect(trakt.getAllCollectedItems('movies')).rejects.toBe('No connection');
			await expect(trakt.getAllCollectedItems('shows')).rejects.toBe('No connection');

			expect(fetchMock).toHaveBeenCalledTimes(2);
			expect(fetchMock).toHaveBeenLastCalledWith('https://api.trakt.tv/sync/collection/shows', {
				"cache": "no-cache",
				"headers": {
					"Authorization": "Bearer a789",
					"Content-Type": "application/json",
					"trakt-api-key": "clientId1",
					"trakt-api-version": "2"
				},
				"method": "GET"
			});
		});

		test('success', async () => {
			fetchMock.mockResolvedValue({
				ok: true,
				async json() {
					return ['Item1', 'Item2'];
				}
			});

			await expect(trakt.getAllCollectedItems('movies')).resolves.toStrictEqual(['Item1', 'Item2']);
			await expect(trakt.getAllCollectedItems('shows')).resolves.toStrictEqual(['Item1', 'Item2']);

			expect(fetchMock).toHaveBeenCalledTimes(2);
			expect(fetchMock).toHaveBeenLastCalledWith('https://api.trakt.tv/sync/collection/shows', {
				"cache": "no-cache",
				"headers": {
					"Authorization": "Bearer a789",
					"Content-Type": "application/json",
					"trakt-api-key": "clientId1",
					"trakt-api-version": "2"
				},
				"method": "GET"
			});
		});
	});
});
