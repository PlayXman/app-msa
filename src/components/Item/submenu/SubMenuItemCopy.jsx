import React from 'react';
import PropTypes from 'prop-types';
import { FileCopy as FileCopyIcon } from '@material-ui/icons';
import SubMenuItem from './SubMenuItem';
import Clipboard from '../../../models/Helpers/Clipboard';
import Notification from '../../../models/Notification';

const SubMenuItemCopy = ({ textToCopy }) => {
	return (
		<SubMenuItem
			text="Copy title"
			icon={<FileCopyIcon />}
			onClick={() => {
				const msg = new Notification();
				Clipboard.copy(textToCopy)
					.then(() => {
						msg.setText('Title copied');
					})
					.catch(() => {
						msg.setText('Not copied');
					})
					.finally(() => {
						msg.showAndHide();
					});
			}}
		/>
	);
};

SubMenuItemCopy.propTypes = {
	textToCopy: PropTypes.string.isRequired,
};

export default SubMenuItemCopy;
