import React, { useState } from 'react';
import PropTypes from 'prop-types';
import DialogContent from '@material-ui/core/DialogContent';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import Chip from '@material-ui/core/Chip';
import { makeStyles } from '@material-ui/core/styles';

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
	const handleSubmit = (e) => {
		e.preventDefault();

		if (!isLoading) {
			const field = e.target.labels;
			const label = field.value;

			if (label.length && !labels.includes(label)) {
				loading(true);

				onLabelAdd(label).then(() => {
					field.value = '';
					loading(false);
				});
			}
		}
	};

	return (
		<Dialog open={isOpen} onClose={onClose} aria-label="Labels">
			<DialogContent>
				<form onSubmit={handleSubmit}>
					<TextField
						autoFocus
						margin="dense"
						id="labels"
						label="Add Label"
						type="text"
						disabled={isLoading}
						fullWidth
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
