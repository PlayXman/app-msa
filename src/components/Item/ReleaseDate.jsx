import React from 'react';
import PropTypes from 'prop-types';
import ScheduleIcon from '@material-ui/icons/Schedule';
import {makeStyles} from '@material-ui/core/styles';
import Tooltip from '@material-ui/core/Tooltip/Tooltip';

const useStyles = makeStyles((theme) => ({
	date: {
		fontSize: '0.65rem',
	},
	icon: {
		fontSize: '0.65rem',
		verticalAlign: 'middle',
		color: theme.palette.grey['400'],
	},
}));

const ReleaseDate = ({date, isReleased}) => {
	const classes = useStyles();

	return (
		<Tooltip disableFocusListener title={isReleased ? "Released" : "Not released"}>
			<span>
				<span className={classes.date}>{date}</span>{' '}
				{!isReleased ? (
					<ScheduleIcon className={classes.icon}/>
				) : null}
			</span>
		</Tooltip>
	);
};

ReleaseDate.propTypes = {
	date: PropTypes.string,
	isReleased: PropTypes.bool,
};

export default ReleaseDate;
