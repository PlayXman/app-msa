import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import TextField from '@material-ui/core/TextField';
import IconButton from '@material-ui/core/IconButton';
import { Clear as ClearIcon } from '@material-ui/icons';
import InputAdornment from '@material-ui/core/InputAdornment';

/**
 * Search input field
 */
class SearchField extends PureComponent {
	state = {
		text: '',
	};

	/**
	 * Handle item text change
	 * @param {Event} event
	 */
	handleChange = (event) => {
		this.setState({
			text: event.target.value,
		});
	};

	/**
	 * Clears text from input
	 */
	handleClear = () => {
		this.setState({
			text: '',
		});
	};

	/**
	 * Handles form submit
	 * @param {Event} e
	 */
	handleSubmit = (e) => {
		e.preventDefault();

		this.props.onSubmit(this.state.text);
	};

	render() {
		const { text } = this.state;

		return (
			<form onSubmit={this.handleSubmit}>
				<TextField
					placeholder="Type the name..."
					type="text"
					margin="normal"
					autoFocus
					fullWidth
					value={text}
					onChange={this.handleChange}
					InputProps={{
						endAdornment: text.length ? (
							<InputAdornment position="end">
								<IconButton aria-label="Clear search" onClick={this.handleClear}>
									<ClearIcon />
								</IconButton>
							</InputAdornment>
						) : null,
					}}
				/>
			</form>
		);
	}
}

SearchField.propTypes = {
	onSubmit: PropTypes.func.isRequired,
};

export default SearchField;
