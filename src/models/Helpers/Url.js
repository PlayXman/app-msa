/**
 * Helpers for text
 */
class Url {

	/**
	 * Formats text, mainly media title, for url get param
	 * @param {string} text
	 * @return {string}
	 */
	static encodeText( text ) {
		return encodeURIComponent( text.replace( /:/g, '' ) ).replace( /%20/g, '+' )
	}

	/**
	 * Opens url in new tab
	 * @param {string} url URL to open
	 */
	static openNewTab( url ) {
		window.open( url, '_blank' );
	}

	/**
	 * Creates "slug" from text. Replaces all special chars, spaces etc. and creates simple lowercase string
	 * @param {string} text
	 * @return {string}
	 */
	static slugify( text ) {
		const a = 'àáäâãåăæąçćčđďèéěėëêęǵḧìíïîįłḿǹńňñòóöôœøṕŕřßśšșťțùúüûǘůűūųẃẍÿýźžż·/_,:;';
		const b = 'aaaaaaaaacccddeeeeeeeghiiiiilmnnnnooooooprrssssttuuuuuuuuuwxyyzzz------';
		const p = new RegExp( a.split( '' ).join( '|' ), 'g' );

		return text.toString().toLowerCase()
		           .replace( /\s+/g, '-' ) // Replace spaces with -
		           .replace( p, c => b.charAt( a.indexOf( c ) ) ) // Replace special characters
		           .replace( /&/g, '-and-' ) // Replace & with 'and'
		           .replace( /[^\w-]+/g, '' ) // Remove all non-word characters
		           .replace( /--+/g, '-' ) // Replace multiple - with single -
		           .replace( /^-+/, '' ) // Trim - from start of text
		           .replace( /-+$/, '' ) // Trim - from end of text
	}

}

export default Url;
