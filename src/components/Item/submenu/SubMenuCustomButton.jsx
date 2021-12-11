import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, withStyles } from '@material-ui/core';
import CsfdIcon from './icons/CsfdIcon';
import ImdbIcon from './icons/ImdbIcon';
import TraktIcon from './icons/TraktIcon';
import SteamIcon from './icons/SteamIcon';
import GamespotIcon from './icons/GamespotIcon';
import GamesIcon from './icons/GamesIcon';

const style = (theme) => ({
	root: {
		width: '100%',
		height: '2.5em',
		'& .MuiButton-label': {
			height: '100%',
		},
		'& svg': {
			width: 'auto',
			height: '100%',
			display: 'block',
			maxWidth: '100%',
			maxHeight: '100%',
		},
	},
	csfd: {
		background: '#ba0305',
		'&:hover': {
			backgroundColor: '#d21517',
		},
		'&:active': {
			backgroundColor: '#990305',
		},
	},
	imdb: {
		background: '#F5C518',
		'&:hover': {
			backgroundColor: '#fcdb5f',
		},
		'&:active': {
			backgroundColor: '#cba311',
		},
	},
	trakt: {
		background: '#ed1c24',
		'&:hover': {
			backgroundColor: '#f64046',
		},
		'&:active': {
			backgroundColor: '#b80f14',
		},
	},
	steam: {
		background: '#1b2838',
		'&:hover': {
			backgroundColor: '#243447',
		},
		'&:active': {
			backgroundColor: '#121b26',
		},
	},
	gamespot: {
		fill: '#FFDD00',
		background: '#2b2d31',
		'&:hover': {
			backgroundColor: '#3e4045',
		},
		'&:active': {
			backgroundColor: '#191c1d',
		},
	},
	games: {
		background: '#161616',
		'&:hover': {
			backgroundColor: '#313131',
		},
		'&:active': {
			backgroundColor: '#070707',
		},
	},
});

class SubMenuCustomButton extends Component {
	render() {
		const { classes, variant, onClick } = this.props;

		const btnClasses = [classes.root];
		btnClasses.push(classes[variant]);

		return (
			<Button disableRipple className={btnClasses.join(' ')} onClick={onClick}>
				{this._renderIcon()}
			</Button>
		);
	}

	_renderIcon() {
		switch (this.props.variant) {
			case 'csfd':
				return <CsfdIcon />;
			case 'imdb':
				return <ImdbIcon />;
			case 'trakt':
				return <TraktIcon />;
			case 'steam':
				return <SteamIcon />;
			case 'gamespot':
				return <GamespotIcon />;
			case 'games':
				return <GamesIcon />;
			default:
				return null;
		}
	}
}

SubMenuCustomButton.propTypes = {
	variant: PropTypes.oneOf(['csfd', 'imdb', 'trakt', 'steam', 'gamespot', 'games']).isRequired,
	onClick: PropTypes.func,
};

export default withStyles(style)(SubMenuCustomButton);
