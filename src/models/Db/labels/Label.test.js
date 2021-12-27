import Label from "./Label";

describe('Label', () => {
	test('model structure, getters and setters', () => {
		const label = new Label();

		expect(label.key).toBe('');
		expect(label.count).toBe(0);

		label.key = 'Label 1';
		expect(label.key).toBe('Label 1');

		label.count = 10;
		expect(label.count).toBe(10);
	});

	test.each`
	text | key
	${''} | ${''}
	${'text'} | ${'Text'}
	${'Name'} | ${'Name'}
	${'more words'} | ${'MoreWords'}
	${'Something more Complex 12'} | ${'SomethingMoreComplex12'}
	${'text+special - characters.'} | ${'Text+specialCharacters.'}
	`('.newKey($text)', ({text, key}) => {
		const label = new Label();
		label.newKey(text);

		expect(label.key).toBe(key);
	});
});
