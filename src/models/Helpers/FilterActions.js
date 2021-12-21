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
		label: false,
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
		const items = new Map();
		const text = Url.slugify(this.conditions.text);

		mc.state.items.forEach((item, itemId) => {
			let show = true;

			if (text && !this.conditions.label) {
				show &= item.data.slug.includes(text);
			}
			if (this.conditions.releasedState !== null) {
				show &= item.isReleased === this.conditions.releasedState;
			}
			if (this.conditions.ownageStatus) {
				show &= this.conditions.ownageStatus.includes(item.data.status);
			}
			if (this.conditions.label) {
				show &= item.data.labels.includes(this.conditions.text);
			}

			item.show = Boolean(show);
			items.set(itemId, item);
		});

		mc.setState({
			items: items,
		});
	}

	/**
	 * Resets filter by media item params
	 */
	resetParams() {
		this.conditions.releasedState = null;
		this.conditions.ownageStatus = null;
	}

	/**
	 * Resets filter by text search bar
	 */
	resetSearch() {
		this.conditions.text = '';
		this.conditions.label = false;
	}

	/**
	 * Filters media items by text
	 * @param {string} text
	 */
	searchByText(text) {
		this.conditions.text = text;
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
	 * @param {string[]} statuses From "OwnageStatus.statuses"
	 */
	searchByOwnageStatus(statuses) {
		this.conditions.ownageStatus = statuses;
	}

	/**
	 * Filters media items by label
	 * @param {boolean} isLabel If true, uses text as label name
	 */
	searchByLabel(isLabel) {
		this.conditions.label = isLabel;
	}
}

export default FilterActions;
