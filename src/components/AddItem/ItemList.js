import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { List } from "@material-ui/core";
import Item from "./Item";

/**
 * List of found items
 */
class ItemList extends Component {

	render() {
		const { items, currentMediaModel } = this.props;

		return (
			<List>
				{items.map( ( item ) => {
					const key = item.getId();

					return <Item
						key={key}
						id={key}
						title={item.title}
						releaseDate={currentMediaModel.getReleaseDate(item.releaseDate)}
						imageUrl={item.imageUrl}
						currentMediaModel={currentMediaModel}
					/>;
				} )}
			</List>
		);
	}

}

ItemList.propTypes = {
	items: PropTypes.array.isRequired,
	currentMediaModel: PropTypes.object.isRequired
};

export default ItemList;
