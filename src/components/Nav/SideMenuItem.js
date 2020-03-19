import React, {Component} from 'react';
import PropTypes from 'prop-types';
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText/ListItemText";
import {Link, Route} from "react-router-dom";

class SideMenuItem extends Component {
	render() {
		return (
			<Route path={this.props.to} exact children={({match}) => (
				<ListItem button disabled={!!match} component={Link} to={this.props.to}>
					<ListItemIcon>
						{this.props.icon}
					</ListItemIcon>
					<ListItemText primary={this.props.text} />
				</ListItem>
			)} />
		);
	}
}

SideMenuItem.propTypes = {
	to: PropTypes.string,
	icon: PropTypes.element,
	text: PropTypes.string
};

export default SideMenuItem;
