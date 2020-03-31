import React, { PureComponent } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { InputBase } from '@material-ui/core';
import GlobalStorage from '../../models/Helpers/GlobalStorage/GlobalStorage';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';
import { Clear as ClearIcon } from '@material-ui/icons';

const styles = (theme) => ({
	root: {
		display: 'flex',
		background: theme.palette.background.default,
		borderRadius: 4,
		height: '100%',
		padding: '0 3%',
	},
});

/**
 * Search input in top bar
 */
class TextSearch extends PureComponent {
	state = {
		/** @type {MediaModel} */
		mediaModel: null,
		/** @type {FilterActions} */
		searchActions: null,
		text: '',
	};
	/** @type {GlobalStorageObserver} */
	currentMediaModelObserver;
	/** @type {GlobalStorageObserver} */
	searchActionsObserver;
	textKeyStrokeTimer = null;

	componentDidMount() {
		this.currentMediaModelObserver = GlobalStorage.connect('currentMediaModel', (obj) => {
			this.setState({
				mediaModel: obj,
			});
		});

		this.searchActionsObserver = GlobalStorage.connect('filterActions', (obj) => {
			this.setState({
				searchActions: obj,
			});
		});
	}

	componentWillUnmount() {
		this.currentMediaModelObserver.disconnect();
		this.searchActionsObserver.disconnect();
	}

	/**
	 * Handles input value change
	 * @param {Event} e
	 */
	handleChange = (e) => {
		this.setState({
			text: e.target.value,
		});
	};

	/**
	 * Handles text change after a user stopped writing
	 */
	handleTextChange = () => {
		clearTimeout(this.textKeyStrokeTimer);

		this.textKeyStrokeTimer = setTimeout(() => {
			this.state.searchActions.searchByText(this.state.text);
			this.state.searchActions.filter();
		}, 300);
	};

	/**
	 * Clears text from input
	 */
	handleClear = () => {
		this.setState({
			text: '',
		});

		this.handleTextChange();
	};

	render() {
		const { text } = this.state;
		const { classes } = this.props;

		return (
			<InputBase
				className={classes.root}
				placeholder="Search..."
				onChange={this.handleChange}
				onKeyUp={this.handleTextChange}
				value={text}
				type="text"
				endAdornment={
					text.length ? (
						<InputAdornment position="end">
							<IconButton aria-label="Clear search" onClick={this.handleClear}>
								<ClearIcon />
							</IconButton>
						</InputAdornment>
					) : null
				}
			/>
		);
	}
}

export default withStyles(styles)(TextSearch);
