import React, { Component } from 'react';
import PageContent from './layout/PageContent';
import Grid from '@material-ui/core/Grid';
import { withStyles } from '@material-ui/core';
import NoItems from '../components/MediaComponents/NoItems';
import MediaItem from '../components/MediaComponents/MediaItem';
import ListLoader from '../components/MediaComponents/ListLoader';
import PropTypes from 'prop-types';
import MediaModel from '../models/MediaModels/MediaModel';
import GlobalStorage, {STORAGE_NAMES} from '../models/Helpers/GlobalStorage/GlobalStorage';
import FilterActions from '../models/Helpers/FilterActions';
import Alphabet from './MediaComponents/Alphabet';
import NewItemContainer from "./newItem/NewItemContainer";
import Nav from "./Nav/Nav";

const style = (theme) => ({
	content: {
		paddingTop: '4%'
	},
	alphabet: {
		[theme.breakpoints.down(355)]: {
			display: 'none',
		},
	},
});

/**
 * Page content for media objects
 */
class MediaPageContent extends Component {
	state = {
		items: new Map(),
		itemsLoaded: false,
	};
	dbRef;
	mediaModel;

	constructor(props) {
		super(props);

		this.mediaModel = this.props.mediaModel;
		this.dbRef = this.mediaModel.getDbRef();

		GlobalStorage.set(STORAGE_NAMES.filterActions, new FilterActions(this));
	}

	componentDidMount() {
		this.dbRef.orderByChild('slug').once('value').then(this.handleFirstLoad);
		this.dbRef.on('child_changed', this.handleItemUpdate);
		this.dbRef.on('child_removed', this.handleItemRemove);
	}

	componentWillUnmount() {
		this.dbRef.off();
	}

	/**
	 * Loads all items for the first time
	 * @param {firebase.database.DataSnapshot} snap
	 */
	handleFirstLoad = (snap) => {
		const obj = {
			items: new Map(),
			itemsLoaded: true,
		};

		snap.forEach((snapItem) => {
			const item = this.mediaModel
				.createItem()
				.setDefaults()
				.fillObj(snapItem.val())
				.setId(snapItem.key);
			obj.items.set(this._createKey(snapItem.key), this._createItem(item));
		});

		this.setState(obj);
	};

	/**
	 * Updates item in this object if it has been updated in DB
	 * @param {firebase.database.DataSnapshot} snap
	 */
	handleItemUpdate = (snap) => {
		const data = snap.val();
		if (data) {
			const id = snap.key;
			const uid = this._createKey(id);
			const item = this.mediaModel.createItem().setDefaults().fillObj(data).setId(id);
			let items = new Map(this.state.items);

			if (items.has(uid)) {
				items.get(uid).data = item;
			} else {
				items = new Map([[uid, this._createItem(item)], ...items]);
			}

			this.setState({
				items: items
			});
		}
	};

	/**
	 * Deletes item in this object if it has been removed from DB
	 * @param {firebase.database.DataSnapshot} snap
	 */
	handleItemRemove = (snap) => {
		const data = snap.val();
		if (data) {
			const items = this.state.items;
			items.delete(this._createKey(snap.key));

			this.setState({
				items: new Map(items)
			})
		}
	};

	render() {
		const { heading, classes } = this.props;

		return (
			<>
				<NewItemContainer />
				<Nav title={heading} />
				<PageContent>
					<Grid container>
						<Grid item xs className={classes.content}>
							<Grid container spacing={1} justify="center">
								{this._renderItems()}
							</Grid>
						</Grid>
						<Grid item className={classes.alphabet}>
							<Alphabet />
						</Grid>
					</Grid>
				</PageContent>
			</>
		);
	}

	/**
	 * Returns configured Item ready to render
	 * @param {string} key This object item key ("id-1234")
	 * @param {{data: Media, isReleased: boolean, show: boolean}} item This object item
	 * @param anchor
	 */
	_renderItem(key, item, anchor) {
		const obj = item.data;

		return (
			<MediaItem
				key={key}
				id={anchor}
				itemId={obj.getId()}
				title={obj.title}
				imageUrl={obj.imageUrl}
				releaseDate={this.mediaModel.getReleaseDate(obj.releaseDate)}
				isReleased={item.isReleased}
				ownageStatus={obj.status}
				labels={obj.labels}
			>
				{this.props.itemSubmenu(obj)}
			</MediaItem>
		);
	}

	/**
	 * Renders items or sorry text
	 * @return {Component|PureComponent}
	 */
	_renderItems() {
		if (!this.state.itemsLoaded) {
			return <ListLoader />;
		}

		let isEmpty = true;
		let currentAnchor = '';
		const stateItems = this.state.items;
		const items = [];

		stateItems.forEach((item, key) => {
			if (item.show) {
				isEmpty = false;
				let id = null;

				// letter anchors
				let firstLetter = item.data.title ? item.data.title.substr(0, 1).toLowerCase() : '';
				if (Boolean(parseInt(firstLetter))) {
					firstLetter = 'no';
				}
				if (firstLetter !== currentAnchor) {
					id = firstLetter;
					currentAnchor = firstLetter;
				}

				// item
				items.push(this._renderItem(key, item, id));
			}
		});

		return isEmpty ? <NoItems /> : items;
	}

	/**
	 * Creates key for item. Deals with sorting inside a object
	 * @param {number|string} id Item id
	 * @return {string}
	 * @private
	 */
	_createKey(id) {
		return `id-${id}`;
	}

	/**
	 * Creates one item object
	 * @param {Media} itemObject
	 * @return {{data: Media, show: boolean, isReleased: boolean}}
	 * @private
	 */
	_createItem(itemObject) {
		return {
			data: itemObject,
			isReleased: this.mediaModel.isReleased(itemObject.releaseDate),
			show: true,
		};
	}
}

MediaPageContent.propTypes = {
	mediaModel: PropTypes.instanceOf(MediaModel).isRequired,
	itemSubmenu: PropTypes.func,
	heading: PropTypes.string,
};

export default withStyles(style)(MediaPageContent);
