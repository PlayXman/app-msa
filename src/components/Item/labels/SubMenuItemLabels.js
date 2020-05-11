import React, { useState } from 'react';
import PropTypes from 'prop-types';
import LabelIcon from '@material-ui/icons/Label';
import SubMenuItem from '../submenu/SubMenuItem';
import AddLabelDialog from './AddLabelDialog';

const SubMenuItemLabels = ({ labels, onNewLabel, onRemoveLabel }) => {
	const [isOpen, open] = useState(false);

	return (
		<div>
			<SubMenuItem
				text="Labels"
				icon={<LabelIcon />}
				onClick={() => {
					open(true);
				}}
			/>
			<AddLabelDialog
				isOpen={isOpen}
				onClose={() => {
					open(false);
				}}
				labels={labels}
				onLabelAdd={onNewLabel}
				onLabelRemove={onRemoveLabel}
			/>
		</div>
	);
};

SubMenuItemLabels.propTypes = {
	labels: PropTypes.array,
	onNewLabel: PropTypes.func.isRequired,
	onRemoveLabel: PropTypes.func.isRequired,
};

export default SubMenuItemLabels;
