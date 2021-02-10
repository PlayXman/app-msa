import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core';
import ListItem from '@material-ui/core/ListItem';
import Grid from '@material-ui/core/Grid';

const style = (theme) => ({});

/**
 * Item's submenu item with custom set of buttons
 */
class SubMenuItemCustom extends Component {
	render() {
		const { items } = this.props;

		return (
			<ListItem>
				<Grid container spacing={1}>
					{items.map((child, index) => (
						<Grid item xs sm="auto" key={`submenuItem.${index}`}>
							{child}
						</Grid>
					))}
				</Grid>
			</ListItem>
		);
	}
}

SubMenuItemCustom.propTypes = {
	items: PropTypes.arrayOf(PropTypes.node).isRequired,
};

export default withStyles(style)(SubMenuItemCustom);
