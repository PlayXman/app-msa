<p align="center">
    <img src="https://raw.githubusercontent.com/PlayXman/app-msa/master/public/images/favicons/android-chrome-192x192.png" style="display: block; margin: auto" />
</p>

MediaStorage-App
================
App for managing your personal lists of all sorts of media - books, movies, games etc. It connects the media with favorite services like _Trakt_, _Giantbomb_ and _Tmdb_.

It's meant for personal use only. There's no durable account management system right now. It suppose to run on personal **Firebase** hosting.

The app is utterly serverless. It connects directly to services from its frontend. It's basically hard client after all assets are downloaded.

> **INFO:** The app was written in PHP at first. And this is its last version. I moved it from private repo that's why it has no history.

Development
-----------
The app can be developed purely on localhost. There's no need to start any kind of server. It connects directly to services and Firebase Realtime Database.

1. Create Firebase account and set Realtime Database and hosting
1. Create file `.env` in project root and fill it with firebase config object. You can find it in your firebase settings:
    ```
    REACT_APP_FIREBASE_APIKEY=""
    REACT_APP_FIREBASE_AUTHDOMAIN=""
    REACT_APP_FIREBASE_DATABASEURL=""
    REACT_APP_FIREBASE_PROJECTID=""
    REACT_APP_FIREBASE_STORAGEBUCKET=""
    REACT_APP_FIREBASE_MESSAGINGSENDERID=""
    REACT_APP_FIREBASE_APPID=""
    ```
1. Allow using email for authentication and create your account
1. Fill DB with your media services' api keys:
    ```json
    {
        "vendors": {
            "giantBomb" : {
                "key" : "XXX_your_key_XXX"
            },
            "tmdb" : {
                "key" : "XXX_your_key_XXX"
            },
            "traktTv" : {
                "key" : {
                    "clientId" : "XXX_your_key_XXX",
                    "clientSecret" : "XXX_your_key_XXX",
                    "refreshToken" : ""
                }
            }
        }
    }
    ```

> **INFO:** There are no test right now. This project is personal and kinda serves as a playground. I made the mistake creating ones before for PHP version and it only slowed me down.

### Graphical sources
They can be found in `/_graphic` folder.

Deployment
----------
Deploys to Firebase hosting.

1. Build the app: `npm run build`
1. Install firebase cli: `npm i -g firebase-tools`
1. Deploy with: `firebase deploy` (deploys hosting and db)
