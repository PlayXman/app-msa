import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Item from '../Item/Item';
import IconButton from '@material-ui/core/IconButton/IconButton';
import Tooltip from '@material-ui/core/Tooltip/Tooltip';
import { makeStyles } from '@material-ui/core/styles';
import AddIcon from '@material-ui/icons/Add';
import Notification from '../../models/Notification';

const useStyles = makeStyles({
	hide: {
		visibility: 'hidden',
	},
	smallBtn: {
		padding: 8,
	},
	smallIcon: {
		fontSize: 16,
	},
});

const NewItem = ({ id, currentMediaModel, title, releaseDate, imageUrl, infoUrl }) => {
	const classes = useStyles();
	const [isAdded, added] = useState(false);

	useEffect(() => {
		currentMediaModel
			.getDbRef()
			.child(id)
			.once('value')
			.then((snapshot) => {
				if (snapshot.exists()) {
					added(true);
				}
			});
	}, [currentMediaModel, id]);

	const handleAdd = () => {
		const alert = new Notification();

		currentMediaModel
			.addItem(id)
			.then((response) => {
				if (response.alreadySaved) {
					alert.setText('Item already saved');
				} else {
					alert.setText('Item saved');
				}

				added(true);
				alert.showAndHide();
			})
			.catch(() => {
				alert.setText("Can't save");
				alert.showAndHide();
			});
	};

	const handleClick = () => {

		currentMediaModel.showItemInfo('', infoUrl || title);
	};

	return (
		<Item
			title={title}
			releaseDate={currentMediaModel.getReleaseDate(releaseDate)}
			isReleased={currentMediaModel.isReleased(releaseDate)}
			imageUrl={imageUrl}
			onClick={handleClick}
		>
			<Tooltip disableFocusListener title="Save" className={isAdded ? classes.hide : ''}>
				<IconButton className={classes.smallBtn} onClick={handleAdd}>
					<AddIcon className={classes.smallIcon} />
				</IconButton>
			</Tooltip>
		</Item>
	);
};

NewItem.propTypes = {
	id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
	currentMediaModel: PropTypes.object.isRequired,
	title: PropTypes.string,
	releaseDate: PropTypes.string,
	imageUrl: PropTypes.string,
	infoUrl: PropTypes.string,
};

export default NewItem;
