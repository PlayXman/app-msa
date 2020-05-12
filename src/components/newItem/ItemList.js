import React from 'react';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import NewItem from './NewItem';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
	item: {
		width: 158,
	},
});

const ItemList = ({ items, currentMediaModel }) => {
	const classes = useStyles();

	return (
		<Grid container spacing={2} justify="center">
			{items.map((item) => {
				const key = item.getId();

				return (
					<Grid key={key} item className={classes.item}>
						<NewItem
							id={key}
							title={item.title}
							releaseDate={currentMediaModel.getReleaseDate(item.releaseDate)}
							imageUrl={item.imageUrl}
							currentMediaModel={currentMediaModel}
							infoUrl={item.infoUrl}
						/>
					</Grid>
				);
			})}
		</Grid>
	);
};

ItemList.propTypes = {
	items: PropTypes.array.isRequired,
	currentMediaModel: PropTypes.object.isRequired,
};

export default ItemList;
