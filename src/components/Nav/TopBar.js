import React, { Component } from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from "@material-ui/core/Tooltip/Tooltip";
import PropTypes from "prop-types";
import {
	Menu as MenuIcon,
	Add as AddIcon,
	Sync as SyncIcon
} from "@material-ui/icons";
import Grid from "@material-ui/core/Grid";
import GlobalStorage from "../../models/Helpers/GlobalStorage/GlobalStorage";
import { withStyles } from "@material-ui/core";
import TextSearch from "./TextSearch";

const style = {
	root: {
		paddingLeft: 4,
		paddingRight: 4
	}
};

/**
 * App top navigation bar
 */
class TopBar extends Component {

	state = {
		showMediaMenu: false,
		mediaModel: null
	};
	currentMediaModelListener;
	addItemContainer;

	constructor( props ) {
		super( props );

		this.addItemContainer = GlobalStorage.getState( 'addItemContainer' );
	}

	componentDidMount() {
		this.currentMediaModelListener = GlobalStorage.connect( 'currentMediaModel', ( data ) => {
			this.setState( {
				mediaModel: data,
				showMediaMenu: !!data
			} );
		} );
	}

	componentWillUnmount() {
		this.currentMediaModelListener.disconnect();
	}

	render() {
		const { sidemenuOpenHandler, classes } = this.props;
		const { showMediaMenu, mediaModel } = this.state;

		return (
			<div>
				<AppBar elevation={3}>
					<Toolbar className={classes.root}>
						<Grid container justify="space-between" spacing={8}>
							<Grid item xs="auto">
								<Grid container alignItems="center" spacing={8}>
									<Grid item xs="auto">
										<IconButton onClick={sidemenuOpenHandler} color="inherit" aria-label="Menu">
											<MenuIcon />
										</IconButton>
									</Grid>
								</Grid>
							</Grid>

							{showMediaMenu ? (
								<React.Fragment>
									<Grid item xs>
										<TextSearch />
									</Grid>
									<Grid item xs="auto">
										<Tooltip title="Refresh items" disableFocusListener>
											<IconButton onClick={mediaModel.handleItemsRefresh} color="inherit">
												<SyncIcon />
											</IconButton>
										</Tooltip>

										<Tooltip title="Add item" disableFocusListener>
											<IconButton color="inherit" onClick={this.addItemContainer.handleOpen}>
												<AddIcon />
											</IconButton>
										</Tooltip>
									</Grid>
								</React.Fragment>
							) : null}
						</Grid>
					</Toolbar>
				</AppBar>
			</div>
		);
	}

}

TopBar.propTypes = {
	sidemenuOpenHandler: PropTypes.func.isRequired
};

export default withStyles( style )( TopBar );
