import React, { Component } from 'react';
import GamesMediaModel from '../models/MediaModels/GamesMediaModel';
import GlobalStorage from '../models/Helpers/GlobalStorage/GlobalStorage';
import SubMenuItem from '../components/Item/SubMenuItem';
import { Info as InfoIcon, CloudDownload as CloudDownloadIcon } from '@material-ui/icons';
import MediaPageContent from '../components/MediaPageContent';

/**
 * Page about games
 */
class Games extends Component {
	mediaModel;

	constructor(props) {
		super(props);

		this.mediaModel = new GamesMediaModel();
		GlobalStorage.set('currentMediaModel', this.mediaModel);
	}

	render() {
		return (
			<MediaPageContent
				heading="Games"
				mediaModel={this.mediaModel}
				itemSubmenu={(itemObj) => {
					return [
						<SubMenuItem
							key="info"
							text="Info"
							icon={<InfoIcon />}
							onClick={() => {
								this.mediaModel.showItemInfo(itemObj.title);
							}}
						/>,
						<SubMenuItem
							key="download"
							text="Download"
							icon={<CloudDownloadIcon />}
							onClick={() => {
								this.mediaModel.downloadItem(itemObj.title);
							}}
						/>,
					];
				}}
			/>
		);
	}
}

export default Games;
