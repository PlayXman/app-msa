import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import GlobalStorage, { STORAGE_NAMES } from '../../models/Helpers/GlobalStorage/GlobalStorage';
import Labels from '../../models/Db/labels/Labels';
import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';

const styles = (theme) => ({
	root: {
		borderRadius: 4,
		background: theme.palette.primary.light,
		'& input': {
			color: theme.palette.primary.contrastText,
		},
		'& input::placeholder': {
			opacity: 0.8,
			color: theme.palette.primary.contrastText,
		},
		'& .MuiAutocomplete-clearIndicator': {
			color: theme.palette.primary.contrastText,
		},
		'& .MuiOutlinedInput-notchedOutline': {
			borderColor: 'transparent !important',
		},
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
	 * @param {string} newVal
	 */
	handleChange = (e, newVal) => {
		const { labels } = this.state;

		this.setState({
			text: newVal,
		});

		if (newVal.length > 2 || newVal.length === 0) {
			this.searchActions.searchByText(newVal);
			this.searchActions.searchByLabel(labels.includes(newVal));
			this.searchActions.filter();
		}
	};

	render() {
		const { text, labels } = this.state;
		const { title, classes } = this.props;

		return (
			<Autocomplete
				freeSolo
				options={labels}
				onInputChange={this.handleChange}
				renderInput={(params) => (
					<TextField
						{...params}
						className={classes.root}
						placeholder={`Search for ${title}...`}
						margin="none"
						variant="outlined"
						value={text}
						type="text"
						size="small"
					/>
				)}
			/>
		);
	}
}

TextSearch.propTypes = {
	title: PropTypes.string,
};

export default withStyles(styles)(TextSearch);
