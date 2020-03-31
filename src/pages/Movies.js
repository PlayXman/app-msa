import React, { Component } from 'react';
import MoviesMediaModel from '../models/MediaModels/MoviesMediaModel';
import GlobalStorage from '../models/Helpers/GlobalStorage/GlobalStorage';
import SubMenuItem from '../components/Item/SubMenuItem';
import { Info as InfoIcon, CloudDownload as CloudDownloadIcon } from '@material-ui/icons';
import MediaPageContent from '../components/MediaPageContent';

/**
 * Page about movies
 */
class Movies extends Component {
	/** @type {MoviesMediaModel} */
	mediaModel;
	/** @type {GlobalStorageObserver} */
	traktObserver;

	constructor(props) {
		super(props);

		this.mediaModel = new MoviesMediaModel();
		GlobalStorage.set('currentMediaModel', this.mediaModel);

		this.traktObserver = GlobalStorage.connect('trakt', (val) => {
			if (val) {
				this.mediaModel.syncItems();
			}
		});
	}

	componentWillUnmount() {
		this.traktObserver.disconnect();
	}

	render() {
		return (
			<MediaPageContent
				heading="Movies"
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

export default Movies;
