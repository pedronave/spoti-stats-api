import { Router } from 'express';
import SpotifyWebApi = require('spotify-web-api-node');
import * as jwt from 'jsonwebtoken';

import User from '../models/user.model';
import { resetSpotifyApiTokens } from '../utils/spotify-api.utils';

const authRouter = Router();

const scopes = ['user-read-private', 'user-read-email', 'user-read-recently-played', 'user-read-playback-position', 'user-read-currently-playing', 'user-follow-read'];
const redirectUri = process.env.SPOTIFY_AUTH_CALLBACK_URL;
const clientId = process.env.SPOTIFY_CLIENT_ID;
const clientSecrect = process.env.SPOTIFY_CLIENT_SECRET;


// Setting credentials can be done in the wrapper's constructor, or using the API object's setters.
const spotifyApi = new SpotifyWebApi({
  redirectUri,
  clientSecret: clientSecrect,
  clientId,
});

authRouter.get('/spotify-auth', (req, res) => {
  // TODO make state depend on the request. Maybe a hash of a cookie or something?
  const state = 'spotify_auth_state';
  const authorizeURL = spotifyApi.createAuthorizeURL(scopes, state);

  // Create the authorization URL
  console.log(authorizeURL);

  res.send({ authUrl: authorizeURL });
});

authRouter.get('/spotify-callback', (req, res) => {
  // The code that's returned as a query parameter to the redirect URI
  const code = req.query.code.toString();
  // The returnedState should be compared with the sent one.
  // const returnedState = req.query.state || null;

  // Retrieve an access token and a refresh token
  spotifyApi.authorizationCodeGrant(code).then(
    (data) => {
      console.log(`The token expires in ${data.body.expires_in}`);
      console.log(`The access token is ${data.body.access_token}`);
      console.log(`The refresh token is ${data.body.refresh_token}`);

      spotifyApi.setAccessToken(data.body.access_token);
      spotifyApi.setRefreshToken(data.body.refresh_token);
      const expiryDate = new Date(Date.now() + data.body.expires_in * 1000);

      spotifyApi.getMe().then(
        (userData) => {
          const userId = userData.body.id;
          console.log(userData);
          User.findById(userId).then(
            (foundUser) => {
              let user = foundUser;

              if (user === null) {
                console.log('User not found, creating a new one');

                user = new User({ _id: userId, displayName: userData.body.display_name });
              }

              user.spotifyAuth = {
                accessToken: data.body.access_token,
                accessTokenExpiration: expiryDate,
                refreshToken: data.body.refresh_token,
              };

              user.save().then();
              const jwtSecret = process.env.JWT_SECRET;
              const token = jwt.sign({ userId, displayName: user.displayName }, jwtSecret);

              res.setHeader('Authorization', token);
              res.send({ token });
            },
            (findError) => {
              console.log(findError);
              res.status(500).send(findError);
            },
          ).finally(() => { resetSpotifyApiTokens(spotifyApi); });
        },
        () => {
          res.status(500).send('Failed to get profile info');
          resetSpotifyApiTokens(spotifyApi);
        },
      );
    },
    (codeGrantErr) => {
      res.status(500).send(codeGrantErr);
    },
  );


  // res.redirect('/');
});

export default authRouter;
