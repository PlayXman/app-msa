import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { SimpleImg } from 'react-simple-img';
import { withStyles } from "@material-ui/core";

const style = {
	loader: {
		background: '#292929',
		"& img": {
			objectFit: 'contain',
			width: 'auto',
			maxWidth: '101%',
			height: 'auto !important'
		}
	}
};

/**
 * Item card image
 */
class Image extends PureComponent {

	render() {
		const { src, classes } = this.props;

		return (
			<SimpleImg
				height={200}
				src={src}
				animationDuration={0.3}
				importance="low"
				className={classes.loader}
				placeholder="#292929"
			/>
		);
	}

}

Image.propTypes = {
	src: PropTypes.string.isRequired
};

export default withStyles( style )( Image );
