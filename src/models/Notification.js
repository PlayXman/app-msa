/**
 * Handles snackbar as notification or alert window. Presumes one NotificationContainer instance per app. And controls
 * it
 *
 * @requires {NotificationContainer} Single instance used in app
 */
class Notification {

	/** @type {NotificationContainer} Reference for single app NotificationContainer instance */
	static reactObject;
	/** @type {boolean} Should be as loader */
	isLoader = false;

	/**
	 * Constructor
	 * @param {boolean} isLoader Shows loader or not
	 */
	constructor( isLoader = false ) {
		this.hide();
		this.isLoader = isLoader;
	}

	/**
	 * Set text message. It's shown in snackbar. Can be changed even if the snackbar is visible
	 * @param {string} messageText
	 */
	setText( messageText ) {
		Notification.reactObject.setState( {
			messageText: messageText
		} );
	}

	/**
	 * Show snackbar. Must be closed manually!
	 */
	show() {
		Notification.reactObject.setState( {
			open: true,
			autoHideDuration: null,
			showCloseButton: false,
			showLoader: this.isLoader
		} );
	}

	/**
	 * Manual close of the snackbar
	 */
	hide() {
		Notification.reactObject.handleClose();
	}

	/**
	 * Shows snackbar for few seconds. It shows event close button
	 */
	showAndHide() {
		Notification.reactObject.setState( {
			open: true,
			autoHideDuration: 3000,
			showCloseButton: true,
			showLoader: this.isLoader
		} );
	}

}

export default Notification;
