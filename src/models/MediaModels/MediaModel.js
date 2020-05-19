import Notification from '../Notification';
import Labels from '../Db/labels/Labels';
import Label from '../Db/labels/Label';

/**
 * MediaModel prescription.
 */
class MediaModel {
	name = '';

	/**
	 * Formats date to readable form.
	 * @param {string} date
	 * @return {string}
	 */
	getReleaseDate(date) {
		if (date) {
			if (date.slice(0, 1) === 'Q') {
				return date;
			} else {
				const dateObj = new Date(date);
				return (
					dateObj.getDate() + '.' + (dateObj.getMonth() + 1) + '.' + dateObj.getFullYear()
				);
			}
		} else {
			return 'TBA';
		}
	}

	/**
	 * Returns filters for actual model.
	 * @return {[{}]} [{value: string,text: string}]
	 */
	getFilters() {
		//@OVERRIDE should be defined
	}

	/**
	 * Returns ref to all DB items
	 * @return {firebase.database.Reference}
	 */
	getDbRef() {
		//@OVERRIDE should be defined
	}

	/**
	 * Returns true if the item is released.
	 * @param {string} date
	 * @return {boolean}
	 */
	isReleased(date) {
		//@OVERRIDE should be defined
	}

	/**
	 * Searches for the item by its title
	 * @param {string} title Search text
	 * @return {Promise<Media[]>}
	 */
	searchItem(title) {
		//@OVERRIDE should be defined
	}

	/**
	 * Removes media item from DB
	 * @param {string|number} id Media item id
	 */
	removeItem(id) {
		const loader = new Notification(true);
		loader.setText('Removing...');
		loader.show();
		const msg = new Notification();

		this.getDbRef()
			.child(id)
			.remove()
			.then(() => {
				msg.setText('Removed');
			})
			.catch((err) => {
				console.log('Remove failed: ' + err);
				msg.setText("Couldn't remove");
			})
			.finally(() => {
				loader.hide();
				msg.showAndHide();
			});
	}

	/**
	 * Returns reference to database model of media item
	 * @return {Media} instance
	 */
	createItem() {
		//@OVERRIDE should be defined
	}

	/**
	 * Refreshes all items meta data. Downloads images, gets titles etc.
	 * @param {string} loaderMsg Loader text
	 *
	 * @override should be defined
	 */
	handleItemsRefresh(loaderMsg) {
		const loader = new Notification(true);
		loader.setText(loaderMsg);
		loader.show();

		this.getDbRef()
			.once('value')
			.then((snap) => {
				if (!snap.val()) {
					return false;
				}

				const ids = Object.keys(snap.val());
				this._updateDbItems(ids, loader, loaderMsg);
			});
	}

	/**
	 * Adds a label to a item and indexes it in DB
	 * @param {string} label
	 * @param {string|number} itemId Media item id
	 * @returns {Promise<void>}
	 */
	async handleAddLabel(label, itemId) {
		const ref = this.getDbRef().child(itemId);
		const newLabel = new Label();
		newLabel.newKey(label);

		const itemLabelsSnapshot = await ref.child('labels').once('value');

		if (itemLabelsSnapshot.exists()) {
			const labels = itemLabelsSnapshot.val();

			if (!labels.includes(newLabel.key)) {
				labels.push(newLabel.key);

				await ref.update({
					labels: labels,
				});
				await Labels.addLabel(newLabel.key, this.name);
			}
		} else {
			await ref.update({
				labels: [newLabel.key],
			});
			await Labels.addLabel(newLabel.key, this.name);
		}
	}

	/**
	 * Removes label from item and index DB table
	 * @param {string} label
	 * @param {string|number} itemId Media item id
	 * @returns {Promise<void>}
	 */
	async handleRemoveLabel(label, itemId) {
		const ref = this.getDbRef().child(itemId);
		const newLabel = new Label();
		newLabel.key = label;

		const itemLabelsSnapshot = await ref.child('labels').once('value');

		if (itemLabelsSnapshot.exists()) {
			const labels = itemLabelsSnapshot.val();

			if (labels.includes(newLabel.key)) {
				await ref.update({
					labels: labels.filter((item) => item !== newLabel.key),
				});
				await Labels.removeLabel(newLabel.key, this.name);
			}
		}
	}

	/**
	 * Updates metadata of all media items in DB by their ids
	 * @param {string[]} moviesIds Game ids which should be updated
	 * @param {Notification} loader Loader to changed/close
	 * @param {string} loaderMsg Loader message
	 * @private
	 */
	_updateDbItems(moviesIds, loader, loaderMsg) {
		//@OVERRIDE should be defined
	}
}

export default MediaModel;
