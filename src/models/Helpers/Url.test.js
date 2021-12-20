import Url from "./Url";

describe('Url', () => {
	test('.openNewTab', () => {
		window.open = jest.fn();

		Url.openNewTab('http://dummy.url');

		expect(window.open).toHaveBeenCalledTimes(1);
	});

	test.each`
	text | result
	${''} | ${''}
	${'something'} | ${'something'}
	${'Something Important 1'} | ${'something-important-1'}
	${'Some Important-your stuff'} | ${'some-important-your-stuff'}
	${'Nice Title: Subtitle\'s text'} | ${'nice-title-subtitles-text'}
	${'àáäâãåăæąçćčđďèéěėëêęǵḧìíïîįłḿǹńňñòóöôœøṕŕřßśšșťțùúüûǘůűūųẃẍÿýźžż·/_,:;'} | ${'aaaaaaaaacccddeeeeeeeghiiiiilmnnnnooooooprrssssttuuuuuuuuuwxyyzzz'}
	`('.slugify($text)', ({text, result}) => {
		expect(Url.slugify(text)).toBe(result);
	});

	test.each`
	text | result
	${''} | ${''}
	${'something'} | ${'something'}
	${'Something Important 1'} | ${'Something+Important+1'}
	${'Some Important-your stuff'} | ${'Some+Important-your+stuff'}
	${'Nice Title: Subtitle\'s text'} | ${'Nice+Title+Subtitle\'s+text'}
	${'àáäâãåăæąçćčđďèéěėëêęǵḧìíïîįłḿǹńňñòóöôœøṕŕřßśšșťțùúüûǘůűūųẃẍÿýźžż·/_,:;'} | ${'%C3%A0%C3%A1%C3%A4%C3%A2%C3%A3%C3%A5%C4%83%C3%A6%C4%85%C3%A7%C4%87%C4%8D%C4%91%C4%8F%C3%A8%C3%A9%C4%9B%C4%97%C3%AB%C3%AA%C4%99%C7%B5%E1%B8%A7%C3%AC%C3%AD%C3%AF%C3%AE%C4%AF%C5%82%E1%B8%BF%C7%B9%C5%84%C5%88%C3%B1%C3%B2%C3%B3%C3%B6%C3%B4%C5%93%C3%B8%E1%B9%95%C5%95%C5%99%C3%9F%C5%9B%C5%A1%C8%99%C5%A5%C8%9B%C3%B9%C3%BA%C3%BC%C3%BB%C7%98%C5%AF%C5%B1%C5%AB%C5%B3%E1%BA%83%E1%BA%8D%C3%BF%C3%BD%C5%BA%C5%BE%C5%BC%C2%B7%2F_%2C%3B'}
	`('.encodeText($text)', ({text, result}) => {
		expect(Url.encodeText(text)).toBe(result);
	});
});
