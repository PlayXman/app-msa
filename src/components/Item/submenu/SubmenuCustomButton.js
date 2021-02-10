import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, withStyles } from '@material-ui/core';
import CsfdIcon from './icons/CsfdIcon';
import ImdbIcon from './icons/ImdbIcon';
import TraktIcon from './icons/TraktIcon';

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
});

class SubmenuCustomButton extends Component {
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
			default:
				return null;
		}
	}
}

SubmenuCustomButton.propTypes = {
	variant: PropTypes.oneOf(['csfd', 'imdb', 'trakt']).isRequired,
	onClick: PropTypes.func,
};

export default withStyles(style)(SubmenuCustomButton);
