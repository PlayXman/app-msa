import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Card from '@material-ui/core/Card/Card';
import CardContent from '@material-ui/core/CardContent/CardContent';
import CardActions from '@material-ui/core/CardActions/CardActions';
import Typography from '@material-ui/core/Typography';
import withStyles from '@material-ui/core/styles/withStyles';
import Image from './Image';
import CardActionArea from '@material-ui/core/CardActionArea';
import ReleaseDate from './ReleaseDate';

const style = (theme) => ({
	card: {
		height: '100%',
		display: 'flex',
		flexDirection: 'column',
		outline: 'transparent 4px solid',
		transition: theme.transitions.create('outline-color')
	},
	cardHighlight: {
		outlineColor: theme.palette.secondary.main
	},
	clickableArea: {
		display: 'flex',
		width: '100%',
		flexGrow: 1,
		flexDirection: 'column',
		justifyContent: 'flex-start',
		alignItems: 'stretch',
	},
	media: {
		objectFit: 'cover',
		height: 208,
	},
	textCont: {
		padding: 10,
	},
	buttonsCont: {
		padding: `${theme.spacing(0.5)}px ${theme.spacing(1)}px`,
	},
});

/**
 * Main item component.
 */
class Item extends PureComponent {
	render() {
		const { title, releaseDate, imageUrl, isReleased, children, classes, onClick, highlight } = this.props;

		let cardClassNames = classes.card;
		if(highlight) {
			cardClassNames += ` ${classes.cardHighlight}`;
		}

		return (
			<Card elevation={0} className={cardClassNames}>
				<CardActionArea className={classes.clickableArea} onClick={onClick}>
					<Image src={imageUrl} />
					<CardContent className={classes.textCont}>
						<Typography gutterBottom variant="body2">
							{title}
						</Typography>
						<Typography variant="body2">
							<ReleaseDate date={releaseDate} isReleased={isReleased} />
						</Typography>
					</CardContent>
				</CardActionArea>

				<CardActions className={classes.buttonsCont}>{children}</CardActions>
			</Card>
		);
	}
}

Item.propTypes = {
	title: PropTypes.string,
	imageUrl: PropTypes.string,
	releaseDate: PropTypes.string,
	isReleased: PropTypes.bool,
	children: PropTypes.oneOfType([PropTypes.element, PropTypes.arrayOf(PropTypes.element)]),
	onClick: PropTypes.func,
	highlight: PropTypes.bool,
};

export default withStyles(style)(Item);
