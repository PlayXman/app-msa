import firebase from 'firebase';
import Labels from './Labels';
import Label from './Label';

describe('Labels', () => {
	const onceMock = jest.fn();
	const childMock = jest.fn();
	const updateMock = jest.fn();
	const databaseMock = jest.fn(() => ({
		ref: jest.fn(() => ({
			once: onceMock,
			child: childMock,
			update: updateMock,
		})),
	}));

	beforeAll(() => {
		firebase.database = databaseMock;
	});

	afterEach(() => {
		onceMock.mockReset();
		childMock.mockReset();
		updateMock.mockReset();
	});

	afterAll(() => {
		databaseMock.mockRestore();
	});

	test('.getLabels', async () => {
		onceMock.mockResolvedValue([
			{
				key: 'l1',
				val: () => 2,
			},
			{
				key: 'l2',
				val: () => 5,
			},
		]);

		expect(await Labels.getLabels('model1')).toMatchInlineSnapshot(`
		Array [
		  Label {
		    "params": Object {
		      "count": 2,
		      "key": "l1",
		    },
		  },
		  Label {
		    "params": Object {
		      "count": 5,
		      "key": "l2",
		    },
		  },
		]
	`);
	});

	describe('.addLabel', () => {
		const setMock = jest.fn();

		beforeEach(() => {
			setMock.mockReset().mockResolvedValue(new Label());
			childMock.mockReturnValue({
				once: onceMock,
				set: setMock,
			});
			updateMock.mockResolvedValue(new Label());
		});

		test('existing label with multiple occurrences', async () => {
			onceMock.mockResolvedValue({
				key: 'existingLabel',
				val: () => 3,
			});
			const existingLabel = await Labels.addLabel('existingLabel', 'model1');

			expect(existingLabel.key).toBe('existingLabel');
			expect(existingLabel.count).toBe(4);
			expect(updateMock).toHaveBeenCalledWith({
				existingLabel: 4,
			});
		});

		test('new label', async () => {
			onceMock.mockResolvedValue({
				key: 'newLabel',
				val: () => null,
			});
			const newLabel = await Labels.addLabel('newLabel', 'model1');

			expect(newLabel.key).toBe('newLabel');
			expect(newLabel.count).toBe(1);
			expect(setMock).toHaveBeenCalledWith(1);
		})
	});

	describe('.removeLabel', () => {
		const removeMock = jest.fn();

		beforeEach(() => {
			removeMock.mockReset().mockResolvedValue(null)
			childMock.mockReturnValue({
				once: onceMock,
				remove: removeMock,
			});
			updateMock.mockResolvedValue(new Label());
		});

		test('existing label with higher count', async () => {
			onceMock.mockResolvedValue({
				key: 'existingLabel1',
				val: () => 5,
			});

			await Labels.removeLabel('existingLabel1', 'model1');

			expect(updateMock).toHaveBeenCalledWith({
				existingLabel1: 4,
			});
		});

		test('existing label with just 1 occurrence', async () => {
			onceMock.mockResolvedValue({
				key: 'existingLabel2',
				val: () => 1,
			});

			await Labels.removeLabel('existingLabel2', 'model1');

			expect(childMock).toHaveBeenLastCalledWith('existingLabel2');
			expect(removeMock).toHaveBeenCalled();
		});

		test('existing label with just 0 occurrences', async () => {
			onceMock.mockResolvedValue({
				key: 'existingLabel3',
				val: () => 0,
			});

			await Labels.removeLabel('existingLabel3', 'model1');

			expect(childMock).toHaveBeenLastCalledWith('existingLabel3');
			expect(removeMock).toHaveBeenCalled();
		});

		test('non-existing label', async () => {
			onceMock.mockResolvedValue({
				key: 'existingLabel4',
				val: () => null,
			});

			try {
				await Labels.removeLabel('existingLabel4', 'model1');
			} catch (e) {
				expect(e).toMatchInlineSnapshot(`undefined`);
			}

			expect(childMock).toHaveBeenLastCalledWith('existingLabel4');
			expect(removeMock).not.toHaveBeenCalled();
			expect(updateMock).not.toHaveBeenCalled();
		});
	});

	test.each`
		label     | labelKeys           | expected
		${''}     | ${[]}               | ${false}
		${''}     | ${['']}             | ${true}
		${''}     | ${['key1', 'key2']} | ${false}
		${'key1'} | ${[]}               | ${false}
		${'key2'} | ${['key1', 'key2']} | ${true}
		${'none'} | ${['key1', 'key2']} | ${false}
	`('.inLabels($label, $labelKeys) = $expected', ({ label, labelKeys, expected }) => {
		const labels = labelKeys.map((k) => {
			const l = new Label();
			l.key = k;
			return l;
		});

		expect(Labels.inLabels(label, labels)).toBe(expected);
	});
});
