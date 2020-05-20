import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import DialogContent from '@material-ui/core/DialogContent';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import Chip from '@material-ui/core/Chip';
import { makeStyles } from '@material-ui/core/styles';
import Autocomplete from '@material-ui/lab/Autocomplete';
import GlobalStorage, { STORAGE_NAMES } from '../../../models/Helpers/GlobalStorage/GlobalStorage';
import Labels from '../../../models/Db/labels/Labels';

const useStyles = makeStyles((theme) => ({
	chip: {
		marginBottom: theme.spacing(1),
		'&:not(:last-child)': {
			marginRight: theme.spacing(1),
		},
	},
}));

const AddLabelDialog = ({ isOpen, onClose, labels, onLabelAdd, onLabelRemove }) => {
	const classes = useStyles();
	const [isLoading, loading] = useState(false);
	const [allLabels, setAllLabels] = useState([]);
	const [value, setValue] = useState('');

	const handleSubmit = (e) => {
		e.preventDefault();

		if (!isLoading) {
			if (value && !labels.includes(value)) {
				loading(true);

				onLabelAdd(value).then(() => {
					setValue('');
					loading(false);
				});
			}
		}
	};

	const handleChange = (e, newVal) => {
		setValue(newVal);
	};

	useEffect(() => {
		const mediaModel = GlobalStorage.getState(STORAGE_NAMES.currentMediaModel);
		Labels.getLabels(mediaModel.name).then((labels) => {
			setAllLabels(labels.map((label) => label.key));
		});
	}, []);

	return (
		<Dialog open={isOpen} onClose={onClose} aria-label="Labels" fullWidth maxWidth="xs">
			<DialogContent>
				<form onSubmit={handleSubmit}>
					<Autocomplete
						freeSolo
						fullWidth
						options={allLabels}
						onChange={handleChange}
						value={value}
						renderInput={(params) => (
							<TextField
								{...params}
								autoFocus
								margin="dense"
								label="Add Label"
								type="text"
								variant="standard"
								disabled={isLoading}
							/>
						)}
					/>
				</form>
				<div>
					{labels.map((label) => (
						<Chip
							key={label}
							className={classes.chip}
							label={label}
							onDelete={() => {
								if (!isLoading) {
									onLabelRemove(label);
								}
							}}
						/>
					))}
				</div>
			</DialogContent>
		</Dialog>
	);
};

AddLabelDialog.propTypes = {
	isOpen: PropTypes.bool.isRequired,
	onClose: PropTypes.func.isRequired,
	labels: PropTypes.array,
	onLabelAdd: PropTypes.func.isRequired,
	onLabelRemove: PropTypes.func.isRequired,
};

export default AddLabelDialog;
