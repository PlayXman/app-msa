import GlobalStorageObserver from "./GlobalStorageObserver";

describe('GlobalStorageObserver', () => {
	const mockCallback = jest.fn();

	beforeEach(() => {
		mockCallback.mockReset();
	});

	test('.listen', () => {
		let observer = new GlobalStorageObserver(mockCallback);
		const eventKey = 'key1';
		const event = new CustomEvent(eventKey, {
			detail: 'Payload'
		});

		observer.listen(eventKey);

		expect(mockCallback).not.toHaveBeenCalled();

		document.dispatchEvent(event);

		expect(mockCallback).toHaveBeenCalledTimes(1);
		expect(mockCallback).toHaveBeenCalledWith('Payload');

		// Clean up - remove the listener
		document.removeEventListener(eventKey, observer.callback);
		document.dispatchEvent(event);

		expect(mockCallback).toHaveBeenCalledTimes(1);
	});

	test('.disconnect', () => {
		let observer = new GlobalStorageObserver(mockCallback);
		const eventKey = 'key2';
		const event = new CustomEvent(eventKey, {
			detail: 'Payload'
		});

		observer.listen(eventKey);
		document.dispatchEvent(event);

		expect(mockCallback).toHaveBeenCalledTimes(1);
		expect(mockCallback).toHaveBeenCalledWith('Payload');

		// Remove the event
		observer.disconnect();

		document.dispatchEvent(event);

		expect(mockCallback).toHaveBeenCalledTimes(1);
	});
});
