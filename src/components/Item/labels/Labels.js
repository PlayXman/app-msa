import React from 'react';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
	root: {
		textOverflow: 'ellipsis',
		overflow: 'hidden',
		whiteSpace: 'nowrap',
		fontFamily: 'Roboto Mono, sans-serif',
		fontSize: '0.5rem',
	},
});

const Labels = ({ labels }) => {
	const classes = useStyles();

	return (
		<Typography variant="body1" className={classes.root}>
			{labels ? labels.join(', ') : null}
		</Typography>
	);
};

Labels.propTypes = {
	labels: PropTypes.array,
};

export default Labels;
