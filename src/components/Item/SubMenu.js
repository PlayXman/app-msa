import React, { Component } from 'react';
import PropTypes from 'prop-types';
import IconButton from "@material-ui/core/IconButton/IconButton";
import Menu from "@material-ui/core/Menu/Menu";
import { MoreVert as MoreVertIcon, Delete as DeleteIcon } from "@material-ui/icons";
import GlobalStorage from "../../models/Helpers/GlobalStorage/GlobalStorage";
import SubMenuItem from "./SubMenuItem";

/**
 * Item's menu.
 */
class SubMenu extends Component {

	state = {
		menuAnchorEl: null,
	};
	mediaModel;

	constructor( props ) {
		super( props );

		this.mediaModel = GlobalStorage.getState('currentMediaModel');
	}

	/**
	 * Opens submenu.
	 * @param event
	 */
	handleMenuOpen = ( event ) => {
		this.setState( {
			menuAnchorEl: event.currentTarget
		} );
	};

	/**
	 * Closes submenu.
	 */
	handleMenuClose = () => {
		this.setState( {
			menuAnchorEl: null
		} );
	};

	/**
	 * Removes item from DB
	 */
	handleRemoveItem = () => {
		this.mediaModel.removeItem(this.props.itemKey);
	};

	render() {
		const { classes, children } = this.props;
		const { menuAnchorEl } = this.state;

		return (
			<React.Fragment>
				<IconButton className={classes.smallBtn} onClick={this.handleMenuOpen}>
					<MoreVertIcon className={classes.smallIcon} />
				</IconButton>
				<Menu anchorEl={menuAnchorEl} open={!!menuAnchorEl} elevation={2} onClose={this.handleMenuClose}>

					{children}

					<SubMenuItem onClick={this.handleRemoveItem} icon={<DeleteIcon />} text="Delete" confirm />
				</Menu>
			</React.Fragment>
		);
	}

}

SubMenu.propTypes = {
	classes: PropTypes.object,
	itemKey: PropTypes.string.isRequired,
	children: PropTypes.oneOfType( [
		PropTypes.element,
		PropTypes.arrayOf( PropTypes.element )
	] )
};

export default SubMenu;
