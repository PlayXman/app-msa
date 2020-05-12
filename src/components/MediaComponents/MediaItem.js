import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';
import Grid from '@material-ui/core/Grid/Grid';
import OwnageBtn from '../Item/OwnageBtn';
import Labels from '../Item/labels/Labels';
import SubMenu from '../Item/submenu/SubMenu';
import Item from '../Item/Item';

const style = {
	cont: {
		width: 158,
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
class MediaItem extends PureComponent {
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
				<Item
					title={title}
					releaseDate={releaseDate}
					imageUrl={imageUrl}
					isReleased={isReleased}
					onClick={this.handleSubmenuOpen}
				>
					<OwnageBtn
						classes={actionsClasses}
						released={isReleased}
						ownageStatus={ownageStatus}
						itemKey={itemId}
					/>
					<Labels labels={labels} />
				</Item>
				<SubMenu open={openSubmenu} onClose={this.handleSubmenuClose} itemID={itemId}>
					{children}
				</SubMenu>
			</Grid>
		);
	}
}

MediaItem.propTypes = {
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

export default withStyles(style)(MediaItem);
