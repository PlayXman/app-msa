import firebase from "firebase/app";
import GiantBomb from "./GiantBomb";

describe('GiantBomb', () => {
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
			await expect(GiantBomb.getApiKey()).rejects.toBe('connection error');
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
			await expect(GiantBomb.getApiKey()).resolves.toBe(false);
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
			await expect(GiantBomb.getApiKey()).resolves.toBe('key1');
		});
	});
});
