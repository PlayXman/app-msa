import React, {Component} from 'react';
import withStyles from "@material-ui/core/styles/withStyles";
import Tooltip from "@material-ui/core/Tooltip/Tooltip";
import PropTypes from "prop-types";

const style = ( theme ) => ({
	item: {
		width: 0,
		height: 0,
		borderStyle: 'solid',
		borderWidth: '15px 0 0 15px',
		borderColor: 'transparent transparent transparent ' + theme.palette.background.default
	},
	cont: {
		position: 'absolute',
		left: 0,
		bottom: 0
	}
});

/**
 * Shows release state.
 */
class Released extends Component {

	/**
	 * Renders if props.show is true.
	 * @return {Component|null}
	 */
	renderItem() {
		const {classes} = this.props;

		if (this.props.show) {
			return (
				<Tooltip disableFocusListener title="Released">
					<div className={classes.item} />
				</Tooltip>
			);
		} else {
			return null;
		}
	}

	render() {
		const {classes} = this.props;

		return (
			<div className={classes.cont}>
				{this.renderItem()}
			</div>
		);
	}
}

Released.propTypes = {
	show: PropTypes.bool
};

export default withStyles(style)(Released);
