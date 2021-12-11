import React, { Component } from 'react';
import PageContent from './layout/PageContent';
import Grid from '@material-ui/core/Grid';
import { withStyles } from '@material-ui/core';
import NoItems from '../components/MediaComponents/NoItems';
import MediaItem from '../components/MediaComponents/MediaItem';
import ListLoader from '../components/MediaComponents/ListLoader';
import PropTypes from 'prop-types';
import MediaModel from '../models/MediaModels/MediaModel';
import GlobalStorage, { STORAGE_NAMES } from '../models/Helpers/GlobalStorage/GlobalStorage';
import FilterActions from '../models/Helpers/FilterActions';
import Alphabet from './MediaComponents/Alphabet';
import NewItemContainer from './newItem/NewItemContainer';
import Nav from './Nav/Nav';

const STYLE_HELPERS = {
	itemSize: 158,
	alphabetBp: 360,
	contentBreakpoints: (count, theme) => {
		return {
			[theme.breakpoints.up(STYLE_HELPERS.itemSize * count + 48)]: {
				maxWidth: STYLE_HELPERS.itemSize * count - 8,
			},
		};
	},
};

const style = (theme) => ({
	wrapper: {
		[theme.breakpoints.up(STYLE_HELPERS.alphabetBp)]: {
			paddingRight: 22,
		},
	},
	content: {
		paddingTop: '4%',
		margin: '0 auto',
		maxWidth: STYLE_HELPERS.itemSize * 2 - 8,
		...STYLE_HELPERS.contentBreakpoints(3, theme),
		...STYLE_HELPERS.contentBreakpoints(4, theme),
		...STYLE_HELPERS.contentBreakpoints(5, theme),
		...STYLE_HELPERS.contentBreakpoints(6, theme),
	},
	alphabet: {
		[theme.breakpoints.down(STYLE_HELPERS.alphabetBp)]: {
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

			this.setState( prevState => {
				const prevItems = prevState.items;
				let items;

				if (prevItems.has(uid)) {
					items = new Map(prevItems);
					items.get(uid).data = item;
				} else {
					items = new Map([[uid, this._createItem(item)], ...prevItems]);
				}

				return {
					items,
				}
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
			this.setState(prevState => {
				const items = new Map(prevState.items);
				items.delete(this._createKey(snap.key));

				return {
					items,
				};
			});
		}
	};

	render() {
		const { heading, classes } = this.props;

		const preparedItems = this._prepareItemComponents();

		return (
			<>
				<NewItemContainer sm={STYLE_HELPERS.alphabetBp} />
				<Nav title={heading} />
				<PageContent>
					<div className={classes.wrapper}>
						<div className={classes.content}>
							<Grid container spacing={1} justifyContent="flex-start">
								{preparedItems.items}
							</Grid>
						</div>
					</div>
					<Alphabet className={classes.alphabet} activeLetters={preparedItems.activeLetters} />
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
	 * Prepares item components for rendering. Moreover, prepares the alphabet data, so it knows what are the active letters. If not items the sorry text is rendered instead. If the items are not loaded yet the loader is displayed
	 * @return {{items: JSX.Element[], activeLetters: string[]}}
	 */
	_prepareItemComponents() {
		const anchors = [];
		const items = [];

		if (!this.state.itemsLoaded) {
			items.push(<ListLoader key="loader" />);
		} else {
			let isEmpty = true;
			let currentAnchor = '';
			const stateItems = this.state.items;

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
						anchors.push(firstLetter);
					}

					// item
					items.push(this._renderItem(key, item, id));
				}
			});

			if(isEmpty) {
				items.push(<NoItems key="noItems" />);
			}
		}

		return {
			items,
			activeLetters: anchors
		}
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
