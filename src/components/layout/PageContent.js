import React, { PureComponent } from 'react';
import witchStyles from '@material-ui/core/styles/withStyles';
import Grid from '@material-ui/core/Grid';
import Wrapper from './Wrapper';

const style = {
	main: {
		padding: '70px 0 6em',
	},
};

/**
 * Page content
 */
class PageContent extends PureComponent {
	render() {
		const { classes, children } = this.props;

		return (
			<main className={classes.main}>
				<Wrapper>
					<Grid container justify="center">
						<Grid item xs>
							{children}
						</Grid>
					</Grid>
				</Wrapper>
			</main>
		);
	}
}

export default witchStyles(style)(PageContent);
