import React, { Component } from 'react';
import BooksMediaModel from '../models/MediaModels/BooksMediaModel';
import GlobalStorage from '../models/Helpers/GlobalStorage/GlobalStorage';
import SubMenuItem from '../components/Item/SubMenuItem';
import { Info as InfoIcon } from '@material-ui/icons';
import MediaPageContent from '../components/MediaPageContent';

/**
 * Page about books
 */
class Books extends Component {
	mediaModel;

	constructor(props) {
		super(props);

		this.mediaModel = new BooksMediaModel();
		GlobalStorage.set('currentMediaModel', this.mediaModel);
	}

	render() {
		return (
			<MediaPageContent
				heading="Books"
				mediaModel={this.mediaModel}
				itemSubmenu={(itemObj) => {
					return [
						<SubMenuItem
							key="info"
							text="Info"
							icon={<InfoIcon />}
							onClick={() => {
								this.mediaModel.showItemInfo(itemObj.infoUrl);
							}}
						/>,
					];
				}}
			/>
		);
	}
}

export default Books;
