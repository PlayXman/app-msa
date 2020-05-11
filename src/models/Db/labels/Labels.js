import { database } from 'firebase';
import Label from './Label';

class Labels {
	static DB_PATH = '/Labels';

	/**
	 * @param {string} modelName
	 * @returns {Promise<Label[]>} All labels in DB
	 */
	static getLabels(modelName) {
		return this.getDbRef(modelName)
			.once('value')
			.then((snapshot) => {
				const labels = [];

				snapshot.forEach((item) => {
					const label = new Label();
					label.key = item.key;
					label.count = item.val();
					labels.push(label);
				});

				return labels;
			});
	}

	/**
	 * Creates new label or increases its count
	 * @param {string} name Label name
	 * @param {string} modelName
	 * @returns {Promise<Label>}
	 */
	static addLabel(name, modelName) {
		const ref = this.getDbRef(modelName);
		const label = new Label();
		label.key = name;

		return new Promise((resolve) => {
			ref.child(label.key)
				.once('value')
				.then((snapshot) => {
					const count = snapshot.val();

					if (count === null) {
						label.count = 1;
						ref.child(label.key)
							.set(1)
							.then(() => {
								resolve(label);
							});
					} else {
						label.count = count + 1;

						ref.update({
							[label.key]: label.count,
						}).then(() => {
							resolve(label);
						});
					}
				});
		});
	}

	/**
	 * @param {string} name Label name
	 * @param {string} modelName
	 * @returns {Promise<void, void>}
	 */
	static removeLabel(name, modelName) {
		const ref = this.getDbRef(modelName);
		const label = new Label();
		label.key = name;

		return new Promise((resolve, reject) => {
			ref.child(label.key)
				.once('value')
				.then((snapshot) => {
					const count = snapshot.val();

					if (count === null) {
						reject();
					} else if (count - 1 < 1) {
						ref.child(label.key)
							.remove()
							.then(() => {
								resolve();
							});
					} else {
						label.count = count - 1;

						ref.update({
							[label.key]: label.count,
						}).then(() => {
							resolve();
						});
					}
				});
		});
	}

	/**
	 * @param {string} modelName
	 * @returns {firebase.database.Reference}
	 */
	static getDbRef(modelName) {
		return database().ref(`${this.DB_PATH}/${modelName}`);
	}
}

export default Labels;
