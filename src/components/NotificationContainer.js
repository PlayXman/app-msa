import React, { PureComponent } from 'react';
import { Snackbar, withStyles } from "@material-ui/core";
import Notification from "../models/Notification";
import IconButton from "@material-ui/core/IconButton";
import { Close as CloseIcon } from "@material-ui/icons";
import CircularProgress from "@material-ui/core/CircularProgress";

const style = {
	msgWrap: {
		display: 'flex',
		alignItems: 'center'
	},
	loader: {
		marginRight: '1em'
	}
};

/**
 * Shows snackbar with messages. Works even as loader. Can be only one per app
 *
 * @requires {Notification} As the controller
 */
class NotificationContainer extends PureComponent {

	state = {
		open: false,
		messageText: '',
		autoHideDuration: null,
		showCloseButton: false,
		showLoader: false
	};

	/**
	 * @param props
	 */
	constructor( props ) {
		super( props );

		Notification.reactObject = this;
	}

	/**
	 * Handles snackbar close
	 * @param event
	 * @param reason
	 */
	handleClose = ( event, reason ) => {
		if ( reason === 'clickaway' ) {
			return;
		}

		this.setState( {
			open: false
		} );
	};

	/**
	 * Renders text message. With or without loader
	 * @return {JSXElement}
	 * @private
	 */
	_renderMessage() {
		const { showLoader, messageText } = this.state;
		const {classes} = this.props;

		return (
			<div className={classes.msgWrap}>
				{showLoader ? <CircularProgress className={classes.loader} /> : null}
				<div>{messageText}</div>
			</div>
		);
	}

	render() {
		const { open, autoHideDuration, showCloseButton } = this.state;

		return (
			<Snackbar
				anchorOrigin={{
					vertical: 'bottom',
					horizontal: 'center',
				}}
				open={open}
				autoHideDuration={autoHideDuration}
				onClose={this.handleClose}
				message={this._renderMessage()}
				action={showCloseButton ? [
					<IconButton
						key="close"
						aria-label="Close"
						color="inherit"
						onClick={this.handleClose}
					>
						<CloseIcon />
					</IconButton>,
				] : []}
			/>
		);
	}

}

export default withStyles( style )(NotificationContainer);
