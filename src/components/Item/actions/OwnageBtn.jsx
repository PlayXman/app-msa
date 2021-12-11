import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import OwnageStatus from '../../../models/Helpers/OwnageStatus';
import BookmarkIcon from '@material-ui/icons/Bookmark';
import BookmarkBorderIcon from '@material-ui/icons/BookmarkBorder';
import GlobalStorage, { STORAGE_NAMES } from '../../../models/Helpers/GlobalStorage/GlobalStorage';
import BaseBtn from "./BaseBtn";

const stateData = {
	DEFAULT: {
		notReleased: {
			title: 'Not Released',
			color: 'disabled',
			icon: BookmarkBorderIcon
		},
		released: {
			title: 'Released',
			color: 'inherit',
			icon: BookmarkIcon
		},
	},
	DOWNLOADABLE: {
		title: 'Downloadable',
		color: 'primary',
		icon: BookmarkIcon
	},
	OWNED: {
		title: 'Owned',
		color: 'secondary',
		icon: BookmarkIcon
	},
};

/**
 * Item's status button.
 */
class OwnageBtn extends PureComponent {
	mediaModel;

	constructor(props) {
		super(props);

		this.mediaModel = GlobalStorage.getState(STORAGE_NAMES.currentMediaModel);
	}

	/**
	 * Returns data object for current state.
	 * @return {{}}
	 */
	getStateData() {
		const stateKey = this.props.ownageStatus;

		if (stateKey === 'DEFAULT') {
			const subState = this.props.released ? 'released' : 'notReleased';
			return stateData[stateKey][subState];
		} else {
			return stateData[stateKey];
		}
	}

	/**
	 * Changes state.
	 */
	handleClick = () => {
		const { ownageStatus, itemKey } = this.props;

		const item = this.mediaModel.createItem();
		item.setId(itemKey);
		item.status = OwnageStatus.getNext(ownageStatus);
		item.push();
	};

	render() {
		const stateData = this.getStateData();

		return (
			<BaseBtn
				label={stateData.title}
				Icon={stateData.icon}
				IconProps={{
					color: stateData.color
				}}
				onClick={this.handleClick}
			/>
		)
	}
}

OwnageBtn.propTypes = {
	released: PropTypes.bool,
	ownageStatus: PropTypes.oneOf(['DEFAULT', 'DOWNLOADABLE', 'OWNED']),
	itemKey: PropTypes.string.isRequired,
};

export default OwnageBtn;
