import React, { useState } from 'react';
import PropTypes from 'prop-types';
import TextField from '@material-ui/core/TextField';
import IconButton from '@material-ui/core/IconButton';
import { Clear as ClearIcon } from '@material-ui/icons';
import InputAdornment from '@material-ui/core/InputAdornment';
import {makeStyles} from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
	form: {
		padding: `0 ${theme.spacing(3)}px`
	}
}));

const SearchField = ({ onSubmit }) => {
	const [text, setText] = useState('');
	const classes = useStyles();

	return (
		<form
			onSubmit={(e) => {
				e.preventDefault();
				onSubmit(text);
			}}
			className={classes.form}
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
