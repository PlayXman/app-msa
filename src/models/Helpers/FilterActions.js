import Url from './Url';

/**
 * Helps with filtering the media items
 */
class FilterActions {
	/** @type {React.Component|React.PureComponent} */
	mediaContainer;
	conditions = {
		text: '',
		releasedState: null,
		ownageStatus: null,
	};

	/**
	 * @param {React.Component|React.PureComponent} mediaContainer Component with all loaded media items
	 */
	constructor(mediaContainer) {
		this.mediaContainer = mediaContainer;
	}

	/**
	 * Run filter according previously set conditions
	 */
	filter() {
		const mc = this.mediaContainer;
		const items = {};

		Object.keys(mc.state.items).forEach((itemId) => {
			const item = mc.state.items[itemId];
			let show = true;

			if (this.conditions.text) {
				show &= Url.slugify(item.data.title).includes(this.conditions.text);
			}

			if (this.conditions.releasedState !== null) {
				show &= item.isReleased === this.conditions.releasedState;
			}

			if (this.conditions.ownageStatus) {
				show &= item.data.status === this.conditions.ownageStatus;
			}

			item.show = show;
			items[itemId] = item;
		});

		mc.setState({
			items: items,
		});
	}

	/**
	 * Sets all conditions to default settings
	 */
	reset() {
		this.conditions.text = '';
		this.conditions.releasedState = null;
		this.conditions.ownageStatus = null;
	}

	/**
	 * Filters media items by text
	 * @param {string} text
	 */
	searchByText(text) {
		this.conditions.text = Url.slugify(text);
	}

	/**
	 * Filters media items by release status
	 * @param {boolean} released
	 */
	searchByRelease(released) {
		this.conditions.releasedState = released;
	}

	/**
	 * Filters media items by ownage status
	 * @param {OwnageStatus.statuses} status
	 */
	searchByOwnageStatus(status) {
		this.conditions.ownageStatus = status;
	}
}

export default FilterActions;
