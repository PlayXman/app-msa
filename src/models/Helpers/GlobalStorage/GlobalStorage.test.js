import GlobalStorage from './GlobalStorage';

describe('GlobalStorage', () => {
	beforeEach(() => {
		GlobalStorage._storage = {};
	});

	test('empty storage', () => {
		expect(GlobalStorage._storage).toStrictEqual({});
	});

	describe('.set', () => {
		test('no key provided', () => {
			document.dispatchEvent = jest.fn();

			GlobalStorage.set('', 'Payload');
			expect(GlobalStorage._storage).toStrictEqual({});

			GlobalStorage.set(undefined, 'Payload');
			expect(GlobalStorage._storage).toStrictEqual({});

			expect(document.dispatchEvent).not.toHaveBeenCalled();
		});

		test('new key', () => {
			document.dispatchEvent = jest.fn();
			const key = 'key1';

			GlobalStorage.set(key, 'Payload');

			expect(document.dispatchEvent).toHaveBeenCalledTimes(1);
			expect(GlobalStorage._storage[key]).toBe('Payload');
		});

		test('additional keys', () => {
			document.dispatchEvent = jest.fn();

			GlobalStorage.set('key1', 'Payload');
			expect(document.dispatchEvent).toHaveBeenCalledTimes(1);

			GlobalStorage.set('key2', 'Payload 2');
			expect(document.dispatchEvent).toHaveBeenCalledTimes(2);

			expect(GlobalStorage._storage).toMatchInlineSnapshot(`
			Object {
			  "key1": "Payload",
			  "key2": "Payload 2",
			}
		`);
		});
	});

	test('.getState', () => {
		const key1 = 'key1';
		GlobalStorage.set(key1, 'Payload');
		expect(GlobalStorage.getState(key1)).toBe('Payload');

		const key2 = 'key2';
		GlobalStorage.set(key2, 'Payload 2');
		expect(GlobalStorage.getState(key2)).toBe('Payload 2');

		GlobalStorage.set(key1, 'New Payload');
		expect(GlobalStorage.getState(key1)).toBe('New Payload');
		expect(GlobalStorage.getState(key2)).toBe('Payload 2');
	});

	test('.connect', () => {
		// --- First key ---
		const mockCallback1 = jest.fn();
		const key1 = 'key1';
		const observer1 = GlobalStorage.connect(key1, mockCallback1);

		// No data yet
		expect(GlobalStorage.getState(key1)).toBeNull();
		// Called on init
		expect(mockCallback1).toHaveBeenCalledTimes(1);
		expect(mockCallback1).toHaveBeenLastCalledWith(null);

		// First set of data
		GlobalStorage.set(key1, 'Payload');
		expect(mockCallback1).toHaveBeenCalledTimes(2);
		expect(mockCallback1).toHaveBeenLastCalledWith('Payload');

		// --- Second key ---
		const mockCallback2 = jest.fn();
		const key2 = 'key2';
		const observer2 = GlobalStorage.connect(key2, mockCallback2);

		// Not have been called
		expect(mockCallback1).toHaveBeenCalledTimes(2);
		// Called once
		expect(mockCallback2).toHaveBeenCalledTimes(1);

		// --- First key ---
		const mockCallback3 = jest.fn();
		const observer3 = GlobalStorage.connect(key1, mockCallback3);

		GlobalStorage.set(key1, 'Payload 2');

		// Not have been called
		expect(mockCallback2).toHaveBeenCalledTimes(1);
		// Called
		expect(mockCallback1).toHaveBeenCalledTimes(3);
		expect(mockCallback1).toHaveBeenLastCalledWith('Payload 2');
		expect(mockCallback3).toHaveBeenCalledTimes(2);
		expect(mockCallback3).toHaveBeenLastCalledWith('Payload 2');


		// --- Clean up ---
		observer1.disconnect();
		observer2.disconnect();
		observer3.disconnect();
	});
});
