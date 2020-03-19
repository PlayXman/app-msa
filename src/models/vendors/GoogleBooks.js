import { Config } from '../../config';

/**
 * Handles operations with Google Books api vendor
 */
class GoogleBooks {

	/**
	 * Returns books by search query.
	 * @param {string} title
	 * @return {Promise<Object{}><string>} Returns error message
	 */
	static searchBooks( title ) {
		return new Promise( ( resolve, reject ) => {
			const query = new URLSearchParams( {
				q: title,
				maxResults: 10,
				orderBy: 'relevance',
				fields: `items(${[
					'id',
					'volumeInfo/title',
					'volumeInfo/authors',
					'volumeInfo/imageLinks',
					'volumeInfo/publishedDate'
				].join( ',' )})`
			} );

			fetch( `${Config.vendors.googleBooks.apiUrl}?${query.toString()}` ).then( ( resolve ) => {
				if ( !resolve.ok ) {
					throw new Error( "Can't contact Google Apis" );
				}

				return resolve.json();
			} ).then( ( result ) => {
				resolve( result.items );
			} ).catch( ( err ) => {
				console.log( err );
				reject( err );
			} )
		} );
	}

	/**
	 * Fetches metadata for a book
	 * @param {string} id Id from Google Books Api
	 * @return {Promise<Object><string>}
	 */
	static getBook( id ) {
		return new Promise( ( resolve, reject ) => {
			const query = new URLSearchParams( {
				fields: [
					'id',
					'volumeInfo/title',
					'volumeInfo/authors',
					'volumeInfo/imageLinks',
					'volumeInfo/publishedDate',
					'volumeInfo/previewLink'
				].join( ',' )
			} );

			fetch( `${Config.vendors.googleBooks.apiUrl}/${id}?${query.toString()}` ).then( ( resolve ) => {
				if ( !resolve.ok ) {
					throw new Error( "Can't contact Google Apis" );
				}

				return resolve.json();
			} ).then( ( result ) => {
				resolve( result );
			} ).catch( ( err ) => {
				console.log( err );
				reject( err );
			} )
		} );
	}

}

export default GoogleBooks;
