import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import IconButton from '@material-ui/core/IconButton';
import ListItem from '@material-ui/core/ListItem';
import { Add as AddIcon } from '@material-ui/icons';
import Notification from '../../models/Notification';
import { withStyles } from '@material-ui/core';

const style = {
	avatar: {
		width: '3rem',
		height: '3rem',
	},
};

/**
 * Item in search dialog
 */
class Item extends PureComponent {
	state = {
		isAdded: false,
	};

	/**
	 * Handles item save
	 */
	handleAdd = () => {
		const { id, currentMediaModel } = this.props;
		const alert = new Notification();

		currentMediaModel
			.addItem(id)
			.then((response) => {
				if (response.alreadySaved) {
					alert.setText('Item already saved');
				} else {
					alert.setText('Item saved');
				}

				this.setState({
					isAdded: true,
				});
				alert.showAndHide();
			})
			.catch(() => {
				alert.setText("Can't save");
				alert.showAndHide();
			});
	};

	render() {
		const { title, releaseDate, imageUrl, classes } = this.props;
		const { isAdded } = this.state;

		return (
			<ListItem>
				<ListItemAvatar>
					<Avatar src={imageUrl} className={classes.avatar} />
				</ListItemAvatar>
				<ListItemText primary={title} secondary={releaseDate} />
				<ListItemSecondaryAction>
					{!isAdded ? (
						<IconButton aria-label="Add" onClick={this.handleAdd}>
							<AddIcon />
						</IconButton>
					) : null}
				</ListItemSecondaryAction>
			</ListItem>
		);
	}
}

Item.propTypes = {
	id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
	currentMediaModel: PropTypes.object.isRequired,
	title: PropTypes.string,
	releaseDate: PropTypes.string,
	imageUrl: PropTypes.string,
};

export default withStyles(style)(Item);
