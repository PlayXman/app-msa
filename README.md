MediaStorage-App <img src="https://aa-msa.web.app/images/logo.svg" width="40" />
================
App for managing your personal lists of all sorts of media - books, movies, games etc. It connects the media with favorite services like _Trakt_, _Giantbomb_ and _Tmdb_.

It's meant for personal use only. There's no durable account management system right now. It suppose to run on personal **Firebase** hosting.

The app is utterly serverless. It connects directly to services from its frontend. It's basically hard client after all assets are downloaded.

**My personal instance:** https://aa-msa.web.app/

> **INFO:** The app was written in PHP at first. And this is its 4th version. I use live private repository for development purposes. However, you can download this repo and use it for yourself.

Development
-----------
The app can be developed purely on localhost. There's no need to start any kind of server. It connects directly to services and Firebase Realtime Database.

1. Create Firebase account and set Realtime Database
1. Fill firebase login object at `src/config.js::firebase`
1. Allow authentication using email and create your account
1. Fill DB with your media services' api keys:
    ```json
    {
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
    ```

> **INFO:** There are no test. This project is personal and kinda serves as a playground. I made the mistake creating ones before for PHP version and it only slowed me down.

Deployment
----------
Deploys to Firebase hosting.

1. Build the app: `npm run build`
1. Install firebase cli: `npm i -g firebase-tools`
1. Deploy with: `firebase deploy` (deploys hosting and db)
