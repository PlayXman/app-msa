export const config = {
  firebase: {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_APIKEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTHDOMAIN,
    databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASEURL,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECTID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGEBUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGINGSENDERID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APPID,
  },
  vendors: {
    gamesCz: {
      searchUrl: "https://games.tiscali.cz/hledani/game/?q=",
    },
    steampoweredCom: {
      searchUrl: "https://store.steampowered.com/search/?term=",
    },
    steamdbInfo: {
      searchUrl: "https://steamdb.info/instantsearch/?query=",
    },
    epicgamesCom: {
      searchUrl:
        "https://store.epicgames.com/en-US/browse?sortBy=relevancy&sortDir=DESC&category=Game&count=40&start=0&q=",
    },
    csfdCz: {
      movieSearchUrl:
        "https://www.csfd.cz/hledat/?series=0&creators=0&users=0&q=",
      tvShowSearchUrl:
        "https://www.csfd.cz/hledat/?films=0&creators=0&users=0&q=",
    },
    imdbCom: {
      movieSearchUrl: "https://www.imdb.com/find/?s=tt&ttype=ft&q=",
      tvShowSearchUrl: "https://www.imdb.com/find/?s=tt&ttype=tv&q=",
    },
    tmdbOrg: {
      imageUrl: {
        icon: "https://image.tmdb.org/t/p/w92",
        thumb: "https://image.tmdb.org/t/p/w200",
      },
    },
    traktTv: {
      movieSearchUrl: "https://trakt.tv/search/movies?query=",
      tvShowSearchUrl: "https://trakt.tv/search/shows?query=",
    },
    amazonCom: {
      searchUrl: "https://www.amazon.com/s?k=",
    },
    googleBooks: {
      infoUrl: "https://books.google.com.au/books?hl=&source=gbs_api&id=",
    },
    goodreadsCom: {
      searchUrl:
        "https://www.goodreads.com/search?utf8=%E2%9C%93&search_type=books&q=",
    },
  },
};
