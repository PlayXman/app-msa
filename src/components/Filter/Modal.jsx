import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import DialogContent from '@material-ui/core/DialogContent';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';

const Modal = ({ open, onClose, filters }) => {
	const [fields, setFields] = useState(new Set());

	const handleChange = (filterKey) => {
		if (fields.has(filterKey)) {
			fields.delete(filterKey);
		} else {
			filters[filterKey].group.forEach((item) => {
				fields.delete(item);
			});
			fields.add(filterKey);
		}
		setFields(new Set(fields));
	};

	return (
		<Dialog
			disableEscapeKeyDown
			open={open}
			aria-label="Filter"
		>
			<DialogTitle>Filter</DialogTitle>
			<DialogContent dividers>
				<FormGroup>
					{Object.keys(filters).map((key) => (
						<FormControlLabel
							key={key}
							control={
								<Checkbox
									checked={fields.has(key)}
									onChange={() => {
										handleChange(key);
									}}
									name={key}
								/>
							}
							label={filters[key].label}
						/>
					))}
				</FormGroup>
			</DialogContent>
			<DialogActions>
				<Button
					color="secondary"
					onClick={() => {
						onClose(fields);
					}}
				>
					Done
				</Button>
			</DialogActions>
		</Dialog>
	);
};

Modal.propTypes = {
	open: PropTypes.bool,
	onClose: PropTypes.func.isRequired,
	filters: PropTypes.object.isRequired,
};

export default Modal;
