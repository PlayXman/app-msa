<p align="center">
    <img src="https://raw.githubusercontent.com/PlayXman/app-msa/master/public/images/favicons/android-chrome-192x192.png" style="display: block; margin: auto" />
</p>

MediaStorage-App
================
The app for managing your personal lists of all sorts of media - books, movies, games etc. It links the lists with your favorite services like _Trakt_, _Giantbomb_ and _Tmdb_.

It's meant for personal use only. There's no durable account management system right now. It's supposed to run on personal **Firebase** hosting.

The app is utterly serverless. It connects directly to services from its frontend. One can say it behaves as heavy client once all assets are downloaded.

Development
-----------
The app is written in **[Next.js](https://nextjs.org/)** and **[TypeScript](https://www.typescriptlang.org/)**. It uses **[Firebase](https://firebase.google.com/)** for hosting, authentication and Realtime Database. It syncs data from external services like _Trakt_, _Giantbomb_ and _Tmdb_.

### Prepare project
1. Create Firebase account and setup Realtime Database and hosting.
2. Create `.env` in project root and fill it with firebase config object. You can find it in your firebase settings:
   ```bash
   NEXT_PUBLIC_FIREBASE_APIKEY=""
   NEXT_PUBLIC_FIREBASE_AUTHDOMAIN=""
   NEXT_PUBLIC_FIREBASE_DATABASEURL=""
   NEXT_PUBLIC_FIREBASE_PROJECTID=""
   NEXT_PUBLIC_FIREBASE_STORAGEBUCKET=""
   NEXT_PUBLIC_FIREBASE_MESSAGINGSENDERID=""
   NEXT_PUBLIC_FIREBASE_APPID=""
   ```
3. Allow using email for authentication and create your account. As this is personal app only one is needed.
4. Fill DB with your media services' api keys:
   ```json
   {
     "Vendors": {
       "giantBomb" : {
         "key" : "XXX_your_key_XXX"
       },
       "tmdb" : {
         "key" : "XXX_your_key_XXX"
       },
       "traktTv" : {
         "key" : {
           "clientId" : "XXX_your_key_XXX",
           "clientSecret" : "XXX_your_key_XXX"
         }
       }
     }
   }
   ```
   
### Run locally
1. The first time you have to install Firebase CLI with `npm i -g firebase-tools`.
2. Add `NEXT_PUBLIC_EMULATORS=true` row into your `.env.development` file to use Firebase emulators.
3. Run `npm run dev:emulators` to start firebase emulators. It will start a UI where you can set up local Realtime Database and Authentication.
4. Run `npm run dev:app` to start the app.

Optionally

1. Turn off emulators by editing `NEXT_PUBLIC_EMULATORS=false` row in `.env.development` file.
2. Run `npm run dev:app` to start the app without emulators. It will connect to your Firebase project.

### Graphical sources
They can be found in `/_graphic` folder.

Deployment
----------
Deploys to Firebase hosting.

1. The first time you have to install Firebase CLI with `npm i -g firebase-tools`.
2. Run `npm run deploy` to build the app and deploy it to firebase.
