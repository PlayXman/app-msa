import React, { Component } from 'react';
import TvShowsMediaModel from '../models/MediaModels/TvShowsMediaModel';
import GlobalStorage, { STORAGE_NAMES } from '../models/Helpers/GlobalStorage/GlobalStorage';
import MediaPageContent from '../components/MediaPageContent';
import SubMenuItemCopy from '../components/Item/submenu/SubMenuItemCopy';
import SubMenuItemLabels from '../components/Item/labels/SubMenuItemLabels';
import Trakt from '../models/vendors/Trakt';
import SubMenuItemCustom from '../components/Item/submenu/SubMenuItemCustom';
import SubMenuCustomButton from '../components/Item/submenu/SubMenuCustomButton';

/**
 * Page about movies
 */
class TvShows extends Component {
	/** @type {TvShowsMediaModel} */
	mediaModel;
	/** @type {GlobalStorageObserver} */
	traktObserver;

	constructor(props) {
		super(props);

		this.mediaModel = new TvShowsMediaModel();
		GlobalStorage.set(STORAGE_NAMES.currentMediaModel, this.mediaModel);
	}

	componentDidMount() {
		this.traktObserver = GlobalStorage.connect(STORAGE_NAMES.trakt, (val) => {
			if (val) {
				this.mediaModel.syncItems();
			} else {
				const trakt = new Trakt();
				trakt.authenticate().then(() => {
					GlobalStorage.set(STORAGE_NAMES.trakt, trakt);
				});
			}
		});
	}

	componentWillUnmount() {
		this.traktObserver.disconnect();
	}

	render() {
		return (
			<MediaPageContent
				heading="Tv Shows"
				mediaModel={this.mediaModel}
				itemSubmenu={(itemObj) => {
					return [
						<SubMenuItemCustom
							key="info"
							items={[
								<SubMenuCustomButton
									variant="trakt"
									onClick={() => {
										this.mediaModel.showItemInfo('trakt', itemObj.title);
									}}
								/>,
								<SubMenuCustomButton
									variant="imdb"
									onClick={() => {
										this.mediaModel.showItemInfo('imdb', itemObj.title);
									}}
								/>,
								<SubMenuCustomButton
									variant="csfd"
									onClick={() => {
										this.mediaModel.showItemInfo('csfd', itemObj.title);
									}}
								/>,
							]}
						/>,
						<SubMenuItemCopy key="copy" textToCopy={itemObj.title} />,
						<SubMenuItemLabels
							key="labels"
							labels={itemObj.labels}
							onNewLabel={(name) => {
								return this.mediaModel.handleAddLabel(name, itemObj.getId());
							}}
							onRemoveLabel={(name) => {
								return this.mediaModel.handleRemoveLabel(name, itemObj.getId());
							}}
						/>,
					];
				}}
			/>
		);
	}
}

export default TvShows;
