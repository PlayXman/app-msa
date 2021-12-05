import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Typography, withStyles } from '@material-ui/core';

const style = (theme) => ({
	root: {
		textAlign: 'center',
		fontWeight: 'bold',
		fontSize: '1.5rem',
		margin: '7rem 0',
		color: theme.palette.grey['300'],
	},
});

/**
 * Text if no items found
 */
class Text extends PureComponent {
	render() {
		const { text, classes } = this.props;

		return (
			<Typography variant="body1" className={classes.root}>
				{text}
			</Typography>
		);
	}
}

Text.propTypes = {
	text: PropTypes.string.isRequired,
};

export default withStyles(style)(Text);
