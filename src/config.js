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
	},
	vendors: {
		giantBombCom: {
			apiUrl: 'https://www.giantbomb.com/api/',
		},
		gamesCz: {
			searchUrl: 'https://games.tiscali.cz/hledani/game/?q=',
		},
		gamespotCom: {
			searchUrl: 'https://www.gamespot.com/search/?header=1&i=site&q=',
		},
		steampoweredCom: {
			searchUrl: 'https://store.steampowered.com/search/?term=',
		},
		csfdCz: {
			searchUrl: 'https://www.csfd.cz/hledat/?q=',
		},
		imdbCom: {
			searchUrl: 'https://www.imdb.com/find?s=tt&q=',
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
			searchUrl: 'https://trakt.tv/search?query=',
		},
		googleBooks: {
			apiUrl: 'https://www.googleapis.com/books/v1/volumes',
		},
	},
};
