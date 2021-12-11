import React from 'react';
import PropTypes from 'prop-types';
import {Chip, Grid} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
	root: {
		padding: theme.spacing(2),
		paddingTop: 0
	}
}));

const SubMenuLabels = ({labels}) => {
	const classes = useStyles();

	if(labels.length === 0) {
		return null;
	}

	return (
		<div className={classes.root}>
			<Grid container spacing={1}>
				{labels.map(label => {
					return (
						<Grid item key={label}>
							<Chip label={label} size="small"/>
						</Grid>
					)
				})}
			</Grid>
		</div>
	);
};

SubMenuLabels.propTypes = {
	labels: PropTypes.arrayOf(PropTypes.string)
};

export default SubMenuLabels;
