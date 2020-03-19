import React, { PureComponent } from 'react';
import IconButton from "@material-ui/core/IconButton";
import { FilterList as FilterListIcon } from "@material-ui/icons";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import GlobalStorage from "../../models/Helpers/GlobalStorage/GlobalStorage";
import OwnageStatus from "../../models/Helpers/OwnageStatus";
import { withStyles } from "@material-ui/core";

const styles = (theme) => ({
	selected: {
		background: theme.palette.secondary.light
	}
});

/**
 * Filters media items
 */
class Filter extends PureComponent {

	state = {
		anchorEl: null,
		selected: 0
	};
	/** @type {FilterActions} */
	filterActions;
	/** @type {*[]} Menu items */
	items = [
		{
			title: 'All',
			action: () => {
				this.filterActions.reset();
				this.filterActions.filter();
			}
		},
		{
			title: 'Not Released',
			action: () => {
				this.filterActions.reset();
				this.filterActions.searchByRelease( false );
				this.filterActions.filter();
			}
		},
		{
			title: 'Released',
			action: () => {
				this.filterActions.reset();
				this.filterActions.searchByRelease( true );
				this.filterActions.filter();
			}
		},
		{
			title: 'Downloadable',
			action: () => {
				this.filterActions.reset();
				this.filterActions.searchByOwnageStatus( OwnageStatus.statuses.DOWNLOADABLE );
				this.filterActions.filter();
			}
		},
		{
			title: 'Owned',
			action: () => {
				this.filterActions.reset();
				this.filterActions.searchByOwnageStatus( OwnageStatus.statuses.OWNED );
				this.filterActions.filter();
			}
		},
	];

	constructor( props ) {
		super( props );

		this.filterActions = GlobalStorage.getState( 'filterActions' );
	}

	/**
	 * Handles menu open
	 * @param {Event} event
	 */
	handleOpen = ( event ) => {
		this.setState( {
			anchorEl: event.currentTarget
		} );
	};

	/**
	 * Handles menu close
	 */
	handleClose = () => {
		this.setState( {
			anchorEl: null
		} );
	};

	/**
	 * Handles menu item click
	 * @param {number} index Item index
	 * @param {function} action Item action
	 * @return {Function}
	 */
	handleItemClick( index, action ) {
		return () => {
			this.setState( {
				selected: index,
				anchorEl: null
			} );

			action();
		};
	}

	render() {
		const { classes } = this.props;
		const { anchorEl, selected } = this.state;
		const open = !!anchorEl;

		return (
			<div>
				<IconButton
					aria-label="Filter"
					aria-owns={open ? 'filter-menu' : undefined}
					aria-haspopup="true"
					onClick={this.handleOpen}
					className={selected > 0 ? classes.selected : null}
				>
					<FilterListIcon />
				</IconButton>
				<Menu id="filter-menu" anchorEl={anchorEl} open={open} onClose={this.handleClose}>
					{this._renderItems()}
				</Menu>
			</div>
		);
	}

	/**
	 * Renders menu items
	 * @return {React.Component[]}
	 * @private
	 */
	_renderItems() {
		const selected = this.state.selected;

		return this.items.map( ( item, index ) => {
			return (
				<MenuItem
					key={index}
					selected={selected === index}
					onClick={this.handleItemClick( index, item.action )}
				>
					{item.title}
				</MenuItem>
			);
		} );
	}

}

export default withStyles( styles )( Filter );
