import Clipboard from "./Clipboard";

describe('Clipboard', () => {
	test.each`
	text
	${''}
	${'something'}
	${'Some Text 1'}
	${'Some-Advanced text with Spěčíal+cháračters'}
	`('.copy($text)', async ({text}) => {
		window.navigator.clipboard = {
			writeText: jest.fn()
		};

		await Clipboard.copy(text);
		expect(navigator.clipboard.writeText).toHaveBeenLastCalledWith(text);
	});
});
