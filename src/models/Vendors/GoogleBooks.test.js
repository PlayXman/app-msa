import GoogleBooks from "./GoogleBooks";

describe('GoogleBooks', () => {
	test.each`
	noConnection | serverReject
	${false} | ${false}
	${true} | ${false}
	${false} | ${true}
	`('.searchBooks with noConnection=$noConnection, serverReject=$serverReject', async ({noConnection, serverReject}) => {
		global.fetch = jest.fn( async () => {
			if(noConnection) {
				throw new Error('No connection');
			}
			return {
				ok: !serverReject,
				async json() {
					return {
						items: 'Found books'
					}
				}
			};
		});

		if(serverReject) {
			await expect(GoogleBooks.searchBooks('Title')).rejects.toThrowError("Can't contact Google Apis");
		} else if(noConnection) {
			await expect(GoogleBooks.searchBooks('Title')).rejects.toThrowError('No connection');
		} else {
			await expect(GoogleBooks.searchBooks('Title')).resolves.toBe('Found books');
		}
	});

	test.each`
	noConnection | serverReject
	${false} | ${false}
	${true} | ${false}
	${false} | ${true}
	`('.getBook with noConnection=$noConnection, serverReject=$serverReject', async ({noConnection, serverReject}) => {
		global.fetch = jest.fn( async () => {
			if(noConnection) {
				throw new Error('No connection');
			}
			return {
				ok: !serverReject,
				async json() {
					return {
						items: 'Found books'
					}
				}
			};
		});

		if(serverReject) {
			await expect(GoogleBooks.getBook('123')).rejects.toThrowError("Can't contact Google Apis");
		} else if(noConnection) {
			await expect(GoogleBooks.getBook('123')).rejects.toThrowError('No connection');
		} else {
			await expect(GoogleBooks.getBook('123')).resolves.toStrictEqual({"items": "Found books"});
		}
	});
});
