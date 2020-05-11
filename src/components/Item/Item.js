import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Card from '@material-ui/core/Card/Card';
import CardContent from '@material-ui/core/CardContent/CardContent';
import CardActions from '@material-ui/core/CardActions/CardActions';
import Typography from '@material-ui/core/Typography';
import withStyles from '@material-ui/core/styles/withStyles';
import Grid from '@material-ui/core/Grid/Grid';
import OwnageBtn from './OwnageBtn';
import Image from './Image';
import CardActionArea from '@material-ui/core/CardActionArea';
import Labels from './labels/Labels';
import SubMenu from './submenu/SubMenu';
import ReleaseDate from './ReleaseDate';

const style = (theme) => ({
	cont: {
		width: 158,
	},
	card: {
		height: '100%',
		display: 'flex',
		flexDirection: 'column',
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
});

/**
 * Main item component.
 */
class Item extends PureComponent {
	state = {
		openSubmenu: false,
	};

	handleSubmenuOpen = () => {
		this.setState({
			openSubmenu: true,
		});
	};

	handleSubmenuClose = () => {
		this.setState({
			openSubmenu: false,
		});
	};

	render() {
		const {
			id,
			itemId,
			title,
			releaseDate,
			imageUrl,
			isReleased,
			ownageStatus,
			labels,
			children,
			classes,
		} = this.props;
		const { openSubmenu } = this.state;

		const actionsClasses = {
			smallBtn: classes.smallBtn,
			smallIcon: classes.smallIcon,
		};

		return (
			<Grid item className={classes.cont} id={id}>
				<Card elevation={0} className={classes.card}>
					<CardActionArea
						className={classes.clickableArea}
						onClick={this.handleSubmenuOpen}
					>
						<Image src={imageUrl} />
						<CardContent className={classes.textCont}>
							<Typography gutterBottom variant="body1">
								{title}
							</Typography>
							<Typography variant="body2">
								<ReleaseDate date={releaseDate} isReleased={isReleased} />
							</Typography>
						</CardContent>
					</CardActionArea>

					<CardActions className={classes.buttonsCont}>
						<OwnageBtn
							classes={actionsClasses}
							released={isReleased}
							ownageStatus={ownageStatus}
							itemKey={itemId}
						/>
						<Labels labels={labels} />
					</CardActions>
				</Card>
				<SubMenu open={openSubmenu} onClose={this.handleSubmenuClose} itemID={itemId}>
					{children}
				</SubMenu>
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
	labels: PropTypes.array,
	children: PropTypes.oneOfType([PropTypes.element, PropTypes.arrayOf(PropTypes.element)]),
};

export default withStyles(style)(Item);
