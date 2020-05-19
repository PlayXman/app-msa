import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Wrapper from '../layout/Wrapper';
import Grid from '@material-ui/core/Grid';
import SearchField from './SearchField';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Slide from '@material-ui/core/Slide';
import Text from './Text';
import ItemList from './ItemList';
import GlobalStorage, {STORAGE_NAMES} from '../../models/Helpers/GlobalStorage/GlobalStorage';

const ITEM_SIZE = 158;
function contentBreakpoints(count, theme) {
	return {
		[theme.breakpoints.up(ITEM_SIZE * count + 8)]: {
			maxWidth: ITEM_SIZE * count - 8
		},
	}
}

const useStyles = makeStyles((theme) => ({
	dialog: {
		backgroundColor: theme.palette.background.default,
	},
	bar: {
		paddingLeft: 4,
		paddingRight: 4,
	},
	text: {
		paddingLeft: '1rem',
		flexGrow: 1,
	},
	content: {
		width: '100%',
		paddingBottom: '3rem',
		maxWidth: ITEM_SIZE * 2 - 8,
		...contentBreakpoints(3, theme),
		...contentBreakpoints(4, theme),
		...contentBreakpoints(5, theme),
	}
}));

const Transition = React.forwardRef(function Transition(props, ref) {
	return <Slide direction="up" ref={ref} {...props} />;
});

const NewItemDialog = ({ open, onClose }) => {
	const classes = useStyles();
	const [items, setItems] = useState([]);
	const [searched, setSearched] = useState(false);
	const [currentMediaModel, setCurrentMediaModel] = useState(null);

	useEffect(() => {
		setCurrentMediaModel(GlobalStorage.getState(STORAGE_NAMES.currentMediaModel));
		setSearched(false);
		setItems([]);
	}, []);

	const renderItems = () => {
		if (!searched) {
			return <Text text="Start searching" />;
		} else if (items.length) {
			return <ItemList items={items} currentMediaModel={currentMediaModel} />;
		} else {
			return <Text text="Nothing found" />;
		}
	};

	const handleSearch = (searchText) => {
		if (searchText.length) {
			currentMediaModel
				.searchItem(searchText)
				.then((items) => {
					setItems(items);
				})
				.catch(() => {
					setItems([]);
				})
				.finally(() => {
					setSearched(true);
				});
		}
	};

	return (
		<Dialog
			fullScreen
			open={open}
			onClose={onClose}
			TransitionComponent={Transition}
			PaperProps={{
				className: classes.dialog,
			}}
		>
			<AppBar position="relative" color="secondary">
				<Toolbar className={classes.root}>
					<Typography variant="h6" color="inherit" className={classes.text}>
						New Item
					</Typography>
					<IconButton color="inherit" onClick={onClose} aria-label="Close">
						<CloseIcon />
					</IconButton>
				</Toolbar>
			</AppBar>
			<Wrapper>
				<Grid container justify="center">
					<Grid item className={classes.content}>
						<SearchField onSubmit={handleSearch} />

						{renderItems()}
					</Grid>
				</Grid>
			</Wrapper>
		</Dialog>
	);
};

NewItemDialog.propTypes = {
	open: PropTypes.bool,
	onClose: PropTypes.func.isRequired,
};

export default NewItemDialog;
