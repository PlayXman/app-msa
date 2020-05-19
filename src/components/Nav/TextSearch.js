import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { InputBase } from '@material-ui/core';
import GlobalStorage, { STORAGE_NAMES } from '../../models/Helpers/GlobalStorage/GlobalStorage';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';
import { Clear as ClearIcon } from '@material-ui/icons';
import Labels from '../../models/Db/labels/Labels';

const styles = (theme) => ({
	root: {
		display: 'flex',
		background: theme.palette.primary.light,
		borderRadius: 4,
		padding: '0.2rem 5%',
		color: theme.palette.primary.contrastText,
		'& input::placeholder': {
			opacity: 0.8,
		},
		'& input::-webkit-calendar-picker-indicator': {
			display: 'none',
		},
	},
	reset: {
		color: theme.palette.primary.contrastText,
	},
});

/**
 * Search input in top bar
 */
class TextSearch extends PureComponent {
	state = {
		text: '',
		labels: [],
	};
	/** @type {MediaModel} */
	mediaModel = null;
	/** @type {FilterActions} */
	searchActions = null;

	constructor(props) {
		super(props);
		this.mediaModel = GlobalStorage.getState(STORAGE_NAMES.currentMediaModel);
		this.searchActions = GlobalStorage.getState(STORAGE_NAMES.filterActions);
	}

	componentDidMount() {
		Labels.getDbRef(this.mediaModel.name).on('value', (snap) => {
			const labels = snap.exists() ? Object.keys(snap.val()) : [];

			this.setState({
				labels: labels,
			});
		});
	}

	componentWillUnmount() {
		Labels.getDbRef(this.mediaModel.name).off();
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
		const { text, labels } = this.state;

		if (text.length > 2 || text.length === 0) {
			this.searchActions.searchByText(text);
			this.searchActions.searchByLabel(labels.includes(text));
			this.searchActions.filter();
		}
	};

	/**
	 * Clears text from input
	 */
	handleClear = () => {
		this.setState(
			{
				text: '',
			},
			() => {
				this.handleTextChange();
			}
		);
	};

	render() {
		const { text, labels } = this.state;
		const { title, classes } = this.props;

		return (
			<>
				<InputBase
					className={classes.root}
					placeholder={`Search for ${title}...`}
					onChange={this.handleChange}
					onKeyUp={this.handleTextChange}
					value={text}
					type="text"
					endAdornment={
						text.length ? (
							<InputAdornment position="end">
								<IconButton
									aria-label="Clear search"
									onClick={this.handleClear}
									className={classes.reset}
								>
									<ClearIcon />
								</IconButton>
							</InputAdornment>
						) : null
					}
					inputProps={{
						list: 'searchLabelsList',
					}}
				/>
				<datalist id="searchLabelsList">
					{labels.map((label) => (
						<option key={label}>{label}</option>
					))}
				</datalist>
			</>
		);
	}
}

TextSearch.propTypes = {
	title: PropTypes.string,
};

export default withStyles(styles)(TextSearch);
