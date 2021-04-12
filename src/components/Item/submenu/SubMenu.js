import React from 'react';
import PropTypes from 'prop-types';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import {Delete as DeleteIcon} from '@material-ui/icons';
import SubMenuItem from './SubMenuItem';
import GlobalStorage, {STORAGE_NAMES} from '../../../models/Helpers/GlobalStorage/GlobalStorage';
import Grid from "@material-ui/core/Grid";

const SubMenu = ({open, onClose, itemID, children}) => {
	const mediaModel = GlobalStorage.getState(STORAGE_NAMES.currentMediaModel);

	const handleRemoveItem = () => {
		mediaModel.removeItem(itemID);
	};

	return (
		<Drawer anchor="bottom" open={open} onClose={onClose}>
			<Grid container justify="center">
				<Grid item xs sm={6} md={4} lg={3} xl={2}>
					<List>{children}</List>
					<Divider/>
					<List>
						<SubMenuItem
							onClick={handleRemoveItem}
							icon={<DeleteIcon/>}
							text="Delete"
							confirm
						/>
					</List>
				</Grid>
			</Grid>
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
