import MediaModel from './MediaModel';
import Books from '../Db/Media/Books';
import Notification from '../Notification';
import Url from '../Helpers/Url';
import GoogleBooks from '../vendors/GoogleBooks';

/**
 * Media model for Books
 */
class BooksMediaModel extends MediaModel {
	name = 'books';

	/**
	 * Returns ref to all DB items
	 * @return {firebase.database.Reference}
	 */
	getDbRef() {
		return Books.dbRef();
	}

	/**
	 * New instance of Books db item
	 * @return {Books}
	 */
	createItem() {
		return new Books();
	}

	/**
	 * Finds out that book is released.
	 * @param {string} date
	 * @return {boolean}
	 */
	isReleased(date) {
		const releaseDate = new Date(date);
		const now = new Date();
		return releaseDate <= now;
	}

	/**
	 * Shows info about book
	 * @param {string} vendor Currently not used
	 * @param {string} infoUrl Info url. It's saved in DB
	 */
	showItemInfo(vendor, infoUrl) {
		Url.openNewTab(infoUrl);
	}

	/**
	 * Refreshes all items meta data. Downloads images, gets titles etc.
	 */
	handleItemsRefresh = () => {
		const loaderMsg = 'Refreshing books...';

		super.handleItemsRefresh(loaderMsg);
	};

	/**
	 * Search items with name similar as searched text
	 * @param {string} title Game title
	 * @return {Promise<Books[]>}
	 */
	searchItem = (title) => {
		return new Promise((resolve, reject) => {
			const loader = new Notification(true);
			loader.setText('Searching...');
			loader.show();

			GoogleBooks.searchBooks(title)
				.then((results) => {
					const items = [];

					results.forEach((item) => {
						const book = this._createBookItem(item);
						items.push(book);
					});

					resolve(items);
					loader.hide();
				})
				.catch((errMsg) => {
					// nothing returned
					loader.hide();
					const msg = new Notification();
					msg.setText('Error during the search');
					msg.showAndHide();

					reject();
				});
		});
	};

	/**
	 * Add new item to DB
	 * @param {string} itemId Media item ID
	 * @return {Promise<{alreadySaved: boolean}>} `Object.alreadySaved` says if the item was already saved in DB
	 */
	addItem = (itemId) => {
		return new Promise((resolve, reject) => {
			const loader = new Notification(true);
			loader.setText('Saving book...');
			loader.show();

			this.getDbRef()
				.child(itemId)
				.once('value')
				.then((snap) => {
					if (snap.val()) {
						loader.hide();
						resolve({
							alreadySaved: true,
						});
					} else {
						const newBook = this.createItem();
						newBook.setId(itemId);
						newBook.setDefaults();
						newBook.push().then(() => {
							this._updateDbItems([itemId], loader, 'Saved');

							resolve({
								alreadySaved: false,
							});
						});
					}
				})
				.catch((err) => {
					console.error(err);
					loader.hide();
					reject();
				});
		});
	};

	/**
	 * Updates metadata of all books in DB
	 * @param {string[]} booksIds Game ids which should be updated
	 * @param {Notification} loader Loader to changed/close
	 * @param {string} loaderMsg Loader message
	 * @private
	 */
	_updateDbItems(booksIds, loader, loaderMsg) {
		let done = 0;
		const total = booksIds.length;

		booksIds.forEach((bookId) => {
			GoogleBooks.getBook(bookId)
				.then((bookData) => {
					const book = this._createBookItem(bookData);
					book.push();
				})
				.finally(() => {
					done++;
					loader.setText(`${loaderMsg} ${done}/${total}`);

					if (done >= total) {
						loader.hide();
					}
				});
		});
	}

	/**
	 * Prepares Books DB object with data from google books api fetch
	 * @param {{}} googleBooksItemObj One item object fetched from GiantBomb
	 * @return {Books}
	 * @private
	 */
	_createBookItem(googleBooksItemObj) {
		const book = this.createItem();
		const info = googleBooksItemObj.volumeInfo;

		book.setId(googleBooksItemObj.id);
		book.title = info.title || '';
		book.title += info.authors ? ` (${info.authors.join(', ')})` : '';
		book.imageUrl =
			info.imageLinks && info.imageLinks.smallThumbnail ? info.imageLinks.smallThumbnail : '';
		book.imageUrl = book.imageUrl.replace(/^http:/, 'https:');
		book.releaseDate = info.publishedDate || '';
		book.infoUrl = info.previewLink || '';
		book.infoUrl = book.infoUrl.replace(/^http:/, 'https:');

		return book;
	}
}

export default BooksMediaModel;
