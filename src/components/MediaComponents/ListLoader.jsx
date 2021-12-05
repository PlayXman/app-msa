import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid/Grid';
import Skeleton from '@material-ui/lab/Skeleton';

const useStyles = makeStyles({
	cont: {
		width: 158,
	},
	row: {
		marginBottom: '0.5rem',
	},
});

const ListLoader = () => {
	const classes = useStyles();

	return (
		<React.Fragment>
			{Array(6)
				.fill(undefined)
				.map((val, i) => (
					<Grid item className={classes.cont} key={i}>
						<Skeleton
							className={classes.row}
							variant="rect"
							width="100%"
							height={200}
						/>
						<Skeleton className={classes.row} variant="text" />
						<Skeleton className={classes.row} variant="text" width="50%" />
						<Skeleton variant="circle" width={20} height={20} />
					</Grid>
				))}
		</React.Fragment>
	);
};

export default ListLoader;
