import React, {Component} from 'react';
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid/Grid";
import withStyles from "@material-ui/core/styles/withStyles";

const styles = {
	cont: {
		margin: '20vh 0'
	}
};

/**
 * Should be shown if there are no items.
 */
class NoItems extends Component {
	render() {
		const {classes} = this.props;

		return (
			<Grid item className={classes.cont}>
				<Typography variant="caption" component="p">Nothing to show</Typography>
			</Grid>
		);
	}
}

export default withStyles(styles)(NoItems);
