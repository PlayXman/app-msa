import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import { withStyles } from '@material-ui/core';
import ListItem from '@material-ui/core/ListItem';

const style = (theme) => ({
	root: {
		background: theme.palette.error.main,
		'&:focus': {
			background: theme.palette.error.main,
		},
	},
});

/**
 * Item's submenu item
 */
class SubMenuItem extends Component {
	state = {
		showConfirm: false,
	};
	confirmationText = 'Confirm';

	/**
	 * Handle button click
	 */
	handleClick = () => {
		const { onClick, confirm } = this.props;

		if (confirm) {
			//confirm button
			if (this.state.showConfirm) {
				onClick();
				this.setState({
					showConfirm: false,
				});
			} else {
				this.setState({
					showConfirm: true,
				});
			}
		} else {
			//regular button
			onClick();
		}
	};

	render() {
		const { text, icon, classes } = this.props;
		const { showConfirm } = this.state;

		return (
			<ListItem
				button
				className={showConfirm ? classes.root : null}
				onClick={this.handleClick}
			>
				{icon ? <ListItemIcon>{icon}</ListItemIcon> : null}
				<ListItemText inset primary={showConfirm ? this.confirmationText : text} />
			</ListItem>
		);
	}
}

SubMenuItem.propTypes = {
	text: PropTypes.string,
	icon: PropTypes.element,
	onClick: PropTypes.func,
	confirm: PropTypes.bool,
};

export default withStyles(style)(SubMenuItem);
