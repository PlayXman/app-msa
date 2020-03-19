import React, { PureComponent } from 'react';
import AddItemBar from "./AddItemBar";
import GlobalStorage from "../../models/Helpers/GlobalStorage/GlobalStorage";

/**
 * Container for add item dialog
 */
class AddItemContainer extends PureComponent {

	state = {
		open: false
	};

	constructor( props ) {
		super( props );

		GlobalStorage.set( 'addItemContainer', {
			handleOpen: this.handleOpen.bind( this )
		} );
	}

	/**
	 * Handler for opening the dialog
	 */
	handleOpen = () => {
		this.setState( {
			open: true
		} )
	};

	/**
	 * Handler for closing the dialog
	 */
	handleClose = () => {
		this.setState( {
			open: false
		} )
	};

	render() {
		const { open } = this.state;

		return (
			<div>
				<AddItemBar open={open} handleClose={this.handleClose} />
			</div>
		);
	}

}

export default AddItemContainer;
