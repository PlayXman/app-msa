import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Card from '@material-ui/core/Card/Card';
import CardContent from '@material-ui/core/CardContent/CardContent';
import CardActions from '@material-ui/core/CardActions/CardActions';
import Typography from '@material-ui/core/Typography';
import withStyles from '@material-ui/core/styles/withStyles';
import Grid from '@material-ui/core/Grid/Grid';
import Released from './Released';
import OwnageBtn from './OwnageBtn';
import SubMenu from './SubMenu';
import Image from './Image';
import CopyBtn from './CopyBtn';

const style = {
	cont: {
		flexBasis: 158,
	},
	card: {
		height: '100%',
		display: 'flex',
		flexDirection: 'column',
	},
	media: {
		objectFit: 'cover',
		height: 208,
	},
	textCont: {
		paddingTop: 10,
		paddingLeft: 10,
		paddingRight: 10,
		paddingBottom: 0,
		flexGrow: 1,
	},
	date: {
		fontSize: '0.65rem',
	},
	buttonsCont: {
		position: 'relative',
	},
	statusIconCont: {
		display: 'flex',
		alignItems: 'center',
		color: '#bdbdbd',
	},
	smallBtn: {
		padding: 8,
	},
	smallIcon: {
		fontSize: 16,
	},
};

/**
 * Main item component.
 */
class Item extends PureComponent {
	render() {
		const {
			id,
			itemId,
			title,
			releaseDate,
			imageUrl,
			isReleased,
			ownageStatus,
			children,
			classes,
		} = this.props;
		const actionsClasses = {
			smallBtn: classes.smallBtn,
			smallIcon: classes.smallIcon,
		};

		return (
			<Grid item className={classes.cont} id={id}>
				<Card elevation={0} className={classes.card}>
					<Image src={imageUrl} />
					<CardContent className={classes.textCont}>
						<Typography gutterBottom variant="body1">
							{title}
						</Typography>
						<Typography variant="caption" className={classes.date}>
							{releaseDate}
						</Typography>
					</CardContent>

					<CardActions className={classes.buttonsCont}>
						<Released show={isReleased} />
						<Grid container justify="space-between" alignItems="center">
							<Grid item className={classes.statusIconCont}>
								<OwnageBtn
									classes={actionsClasses}
									released={isReleased}
									ownageStatus={ownageStatus}
									itemKey={itemId}
								/>
							</Grid>
							<Grid item>
								<CopyBtn classes={actionsClasses} textToCopy={this.props.title} />

								<SubMenu classes={actionsClasses} itemKey={itemId}>
									{children}
								</SubMenu>
							</Grid>
						</Grid>
					</CardActions>
				</Card>
			</Grid>
		);
	}
}

Item.propTypes = {
	id: PropTypes.string,
	itemId: PropTypes.string.isRequired,
	title: PropTypes.string,
	imageUrl: PropTypes.string,
	releaseDate: PropTypes.string,
	isReleased: PropTypes.bool,
	ownageStatus: PropTypes.oneOf(['DEFAULT', 'DOWNLOADABLE', 'OWNED']),
	children: PropTypes.oneOfType([PropTypes.element, PropTypes.arrayOf(PropTypes.element)]),
};

export default withStyles(style)(Item);
