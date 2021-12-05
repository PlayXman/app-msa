import React, { Component } from 'react';
import Typography from '@material-ui/core/Typography';
import Grid from '../../node_modules/@material-ui/core/Grid/Grid';
import withStyles from '@material-ui/core/styles/withStyles';
import { Link } from 'react-router-dom';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import {
	LocalMovies as LocalMoviesIcon,
	VideogameAsset as VideogameAssetIcon,
	Book as BookIcon,
	LiveTv as LiveTvIcon,
} from '@material-ui/icons';

const style = (theme) => ({
	cont: {
		padding: 20,
		minHeight: '100vh',
	},
	cardIconWrapper: {
		background: theme.palette.primary.light,
		textAlign: 'center',
		color: theme.palette.background.default,
		textShadow: '0 1px 3px rgba(0, 0, 0, 0.29)',
		height: '100%',
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
	},
	items: {
		paddingBottom: '3rem',
	},
});

class Home extends Component {
	_renderItem = (item) => {
		const { classes } = this.props;

		return (
			<Grid item key={item.link} xs={12} sm>
				<Card>
					<CardActionArea component={Link} to={item.link}>
						<Grid container>
							<Grid item xs={4} sm={12}>
								<CardContent className={classes.cardIconWrapper}>
									{item.icon}
								</CardContent>
							</Grid>
							<Grid item xs="auto" sm={12}>
								<CardContent>
									<Typography variant="h6">{item.title}</Typography>
								</CardContent>
							</Grid>
						</Grid>
					</CardActionArea>
				</Card>
			</Grid>
		);
	};

	render() {
		const { classes } = this.props;

		const btns = [
			{
				title: 'Movies',
				link: 'movies',
				icon: <LocalMoviesIcon />,
			},
			{
				title: 'Games',
				link: 'games',
				icon: <VideogameAssetIcon />,
			},
			{
				title: 'Books',
				link: 'books',
				icon: <BookIcon />,
			},
			{
				title: 'Tv Shows',
				link: 'tv-shows',
				icon: <LiveTvIcon />,
			},
		];
		const renderItem = this._renderItem;

		return (
			<Grid
				container
				justifyContent="center"
				direction="column"
				alignItems="center"
				className={classes.cont}
			>
				<Grid item>
					<Typography variant="h5" align="center" gutterBottom>
						MediaStorage App
					</Typography>
					<Grid container justifyContent="center" spacing={4} className={classes.items}>
						{btns.map(renderItem)}
					</Grid>
				</Grid>
			</Grid>
		);
	}
}

export default withStyles(style)(Home);
