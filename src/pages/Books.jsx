import React, { Component } from 'react';
import BooksMediaModel from '../models/MediaModels/BooksMediaModel';
import GlobalStorage, { STORAGE_NAMES } from '../models/Helpers/GlobalStorage/GlobalStorage';
import MediaPageContent from '../components/MediaPageContent';
import SubMenuItemCopy from '../components/Item/submenu/SubMenuItemCopy';
import SubMenuItemLabels from '../components/Item/labels/SubMenuItemLabels';
import SubMenuItemCustom from "../components/Item/submenu/SubMenuItemCustom";
import SubMenuCustomButton from "../components/Item/submenu/SubMenuCustomButton";

/**
 * Page about books
 */
class Books extends Component {
	mediaModel;

	constructor(props) {
		super(props);

		this.mediaModel = new BooksMediaModel();
		GlobalStorage.set(STORAGE_NAMES.currentMediaModel, this.mediaModel);
	}

	render() {
		return (
			<MediaPageContent
				heading="Books"
				mediaModel={this.mediaModel}
				itemSubmenu={(itemObj) => {
					return [
						<SubMenuItemCustom
							key="info"
							items={[
								<SubMenuCustomButton
									variant="googleBooks"
									onClick={() => {
										this.mediaModel.showItemInfo('googleBooks', itemObj.infoUrl);
									}}
								/>,
								<SubMenuCustomButton
									variant="amazon"
									onClick={() => {
										this.mediaModel.showItemInfo('amazon', itemObj.title);
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

export default Books;
