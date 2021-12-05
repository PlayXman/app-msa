import React, { useState } from 'react';
import PropTypes from 'prop-types';
import TextField from '@material-ui/core/TextField';
import IconButton from '@material-ui/core/IconButton';
import { Clear as ClearIcon } from '@material-ui/icons';
import InputAdornment from '@material-ui/core/InputAdornment';

const SearchField = ({ onSubmit }) => {
	const [text, setText] = useState('');

	return (
		<form
			onSubmit={(e) => {
				e.preventDefault();
				onSubmit(text);
			}}
		>
			<TextField
				placeholder="Type the name..."
				type="text"
				margin="normal"
				color="secondary"
				variant="outlined"
				autoFocus
				fullWidth
				value={text}
				onChange={(e) => setText(e.target.value)}
				InputProps={{
					endAdornment: text.length ? (
						<InputAdornment position="end">
							<IconButton aria-label="Clear search" onClick={() => setText('')}>
								<ClearIcon />
							</IconButton>
						</InputAdornment>
					) : null,
				}}
			/>
		</form>
	);
};

SearchField.propTypes = {
	onSubmit: PropTypes.func.isRequired,
};

export default SearchField;
