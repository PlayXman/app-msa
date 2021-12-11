import React, { Component } from 'react';
import GamesMediaModel from '../models/MediaModels/GamesMediaModel';
import GlobalStorage, { STORAGE_NAMES } from '../models/Helpers/GlobalStorage/GlobalStorage';
import MediaPageContent from '../components/MediaPageContent';
import SubMenuItemCopy from '../components/Item/submenu/SubMenuItemCopy';
import SubMenuItemLabels from '../components/Item/labels/SubMenuItemLabels';
import SubMenuItemCustom from '../components/Item/submenu/SubMenuItemCustom';
import SubMenuCustomButton from '../components/Item/submenu/SubMenuCustomButton';

/**
 * Page about games
 */
class Games extends Component {
	/**
	 * @type {GamesMediaModel}
	 */
	mediaModel = null;

	constructor(props) {
		super(props);

		this.mediaModel = new GamesMediaModel();
		GlobalStorage.set(STORAGE_NAMES.currentMediaModel, this.mediaModel);
	}

	render() {
		return (
			<MediaPageContent
				heading="Games"
				mediaModel={this.mediaModel}
				itemSubmenu={(itemObj) => {
					return [
						<SubMenuItemCustom
							key="info"
							items={[
								<SubMenuCustomButton
									variant="games"
									onClick={() => {
										this.mediaModel.showItemInfo('gamesCz', itemObj.title);
									}}
								/>,
								<SubMenuCustomButton
									variant="gamespot"
									onClick={() => {
										this.mediaModel.showItemInfo('gamespotCom', itemObj.title);
									}}
								/>,
								<SubMenuCustomButton
									variant="steam"
									onClick={() => {
										this.mediaModel.showItemInfo(
											'steampoweredCom',
											itemObj.title
										);
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

export default Games;
