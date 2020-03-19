import React, { PureComponent } from 'react';
import { withStyles } from "@material-ui/core";

const style = {
	root: {
		padding: '0 6px',
		maxWidth: '1110px',
		margin: '0 auto',
		width: '100%',
		boxSizing: 'border-box'
	}
};

/**
 * Content wrapper
 */
class Wrapper extends PureComponent {

	render() {
		const { classes, children } = this.props;

		return (
			<div className={classes.root}>
				{children}
			</div>
		);
	}

}

export default withStyles( style )( Wrapper );
