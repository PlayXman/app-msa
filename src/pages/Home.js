import React, { Component } from 'react';
import Typography from "@material-ui/core/Typography";
import PageContent from "../components/layout/PageContent";
import Grid from "../../node_modules/@material-ui/core/Grid/Grid";
import withStyles from "@material-ui/core/styles/withStyles";
import { Link } from "react-router-dom";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardContent from "@material-ui/core/CardContent";
import {
	LocalMovies as LocalMoviesIcon,
	VideogameAsset as VideogameAssetIcon,
	Book as BookIcon
} from "@material-ui/icons";

const style = ( theme ) => ({
	cont: {
		padding: 20
	},
	cardIconWrapper: {
		background: theme.palette.primary.light,
		textAlign: 'center',
		color: theme.palette.background.default,
		textShadow: '0 1px 3px rgba(0, 0, 0, 0.29)',
		height: '100%'
	}
});

class Home extends Component {

	_renderItem = ( item ) => {
		const { classes } = this.props;

		return (
			<Grid item key={item.link} xs={12} sm="auto">
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
									<Typography variant="h6">
										{item.title}
									</Typography>
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
				icon: <LocalMoviesIcon />
			},
			{
				title: 'Games',
				link: 'games',
				icon: <VideogameAssetIcon />
			},
			{
				title: 'Books',
				link: 'books',
				icon: <BookIcon />
			}
		];
		const renderItem = this._renderItem;

		return (
			<PageContent>
				<div className={classes.cont}>
					<Grid container justify="center" spacing={16}>
						{btns.map( renderItem )}
					</Grid>
				</div>
			</PageContent>
		);
	}

}

export default withStyles( style )( Home );
