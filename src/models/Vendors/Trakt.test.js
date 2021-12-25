import Trakt from "./Trakt";
import TraktDb from "../Db/Vendors/Trakt";

describe('Trakt', () => {
	const fetchMock = jest.spyOn(global, 'fetch');

	afterEach(() => {
		fetchMock.mockClear();
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
			getApiKeysMock.mockClear();
			setRefreshTokenMock.mockClear();
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


			windowLocationMock.mockReturnValueOnce(new URL('http://dummy.com/some/path?code=c123'));

			// Communication error
			fetchMock.mockImplementation(async () => {
				throw new Error('No connection');
			});
			await expect(t.authenticate()).rejects.toBeUndefined();
			expect(fetchMock).toHaveBeenCalled();

			// Server returned access and refresh token but not saved in DB
			fetchMock.mockImplementationOnce(async () => {
				return {
					async json() {
						return {
							access_token: 'a132_1',
							refresh_token: 'r132_1'
						}
					}
				}
			}).mockImplementationOnce(async () => {
				return {
					async json() {
						return {
							access_token: 'a132_2',
							refresh_token: 'r132_2'
						}
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
		//todo
	});

	describe('.removeFromWatchlist', () => {
		//todo
	});

	describe('.markAsWatched', () => {
		//todo
	});

	describe('.getAllItemsFromWatchlist', () => {
		//todo
	});

	describe('.getAllCollectedItems', () => {
		//todo
	});
});
