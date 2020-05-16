import React, {Component} from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip/Tooltip';
import PropTypes from 'prop-types';
import {Menu as MenuIcon, Sync as SyncIcon} from '@material-ui/icons';
import Grid from '@material-ui/core/Grid';
import GlobalStorage from '../../models/Helpers/GlobalStorage/GlobalStorage';
import {withStyles} from '@material-ui/core';
import TextSearch from './TextSearch';

const style = {
	root: {
		paddingLeft: 4,
		paddingRight: 4,
	},
};

/**
 * App top navigation bar
 */
class TopBar extends Component {

	/** @type {MediaModel} */
	mediaModel = null;

	constructor(props) {
		super(props);

		this.mediaModel = GlobalStorage.getState('currentMediaModel');
	}

	render() {
		const {sidemenuOpenHandler, classes} = this.props;

		return (
			<div>
				<AppBar elevation={3}>
					<Toolbar className={classes.root}>
						<Grid container justify="space-between" alignItems="center" wrap="nowrap">
							<Grid item xs="auto" sm={2}>
								<IconButton
									onClick={sidemenuOpenHandler}
									color="inherit"
									aria-label="Menu"
								>
									<MenuIcon />
								</IconButton>
							</Grid>
							<Grid item xs="auto" sm={4}>
								<TextSearch />
							</Grid>
							<Grid item xs="auto" sm={2}>
								<Grid container justify="flex-end">
									<Grid item>
										<Tooltip title="Refresh items" disableFocusListener>
											<IconButton
												onClick={this.mediaModel.handleItemsRefresh}
												color="inherit"
											>
												<SyncIcon />
											</IconButton>
										</Tooltip>
									</Grid>
								</Grid>
							</Grid>
						</Grid>
					</Toolbar>
				</AppBar>
			</div>
		);
	}
}

TopBar.propTypes = {
	sidemenuOpenHandler: PropTypes.func.isRequired,
};

export default withStyles(style)(TopBar);
