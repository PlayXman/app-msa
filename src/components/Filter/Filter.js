import React, { useState } from 'react';
import IconButton from '@material-ui/core/IconButton';
import GlobalStorage, { STORAGE_NAMES } from '../../models/Helpers/GlobalStorage/GlobalStorage';
import OwnageStatus from '../../models/Helpers/OwnageStatus';
import Tooltip from '@material-ui/core/Tooltip/Tooltip';
import FilterListIcon from '@material-ui/icons/FilterList';
import { makeStyles } from '@material-ui/core/styles';
import Modal from './Modal';

const useStyles = makeStyles((theme) => ({
	filtered: {
		background: theme.palette.text.primary,
	},
}));

const Filter = () => {
	const classes = useStyles();
	const [isOpen, open] = useState(false);
	const [isFiltered, filtered] = useState(false);

	/** @type {FilterActions} */
	const filterActions = GlobalStorage.getState(STORAGE_NAMES.filterActions);

	/** @type {{}} */
	const filterTypes = {
		notReleased: {
			label: 'Not Released',
			action: () => {
				filterActions.searchByRelease(false);
			},
			group: ['released'],
		},
		released: {
			label: 'Released',
			action: () => {
				filterActions.searchByRelease(true);
			},
			group: ['notReleased'],
		},
		downloadable: {
			label: 'Downloadable',
			action: () => {
				filterActions.searchByOwnageStatus([OwnageStatus.statuses.DOWNLOADABLE]);
			},
			group: ['owned', 'notOwned'],
		},
		owned: {
			label: 'Owned',
			action: () => {
				filterActions.searchByOwnageStatus([OwnageStatus.statuses.OWNED]);
			},
			group: ['downloadable', 'notOwned'],
		},
		notOwned: {
			label: 'Not Owned',
			action: () => {
				filterActions.searchByOwnageStatus([
					OwnageStatus.statuses.DEFAULT,
					OwnageStatus.statuses.DOWNLOADABLE,
				]);
			},
			group: ['downloadable', 'owned'],
		},
	};

	const handleOpen = () => {
		open(true);
	};

	/**
	 * @param {Set<string>} activeFilters
	 */
	const handleUpdate = (activeFilters) => {
		filterActions.resetParams();

		if (activeFilters.size) {
			activeFilters.forEach((filter) => {
				filterTypes[filter].action();
			});
			filtered(true);
		} else {
			filtered(false);
		}

		filterActions.filter();
		open(false);
	};

	return (
		<>
			<Tooltip title="Filter" disableFocusListener>
				<IconButton
					aria-label="Filter"
					aria-owns={open ? 'filter-menu' : undefined}
					aria-haspopup="true"
					onClick={handleOpen}
					className={isFiltered ? classes.filtered : null}
					color="inherit"
				>
					<FilterListIcon />
				</IconButton>
			</Tooltip>
			<Modal
				open={isOpen}
				onClose={handleUpdate}
				filters={(() => {
					const obj = {};
					Object.keys(filterTypes).forEach((key) => {
						obj[key] = {
							label: filterTypes[key].label,
							group: filterTypes[key].group,
						};
					});
					return obj;
				})()}
			/>
		</>
	);
};

export default Filter;
