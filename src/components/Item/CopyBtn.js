import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import IconButton from "@material-ui/core/IconButton/IconButton";
import Clipboard from "../../models/Helpers/Clipboard";
import Tooltip from "@material-ui/core/Tooltip/Tooltip";
import { FileCopy as FileCopyIcon } from "@material-ui/icons";
import Notification from "../../models/Notification";

/**
 * Copy button component
 */
class CopyBtn extends PureComponent {

	/**
	 * Copy button event
	 */
	handleClick = () => {
		Clipboard.copy( this.props.textToCopy );
		const msg = new Notification();
		msg.setText( 'Title copied' );
		msg.showAndHide();
	};

	render() {
		const { classes } = this.props;

		return (
			<React.Fragment>
				<Tooltip disableFocusListener title="Copy title">
					<IconButton className={classes.smallBtn} onClick={this.handleClick}>
						<FileCopyIcon className={classes.smallIcon} />
					</IconButton>
				</Tooltip>
			</React.Fragment>
		);
	}
}

CopyBtn.propTypes = {
	classes: PropTypes.object,
	textToCopy: PropTypes.string
};

export default CopyBtn;
