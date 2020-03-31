export const Config = {
	firebase: {
		apiKey: process.env.REACT_APP_FIREBASE_APIKEY,
		authDomain: process.env.REACT_APP_FIREBASE_AUTHDOMAIN,
		databaseURL: process.env.REACT_APP_FIREBASE_DATABASEURL,
		projectId: process.env.REACT_APP_FIREBASE_PROJECTID,
		storageBucket: process.env.REACT_APP_FIREBASE_STORAGEBUCKET,
		messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGINGSENDERID,
		appId: process.env.REACT_APP_FIREBASE_APPID,
	},
	muiThemeMain: {
		palette: {
			primary: {
				main: '#9dc358',
				contrastText: '#f9fbe7',
			},
			secondary: {
				main: '#42baff',
				contrastText: '#e0f7fa',
			},
			background: {
				default: '#f1f1f1',
			},
		},
		typography: {
			useNextVariants: true,
		},
	},
	muiThemeAddItem: {
		palette: {
			primary: {
				main: '#42baff',
				contrastText: '#ffffff',
			},
			secondary: {
				main: '#9ccc65',
			},
		},
		typography: {
			useNextVariants: true,
		},
	},
	vendors: {
		giantBombCom: {
			apiUrl: 'https://www.giantbomb.com/api/',
		},
		gamesCz: {
			searchUrl: 'https://hledej.tiscali.cz/games/?typeId=7&sort=relevancy&q=',
		},
		warezBbOrg: {
			searchUrl: 'https://www.warez-bb.org/search.php?mode=results',
			forumId: {
				movies: 4,
				games: 5,
				books: 8,
			},
		},
		csfdCz: {
			searchUrl: 'https://www.csfd.cz/hledat/?q=',
		},
		tmdbOrg: {
			imageUrl: {
				icon: 'https://image.tmdb.org/t/p/w92',
				thumb: 'https://image.tmdb.org/t/p/w200',
			},
			apiUrl: 'https://api.themoviedb.org/3/',
		},
		traktTv: {
			apiUrl: 'https://api.trakt.tv/',
			traktUrl: 'https://trakt.tv/',
		},
		googleBooks: {
			apiUrl: 'https://www.googleapis.com/books/v1/volumes',
		},
	},
};
