import { CircularProgress, withStyles } from '@material-ui/core';
import React, { PureComponent } from 'react';

const style = {
	loaderWrapper: {
		height: '70vh',
		display: 'flex',
		alignItems: 'center',
	},
};

/**
 * Loader during all items load
 */
class ListLoader extends PureComponent {
	render() {
		return (
			<div className={this.props.classes.loaderWrapper}>
				<CircularProgress />
			</div>
		);
	}
}

export default withStyles(style)(ListLoader);
