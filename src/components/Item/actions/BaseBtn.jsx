import React from 'react';
import PropTypes from 'prop-types';
import IconButton from "@material-ui/core/IconButton/IconButton";
import Tooltip from "@material-ui/core/Tooltip/Tooltip";
import {makeStyles} from "@material-ui/core/styles";

const useStyles = makeStyles({
	smallBtn: {
		padding: 8,
	},
	smallIcon: {
		fontSize: 16,
	},
});

const BaseBtn = ({label, Icon, IconProps, onClick}) => {
	const classes = useStyles();

	return (
		<Tooltip disableFocusListener title={label}>
			<IconButton className={classes.smallBtn} onClick={onClick}>
				<Icon className={classes.smallIcon} {...IconProps} />
			</IconButton>
		</Tooltip>
	);
};

BaseBtn.propTypes = {
	label: PropTypes.string.isRequired,
	onClick: PropTypes.func,
	Icon: PropTypes.elementType,
	IconProps: PropTypes.object
};

export default BaseBtn;
