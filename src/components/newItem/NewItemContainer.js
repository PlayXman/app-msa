import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import NewItemDialog from './NewItemDialog';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import { makeStyles } from '@material-ui/core/styles';
import GlobalStorage, { STORAGE_NAMES } from '../../models/Helpers/GlobalStorage/GlobalStorage';

const useStyles = makeStyles((theme) => ({
	cont: {
		width: '100%',
		height: '100vh',
		zIndex: 10,
		position: 'fixed',
		pointerEvents: 'none',
		'& > *': {
			pointerEvents: 'all',
		},
	},
	button: (props) => ({
		position: 'fixed',
		bottom: theme.spacing(1),
		right: theme.spacing(5),
		[theme.breakpoints.down(props.sm)]: {
			right: theme.spacing(1),
		},
	}),
	hide: {
		display: 'none',
	},
}));

const NewItemContainer = ({ sm }) => {
	const classes = useStyles({ sm: sm });
	const [isOpen, open] = useState(false);
	const [isMediaModelSet, mediaModel] = useState(false);

	useEffect(() => {
		const mediaModelListener = GlobalStorage.connect(
			STORAGE_NAMES.currentMediaModel,
			(model) => {
				if (model) {
					mediaModel(true);
				}
			}
		);

		return () => {
			mediaModelListener.disconnect();
		};
	}, []);

	return (
		<div className={classes.cont + (isMediaModelSet ? '' : ` ${classes.hide}`)}>
			<Fab
				color="secondary"
				aria-label="add"
				className={classes.button}
				onClick={() => {
					open(true);
				}}
			>
				<AddIcon />
			</Fab>
			<NewItemDialog
				open={isOpen}
				onClose={() => {
					open(false);
				}}
			/>
		</div>
	);
};

NewItemContainer.propTypes = {
	sm: PropTypes.number,
};

export default NewItemContainer;
