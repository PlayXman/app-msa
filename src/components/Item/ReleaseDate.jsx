import React from 'react';
import PropTypes from 'prop-types';
import StarIcon from '@material-ui/icons/Star';
import { makeStyles } from '@material-ui/core/styles';
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

const ReleaseDate = ({ date, isReleased }) => {
	const classes = useStyles();

	return (
		<React.Fragment>
			<span className={classes.date}>{date}</span>{' '}
			{isReleased ? (
				<Tooltip disableFocusListener title="Released">
					<StarIcon className={classes.icon} />
				</Tooltip>
			) : null}
		</React.Fragment>
	);
};

ReleaseDate.propTypes = {
	date: PropTypes.string,
	isReleased: PropTypes.bool,
};

export default ReleaseDate;
