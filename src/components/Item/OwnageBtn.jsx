import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import IconButton from '@material-ui/core/IconButton/IconButton';
import Tooltip from '@material-ui/core/Tooltip/Tooltip';
import OwnageStatus from '../../models/Helpers/OwnageStatus';
import { CheckBox as CheckBoxIcon } from '@material-ui/icons';
import GlobalStorage, { STORAGE_NAMES } from '../../models/Helpers/GlobalStorage/GlobalStorage';

const stateData = {
	DEFAULT: {
		notReleased: {
			title: 'Not Released',
			color: 'disabled',
		},
		released: {
			title: 'Released',
			color: 'inherit',
		},
	},
	DOWNLOADABLE: {
		title: 'Downloadable',
		color: 'primary',
	},
	OWNED: {
		title: 'Owned',
		color: 'secondary',
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
		const { classes } = this.props;
		const stateData = this.getStateData();

		return (
			<Tooltip disableFocusListener title={stateData.title}>
				<IconButton className={classes.smallBtn} onClick={this.handleClick}>
					<CheckBoxIcon className={classes.smallIcon} color={stateData.color} />
				</IconButton>
			</Tooltip>
		);
	}
}

OwnageBtn.propTypes = {
	released: PropTypes.bool,
	ownageStatus: PropTypes.oneOf(['DEFAULT', 'DOWNLOADABLE', 'OWNED']),
	classes: PropTypes.object,
	itemKey: PropTypes.string.isRequired,
};

export default OwnageBtn;
