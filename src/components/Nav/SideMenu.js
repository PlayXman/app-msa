import React, { Component } from 'react';
import PropTypes from 'prop-types';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import withStyles from '@material-ui/core/es/styles/withStyles';
import SideMenuItem from './SideMenuItem';
import {
	LocalMovies as LocalMoviesIcon,
	VideogameAsset as VideogameAssetIcon,
	Book as BookIcon,
} from '@material-ui/icons';
import Avatar from '@material-ui/core/Avatar';
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';

const style = (theme) => ({
	title: {
		padding: '2em',
		backgroundColor: theme.palette.primary.main,
		color: theme.palette.primary.contrastText,
	},
	logo: {
		margin: '0 auto 1rem',
		width: '4rem',
		height: '4rem',
		background: '#fff',
		'& img': {
			maxWidth: '70%',
			height: 'auto',
		},
	},
});

/**
 * Side menu
 */
class SideMenu extends Component {
	render() {
		const { open, handleOpen, handleClose, classes } = this.props;

		return (
			<SwipeableDrawer open={open} onOpen={handleOpen} onClose={handleClose}>
				<div className={classes.title}>
					<Typography variant="h6" color="inherit">
						<Avatar alt="MSA" src="/images/logo.svg" className={classes.logo} />
						MediaStorage App
					</Typography>
				</div>
				<List component="nav">
					<SideMenuItem to="/movies" icon={<LocalMoviesIcon />} text="Movies" />
					<SideMenuItem to="/games" icon={<VideogameAssetIcon />} text="Games" />
					<SideMenuItem to="/books" icon={<BookIcon />} text="Books" />
				</List>
			</SwipeableDrawer>
		);
	}
}

SideMenu.propTypes = {
	open: PropTypes.bool,
	handleOpen: PropTypes.func,
	handleClose: PropTypes.func,
};

export default withStyles(style)(SideMenu);
