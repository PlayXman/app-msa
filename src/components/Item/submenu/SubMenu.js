import React from 'react';
import PropTypes from 'prop-types';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import { Delete as DeleteIcon } from '@material-ui/icons';
import SubMenuItem from './SubMenuItem';
import GlobalStorage from '../../../models/Helpers/GlobalStorage/GlobalStorage';

const SubMenu = ({ open, onClose, itemID, children }) => {
	const mediaModel = GlobalStorage.getState('currentMediaModel');

	const handleRemoveItem = () => {
		mediaModel.removeItem(itemID);
	};

	return (
		<Drawer anchor="bottom" open={open} onClose={onClose}>
			<List>{children}</List>
			<Divider />
			<List>
				<SubMenuItem
					onClick={handleRemoveItem}
					icon={<DeleteIcon />}
					text="Delete"
					confirm
				/>
			</List>
		</Drawer>
	);
};

SubMenu.propTypes = {
	open: PropTypes.bool,
	onClose: PropTypes.func,
	itemID: PropTypes.string.isRequired,
	children: PropTypes.node,
};

export default SubMenu;
