import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

const styles = (theme) => ({
	root: {
		width: '2.5em',
		fontSize: '1em',
		position: 'fixed',
		right: 0,
		bottom: 0,
	},
	wrapper: {
		height: 'calc(100vh - 70px)',
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'space-evenly',
	},
	char: {
		display: 'block',
		textAlign: 'center',
	},
	link: {
		display: 'block',
		textDecoration: 'none',
		color: theme.palette.grey['400'],
		transition: theme.transitions.create('color'),
		'&:hover': {
			color: theme.palette.text.primary,
		},
	},
	disabledLink: {
		color: theme.palette.grey['300'],
		pointerEvents: 'none'
	},
	text: {
		lineHeight: '1',
		fontSize: '0.7rem',
	},
});

const chars = [
	'#',
	'a',
	'b',
	'c',
	'd',
	'e',
	'f',
	'g',
	'h',
	'i',
	'j',
	'k',
	'l',
	'm',
	'n',
	'o',
	'p',
	'q',
	'r',
	's',
	't',
	'u',
	'v',
	'w',
	'x',
	'y',
	'z',
];

/**
 * Alphabet used for fast scrolling between items
 */
class Alphabet extends PureComponent {
	/**
	 * Handles letter click
	 * @param {Event} e
	 */
	handleClick = (e) => {
		e.preventDefault();

		const href = e.target.href.split('#');
		const el = document.getElementById(href[1]);

		if (el) {
			window.scroll({
				top: el.offsetTop - 70,
				behavior: 'smooth',
			});
		}
	};

	render() {
		const { classes, className } = this.props;

		return (
			<div className={classes.root + (className ? ' ' + className : '')}>
				<div className={classes.wrapper}>
					{chars.map((char) => this._renderLetter(char))}
				</div>
			</div>
		);
	}

	/**
	 * Renders one letter
	 * @param {string} char Which char
	 * @return {JSX.Element}
	 * @private
	 */
	_renderLetter(char) {
		const { classes, activeLetters } = this.props;
		const id = char === '#' ? 'no' : char;

		let linkClassNames = classes.link;
		if(!activeLetters.includes(id)) {
			linkClassNames += ` ${classes.disabledLink}`;
		}

		return (
			<div key={id} className={classes.char}>
				<Typography variant="body2" className={classes.text}>
					<a href={`#${id}`} className={linkClassNames} onClick={this.handleClick}>
						{char.toUpperCase()}
					</a>
				</Typography>
			</div>
		);
	}
}

Alphabet.propTypes = {
	className: PropTypes.string,
	activeLetters: PropTypes.arrayOf(PropTypes.string)
};

export default withStyles(styles)(Alphabet);
