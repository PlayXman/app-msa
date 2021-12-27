import firebase from "firebase/app";
import Trakt from "./Trakt";

describe('Trakt', () => {
	const oriFirebaseDatabase = firebase.database;

	afterAll(() => {
		firebase.database = oriFirebaseDatabase;
	});

	describe('.getApiKeys', () => {
		test('connection error', async () => {
			firebase.database = jest.fn(() => ({
				ref: jest.fn(() => ({
					once: jest
						.fn()
						.mockRejectedValue('connection error')
				}))
			}));
			await expect(Trakt.getApiKeys()).rejects.toBe('connection error');
		});

		test('no key found', async () => {
			firebase.database = jest.fn(() => ({
				ref: jest.fn(() => ({
					once: jest
						.fn()
						.mockResolvedValue({
							val: () => null
						})
				}))
			}));
			await expect(Trakt.getApiKeys()).resolves.toBe(null);
		});

		test('key found', async () => {
			firebase.database = jest.fn(() => ({
				ref: jest.fn(() => ({
					once: jest
						.fn()
						.mockResolvedValue({
							val: () => ({
								clientId: 'client id 1',
								clientSecret: 'client secret 1',
								refreshToken: 'refresh 1'
							})
						})
				}))
			}));
			await expect(Trakt.getApiKeys()).resolves.toStrictEqual({
				clientId: "client id 1",
				clientSecret: "client secret 1",
				refreshToken: "refresh 1"
			});
		});
	});

	describe('.getRefreshToken', () => {
		test('connection error', async () => {
			firebase.database = jest.fn(() => ({
				ref: jest.fn(() => ({
					once: jest
						.fn()
						.mockRejectedValue('connection error')
				}))
			}));
			await expect(Trakt.getRefreshToken()).rejects.toBe('connection error');
		});

		test('no key found', async () => {
			firebase.database = jest.fn(() => ({
				ref: jest.fn(() => ({
					once: jest
						.fn()
						.mockResolvedValue({
							val: () => null
						})
				}))
			}));
			await expect(Trakt.getRefreshToken()).resolves.toBe(null);
		});

		test('key found', async () => {
			firebase.database = jest.fn(() => ({
				ref: jest.fn(() => ({
					once: jest
						.fn()
						.mockResolvedValue({
							val: () => 'refresh token 1'
						})
				}))
			}));
			await expect(Trakt.getRefreshToken()).resolves.toBe('refresh token 1')
		});
	})

	describe('.setRefreshToken', () => {
		test('db path', async () => {
			const refMock = jest.fn(() => ({
				set: jest.fn().mockResolvedValue(null)
			}));
			firebase.database = jest.fn(() => ({
				ref: refMock
			}));

			await Trakt.setRefreshToken('new token');

			expect(refMock).toHaveBeenLastCalledWith('/Vendors/traktTv/key/refreshToken');
		});

		test('connection error', async () => {
			firebase.database = jest.fn(() => ({
				ref: jest.fn(() => ({
					set: jest.fn().mockRejectedValue('connection error')
				}))
			}));
			await expect(Trakt.setRefreshToken('new token')).rejects.toBe('connection error');
		});

		test.each`
		newToken
		${''}
		${null}
		${12345}
		${'new token 123'}
		`('successfully set with $newToken', async ({newToken}) => {
			const setMock = jest.fn().mockResolvedValue('done');
			firebase.database = jest.fn(() => ({
				ref: jest.fn(() => ({
					set: setMock
				}))
			}));
			await expect(Trakt.setRefreshToken(newToken)).resolves.toBe('done');
			expect(setMock).toHaveBeenLastCalledWith(newToken)
		});
	})
});
