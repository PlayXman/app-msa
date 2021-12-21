import FilterActions from './FilterActions';
import OwnageStatus from './OwnageStatus';

function createMediaContainerMock() {
	return {
		state: {
			items: new Map([
				[
					'i1',
					{
						data: {
							slug: 'something-nice',
							status: OwnageStatus.statuses.OWNED,
							labels: [],
						},
						isReleased: true,
						show: true,
					},
				],
				[
					'i2',
					{
						data: {
							slug: 'something-nice-1',
							status: OwnageStatus.statuses.DEFAULT,
							labels: ['Label1', 'Label2'],
						},
						isReleased: false,
						show: true,
					},
				],
				[
					'i3',
					{
						data: {
							slug: 'something-nice-2',
							status: OwnageStatus.statuses.DOWNLOADABLE,
							labels: ['Label2'],
						},
						isReleased: true,
						show: true,
					},
				],
			]),
		},
		setState: jest.fn(),
	};
}

describe('FilterActions', () => {
	let mediaContainer;
	/** @type {FilterActions} */
	let filterActions;

	beforeEach(() => {
		mediaContainer = createMediaContainerMock();
		filterActions = new FilterActions(mediaContainer);
	});

	describe('.filter', () => {
		test('no items', () => {
			mediaContainer.state.items = new Map();
			filterActions.filter();

			expect(mediaContainer.setState).toHaveBeenCalledTimes(1);
			expect(mediaContainer.setState).toHaveBeenCalledWith({
				items: new Map(),
			});
		});

		test('filter with no rules', () => {
			filterActions.filter();

			expect(mediaContainer.setState).toHaveBeenCalledTimes(1);
			expect(mediaContainer.setState).toHaveBeenCalledWith({
				items: createMediaContainerMock().state.items,
			});
		});
	});

	describe('.searchByText', () => {
		test('no items', () => {
			mediaContainer.state.items = new Map();
			filterActions.searchByText('Text');
			filterActions.filter();

			expect(mediaContainer.setState).toHaveBeenCalledWith({
				items: new Map(),
			});
		});

		test('empty text', () => {
			expect(filterActions.conditions.text).toBe('');

			filterActions.searchByText('');
			filterActions.filter();

			expect(mediaContainer.setState).toHaveBeenCalledWith({
				items: createMediaContainerMock().state.items,
			});
		});

		test('nothing found', () => {
			filterActions.searchByText('Nonexistent title');
			filterActions.filter();

			const items = createMediaContainerMock().state.items;
			items.forEach((value) => {
				value.show = false;
			});

			expect(mediaContainer.setState).toHaveBeenCalledWith({
				items: items,
			});
		});

		test('has found', () => {
			filterActions.searchByText('Something Nice 1');
			filterActions.filter();

			const items = createMediaContainerMock().state.items;
			items.forEach((value, key) => {
				if (key !== 'i2') {
					value.show = false;
				}
			});

			expect(mediaContainer.setState).toHaveBeenCalledWith({
				items: items,
			});
		});
	});

	describe('.searchByLabel', () => {
		test('no items', () => {
			mediaContainer.state.items = new Map();
			filterActions.searchByText('Text');
			filterActions.searchByLabel(true);
			filterActions.filter();

			expect(mediaContainer.setState).toHaveBeenCalledWith({
				items: new Map(),
			});
		});

		test('empty text', () => {
			expect(filterActions.conditions.text).toBe('');

			filterActions.searchByLabel(true);
			filterActions.filter();

			const items = createMediaContainerMock().state.items;
			items.forEach((value) => {
				value.show = false;
			});

			expect(mediaContainer.setState).toHaveBeenCalledWith({
				items: items,
			});
		});

		test('nothing found', () => {
			filterActions.searchByText('Nonexistent title');
			filterActions.searchByLabel(true);
			filterActions.filter();

			const items = createMediaContainerMock().state.items;
			items.forEach((value) => {
				value.show = false;
			});

			expect(mediaContainer.setState).toHaveBeenCalledWith({
				items: items,
			});
		});

		test('has found', () => {
			filterActions.searchByText('Label2');
			filterActions.searchByLabel(true);
			filterActions.filter();

			const items = createMediaContainerMock().state.items;
			items.forEach((value, key) => {
				if (key === 'i1') {
					value.show = false;
				}
			});

			expect(mediaContainer.setState).toHaveBeenCalledWith({
				items: items,
			});
		});
	});

	describe('.searchByRelease', () => {
		test('no items', () => {
			mediaContainer.state.items = new Map();
			filterActions.searchByRelease(true)
			filterActions.filter();

			expect(mediaContainer.setState).toHaveBeenCalledWith({
				items: new Map(),
			});
		});

		test('has found', () => {
			// True
			filterActions.searchByRelease(true);
			filterActions.filter();

			let items = createMediaContainerMock().state.items;
			items.forEach((value, key) => {
				if (key === 'i2') {
					value.show = false;
				}
			});

			expect(mediaContainer.setState).toHaveBeenCalledWith({
				items: items,
			});

			// False
			filterActions.searchByRelease(false);
			filterActions.filter();

			items = createMediaContainerMock().state.items;
			items.forEach((value, key) => {
				if (key !== 'i2') {
					value.show = false;
				}
			});

			expect(mediaContainer.setState).toHaveBeenCalledWith({
				items: items,
			});
		});
	});

	describe('.searchByOwnageStatus', () => {
		test('no items', () => {
			mediaContainer.state.items = new Map();
			filterActions.searchByOwnageStatus([OwnageStatus.statuses.DEFAULT]);
			filterActions.filter();

			expect(mediaContainer.setState).toHaveBeenCalledWith({
				items: new Map(),
			});
		});

		test('no status provided', () => {
			filterActions.searchByOwnageStatus([]);
			filterActions.filter();

			const items = createMediaContainerMock().state.items;
			items.forEach((value) => {
				value.show = false;
			});

			expect(mediaContainer.setState).toHaveBeenCalledWith({
				items: items,
			});
		});

		test('unknown status', () => {
			filterActions.searchByOwnageStatus(['UNKNOWN']);
			filterActions.filter();

			const items = createMediaContainerMock().state.items;
			items.forEach((value) => {
				value.show = false;
			});

			expect(mediaContainer.setState).toHaveBeenCalledWith({
				items: items,
			});
		});

		test.each`
		status | available
		${OwnageStatus.statuses.DEFAULT} | ${'i2'}
		${OwnageStatus.statuses.DOWNLOADABLE} | ${'i3'}
		`('single status $status', ({status, available}) => {
			filterActions.searchByOwnageStatus([status]);
			filterActions.filter();

			const items = createMediaContainerMock().state.items;
			items.forEach((value, key) => {
				if (key !== available) {
					value.show = false;
				}
			});

			expect(mediaContainer.setState).toHaveBeenCalledWith({
				items: items,
			});
		});

		test.each`
		statuses | available
		${[OwnageStatus.statuses.DEFAULT, OwnageStatus.statuses.DOWNLOADABLE]} | ${['i2', 'i3']}
		${[OwnageStatus.statuses.OWNED, OwnageStatus.statuses.DOWNLOADABLE]} | ${['i1', 'i3']}
		`('multiple statuses $statuses', ({statuses, available}) => {
			filterActions.searchByOwnageStatus(statuses);
			filterActions.filter();

			const items = createMediaContainerMock().state.items;
			items.forEach((value, key) => {
				if (!available.includes(key)) {
					value.show = false;
				}
			});

			expect(mediaContainer.setState).toHaveBeenCalledWith({
				items: items,
			});
		});
	});

	describe('resets', () => {
		beforeEach(() => {
			filterActions.searchByText('Text');
			filterActions.searchByLabel(true);
			filterActions.searchByOwnageStatus([OwnageStatus.statuses.DOWNLOADABLE]);
			filterActions.searchByRelease(true);
		});

		test('test setup', () => {
			expect(filterActions.conditions).toMatchInlineSnapshot(`
			Object {
			  "label": true,
			  "ownageStatus": Array [
			    "DOWNLOADABLE",
			  ],
			  "releasedState": true,
			  "text": "Text",
			}
		`);
		});

		test('.resetParams', () => {
			filterActions.resetParams();
			expect(filterActions.conditions).toMatchInlineSnapshot(`
			Object {
			  "label": true,
			  "ownageStatus": null,
			  "releasedState": null,
			  "text": "Text",
			}
		`);
		});

		test('.resetSearch', () => {
			filterActions.resetSearch();
			expect(filterActions.conditions).toMatchInlineSnapshot(`
			Object {
			  "label": false,
			  "ownageStatus": Array [
			    "DOWNLOADABLE",
			  ],
			  "releasedState": true,
			  "text": "",
			}
		`);
		});
	});
});
