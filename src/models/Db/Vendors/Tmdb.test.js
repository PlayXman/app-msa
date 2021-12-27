import Tmdb from "./Tmdb";
import firebase from "firebase/app";

describe('Tmdb', () => {
	describe('.getApiKey', () => {
		const oriFirebaseDatabase = firebase.database;

		afterAll(() => {
			firebase.database = oriFirebaseDatabase;
		});

		test('connection error', async () => {
			firebase.database = jest.fn(() => ({
				ref: jest.fn(() => ({
					once: jest
						.fn()
						.mockRejectedValue('connection error')
				}))
			}));
			await expect(Tmdb.getApiKey()).rejects.toBe('connection error');
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
			await expect(Tmdb.getApiKey()).resolves.toBe(false);
		});

		test('key found', async () => {
			firebase.database = jest.fn(() => ({
				ref: jest.fn(() => ({
					once: jest
						.fn()
						.mockResolvedValue({
							val: () => 'key1'
						})
				}))
			}));
			await expect(Tmdb.getApiKey()).resolves.toBe('key1');
		});
	});
});
