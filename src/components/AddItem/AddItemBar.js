import React, { PureComponent } from 'react';
import Dialog from "@material-ui/core/Dialog/Dialog";
import AppBar from "@material-ui/core/AppBar/AppBar";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton/IconButton";
import withStyles from "@material-ui/core/es/styles/withStyles";
import Toolbar from "@material-ui/core/Toolbar/Toolbar";
import Slide from "@material-ui/core/Slide/Slide";
import { createMuiTheme } from "@material-ui/core/styles";
import MuiThemeProvider from "@material-ui/core/es/styles/MuiThemeProvider";
import Grid from "@material-ui/core/Grid/Grid";
import PropTypes from "prop-types";
import { Config } from "../../config";
import { Close as CloseIcon } from "@material-ui/icons";
import GlobalStorage from "../../models/Helpers/GlobalStorage/GlobalStorage";
import Text from "./Text";
import ItemList from "./ItemList";
import Wrapper from "../layout/Wrapper";
import SearchField from "./SearchField";

const style = {
	root: {
		paddingLeft: 4,
		paddingRight: 4
	},
	text: {
		paddingLeft: "1rem",
		flexGrow: 1
	}
};

const theme = createMuiTheme( Config.muiThemeAddItem );

/**
 * Whole add item dialog
 */
class AddItemBar extends PureComponent {

	state = {
		items: [],
		currentMediaModel: null,
		hasSearched: false
	};
	/** @type {GlobalStorageObserver} */
	currentMediaModelListener = null;

	componentDidMount() {
		this.currentMediaModelListener = GlobalStorage.connect( 'currentMediaModel', ( model ) => {
			this.setState( {
				currentMediaModel: model,
				hasSearched: false,
				items: []
			} )
		} );
	}

	componentWillUnmount() {
		this.currentMediaModelListener.disconnect()
	}

	/**
	 * Transition react element
	 * @param {{}} props
	 * @return {React}
	 * @constructor
	 */
	static Transition( props ) {
		return <Slide direction="up" {...props} />;
	}

	/**
	 * Handle form submit and search for items
	 * @param {string} searchText
	 */
	handleSearch = ( searchText ) => {
		const { currentMediaModel } = this.state;

		if ( searchText.length ) {
			currentMediaModel.searchItem( searchText ).then( ( items ) => {
				this.setState( {
					items: items,
					hasSearched: true
				} )
			} ).catch( () => {
				this.setState( {
					items: [],
					hasSearched: true
				} )
			} );
		}
	};

	render() {
		const { open, handleClose, classes } = this.props;

		return (
			<Dialog
				fullScreen
				open={open}
				onClose={handleClose}
				TransitionComponent={AddItemBar.Transition}
			>
				<MuiThemeProvider theme={theme}>
					<AppBar position="static">
						<Toolbar className={classes.root}>
							<Typography variant="h6" color="inherit" className={classes.text}>
								New Item
							</Typography>
							<IconButton color="inherit" onClick={handleClose} aria-label="Close">
								<CloseIcon />
							</IconButton>
						</Toolbar>
					</AppBar>
					<Wrapper>
						<Grid container justify="center">
							<Grid item xs sm={9} lg={6}>
								<SearchField onSubmit={this.handleSearch} />

								{this._renderItems()}
							</Grid>
						</Grid>
					</Wrapper>
				</MuiThemeProvider>
			</Dialog>
		);
	}

	/**
	 * Render items, or text messages
	 * @return {PureComponent}
	 * @private
	 */
	_renderItems() {
		const { hasSearched, items, currentMediaModel } = this.state;

		if ( !hasSearched ) {
			return <Text text="Start searching" />;
		} else if ( items.length ) {
			return <ItemList items={items} currentMediaModel={currentMediaModel} />
		} else {
			return <Text text="Nothing found" />;
		}
	}

}

AddItemBar.propTypes = {
	open: PropTypes.bool,
	handleClose: PropTypes.func.isRequired
};

export default withStyles( style )( AddItemBar );
