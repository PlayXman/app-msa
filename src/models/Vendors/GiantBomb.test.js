import GiantBomb from "./GiantBomb";
import Jsonp from "../Helpers/Jsonp";
import GiantBombDb from "../Db/Vendors/GiantBomb";

describe('GiantBomb', () => {
	test.each`
	ord | erd | erm | erq | ery | result
	${null} | ${null} | ${null} | ${null} | ${null} | ${''}
	${''} | ${''} | ${''} | ${''} | ${''} | ${''}
	${'2004-10-26'} | ${null} | ${null} | ${null} | ${null} | ${'2004-10-26'}
	${'2004-10-26 11:22:35'} | ${null} | ${null} | ${null} | ${null} | ${'2004-10-26'}
	${null} | ${null} | ${'10'} | ${null} | ${'2022'} | ${'2022-10'}
	${null} | ${'4'} | ${'10'} | ${null} | ${'2022'} | ${'2022-10-4'}
	${null} | ${null} | ${null} | ${'2'} | ${'2022'} | ${'Q2 2022'}
	${null} | ${null} | ${'10'} | ${'2'} | ${'2022'} | ${'2022-10'}
	${'2006-12-1'} | ${'2'} | ${'3'} | ${'4'} | ${'2022'} | ${'2006-12-1'}
	`('.formatDate($ord, $erd, $erm, $erq, $ery)', ({ord, erd, erm, erq, ery, result}) => {
		expect(GiantBomb.formatDate(ord, erd, erm, erq, ery)).toBe(result);
	});

	test.each`
	error | requestFail | noApiKey | data
	${'OK'} | ${false} | ${false} | ${'Found games'}
	${'101'} | ${false} | ${false} | ${null}
	${'OK'} | ${true} | ${false} | ${null}
	${'OK'} | ${false} | ${true} | ${null}
	`('.searchGame with error $error when request fails $requestFail or no api key $noApiKey', async ({error, requestFail, noApiKey, data}) => {
		GiantBombDb.getApiKey = jest.fn(async () => {
			if(noApiKey) {
				throw new Error();
			}

			return 'apiKey';
		});
		Jsonp.request = jest.fn( async () => {
			if(requestFail) {
				throw new Error();
			}

			return {
				error: error,
				results: 'Found games'
			};
		});
		const mockCallback = jest.fn();

		GiantBomb.searchGame('Title', mockCallback);

		await new Promise((resolve) => {
			setTimeout(() => {
				expect(mockCallback).toHaveBeenCalled();
				expect(mockCallback).toHaveBeenLastCalledWith(data);

				resolve();
			}, 100);
		});
	});

	test.each`
	ids | noConnection | requestStatus | noApiKey | data
	${[]} | ${false} | ${'OK'} | ${false} | ${null}
	${[100]} | ${false} | ${'OK'} | ${false} | ${['List of games']}
	${[100]} | ${false} | ${'101'} | ${false} | ${null}
	${[100]} | ${true} | ${'OK'} | ${false} | ${null}
	${[100]} | ${false} | ${'OK'} | ${true} | ${null}
	${Array(105).fill(100)} | ${false} | ${'OK'} | ${false} | ${['List of games', 'List of games']}
	`('.getGames($ids) with noConnection=$noConnection, requestStatus=$requestStatus, noApiKey=$noApiKey', async ({ids, noConnection, requestStatus, noApiKey, data}) => {
		GiantBombDb.getApiKey = jest.fn(async () => {
			if(noApiKey) {
				throw new Error();
			}

			return 'apiKey';
		});
		Jsonp.request = jest.fn( async () => {
			if(noConnection) {
				throw new Error();
			}

			return {
				error: requestStatus,
				results: 'List of games'
			};
		});
		const mockCallback = jest.fn();

		GiantBomb.getGames(ids, mockCallback);

		await new Promise((resolve) => {
			setTimeout(() => {
				expect(mockCallback).toHaveBeenCalled();
				expect(mockCallback).toHaveBeenLastCalledWith(data);

				resolve();
			}, 100);
		});
	});
});
