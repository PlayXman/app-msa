import React, { Component } from 'react';
import Grid from '@material-ui/core/Grid/Grid';
import withStyles from '@material-ui/core/styles/withStyles';
import Text from '../Text';

const styles = {
	cont: {
		margin: '20vh 0',
	},
};

/**
 * Should be shown if there are no items.
 */
class NoItems extends Component {
	render() {
		const { classes } = this.props;

		return (
			<Grid item xs className={classes.cont}>
				<Text text="Nothing to show" />
			</Grid>
		);
	}
}

export default withStyles(styles)(NoItems);
