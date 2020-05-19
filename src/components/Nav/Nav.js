import React, { Component } from 'react';
import PropTypes from 'prop-types';
import TopBar from './TopBar';
import SideMenu from './SideMenu';

/**
 * All nav components
 */
class Nav extends Component {
	state = {
		isSideMenuOpen: false,
	};

	/**
	 * Handles side menu open
	 */
	handleSideMenuOpen = () => {
		this.setState({
			isSideMenuOpen: true,
		});
	};

	/**
	 * Handles side menu close
	 */
	handleSideMenuClose = () => {
		this.setState({
			isSideMenuOpen: false,
		});
	};

	render() {
		return (
			<React.Fragment>
				<TopBar title={this.props.title} sidemenuOpenHandler={this.handleSideMenuOpen} />
				<SideMenu
					open={this.state.isSideMenuOpen}
					handleOpen={this.handleSideMenuOpen}
					handleClose={this.handleSideMenuClose}
				/>
			</React.Fragment>
		);
	}
}

Nav.propTypes = {
	title: PropTypes.string,
};

export default Nav;
