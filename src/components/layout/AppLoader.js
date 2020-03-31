import React, { PureComponent } from 'react';
import { CircularProgress, withStyles } from '@material-ui/core';

const style = {
	root: {
		display: 'flex',
		height: '100vh',
		alignItems: 'center',
		justifyContent: 'center',
	},
};

/**
 * Loader before all app is loaded
 */
class AppLoader extends PureComponent {
	render() {
		const { classes } = this.props;

		return (
			<div className={classes.root}>
				<CircularProgress />
			</div>
		);
	}
}

export default withStyles(style)(AppLoader);
