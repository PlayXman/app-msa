import React, { Component } from 'react';
import MoviesMediaModel from '../models/MediaModels/MoviesMediaModel';
import GlobalStorage, { STORAGE_NAMES } from '../models/Helpers/GlobalStorage/GlobalStorage';
import MediaPageContent from '../components/MediaPageContent';
import SubMenuItemCopy from '../components/Item/submenu/SubMenuItemCopy';
import SubMenuItemLabels from '../components/Item/labels/SubMenuItemLabels';
import Trakt from '../models/vendors/Trakt';
import SubMenuItemCustom from '../components/Item/submenu/SubMenuItemCustom';
import SubmenuCustomButton from '../components/Item/submenu/SubmenuCustomButton';

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
				heading="Movies"
				mediaModel={this.mediaModel}
				itemSubmenu={(itemObj) => {
					return [
						<SubMenuItemCustom
							key="info"
							items={[
								<SubmenuCustomButton
									variant="trakt"
									onClick={() => {
										this.mediaModel.showItemInfo('trakt', itemObj.title);
									}}
								/>,
								<SubmenuCustomButton
									variant="imdb"
									onClick={() => {
										this.mediaModel.showItemInfo('imdb', itemObj.title);
									}}
								/>,
								<SubmenuCustomButton
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
						/>
					];
				}}
			/>
		);
	}
}

export default Movies;
