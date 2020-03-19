import React, { PureComponent } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Typography from "@material-ui/core/Typography";

const styles = ( theme ) => ({
	root: {
		position: 'relative',
		width: '2em',
		fontSize: '1em',
	},
	wrapper: {
		position: 'fixed',
		height: 'calc(100vh - 70px)',
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'space-evenly'
	},
	char: {
		width: '2em',
		display: 'block',
		textAlign: 'center',
	},
	link: {
		display: 'block',
		textDecoration: 'none',
		color: theme.palette.grey["400"],
		transition: theme.transitions.create( 'color' ),
		"&:hover": {
			color: theme.palette.text.primary
		}
	},
	text: {
		lineHeight: '1'
	}
});

const chars = [ '#', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z' ];

/**
 * Alphabet used for fast scrolling between items
 */
class Alphabet extends PureComponent {

	/**
	 * Handles letter click
	 * @param {Event} e
	 */
	handleClick = ( e ) => {
		e.preventDefault();

		const href = e.target.href.split( '#' );
		const el = document.getElementById( href[1] );

		if ( el ) {
			window.scroll( {
				top: (el.offsetTop - 70),
				behavior: "smooth"
			} );
		}
	};

	render() {
		const { classes } = this.props;

		return (
			<div className={classes.root}>
				<div className={classes.wrapper}>
					{chars.map( char => this._renderLetter( char ) )}
				</div>
			</div>
		);
	}

	/**
	 * Renders one letter
	 * @param {string} char Which char
	 * @return {React}
	 * @private
	 */
	_renderLetter( char ) {
		const { classes } = this.props;
		const id = char === '#' ? 'no' : char;

		return (
			<div key={id} className={classes.char}>
				<Typography variant="body2" className={classes.text}>
					<a
						href={`#${id}`}
						className={classes.link}
						onClick={this.handleClick}
					>
						{char.toUpperCase()}
					</a>
				</Typography>
			</div>
		);
	}
}

export default withStyles( styles )( Alphabet );
