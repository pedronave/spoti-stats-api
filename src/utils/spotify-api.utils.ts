import User from '../models/user.model';

import SpotifyWebApi = require('spotify-web-api-node');

/**
 * Resets the tokens for a given SpotifyWebApi oject
 * @param {SpotifyWebApi} spotifyApi SpotifyWebApi oject to reset
 */
function resetSpotifyApiTokens(spotifyApi: SpotifyWebApi): void {
  spotifyApi.resetAccessToken();
  spotifyApi.resetRefreshToken();
}

/**
 * Gets the spotify api for a given user. Refreshes token if expired.
 * @param {String} userId userId of wanted user
 * @returns {Promise<SpotifyWebApi>} Promise of SpotifyWebApi object for the given user
 */
function getUserSpotifyApi(userId: string): Promise<SpotifyWebApi> {
  const redirectUri = process.env.SPOTIFY_AUTH_CALLBACK_URL;
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecrect = process.env.SPOTIFY_CLIENT_SECRET;

  const spotifyApi = new SpotifyWebApi({
    redirectUri,
    clientSecret: clientSecrect,
    clientId,
  });

  return new Promise((resolve, reject) => {
    User.findById(userId).then(
      (foundUser) => {
        const user = foundUser;
        if (user === null) {
          const userNotFoundError = new Error('User not found');

          reject(userNotFoundError);
        } else {
          const { refreshToken } = user.spotifyAuth;

          spotifyApi.setRefreshToken(refreshToken);

          if (user.isSpotifyTokenExpired()) {
            spotifyApi.refreshAccessToken().then(
              (refreshResult) => {
                // Update token in DB
                const expirationDate = new Date(Date.now() + refreshResult.body.expires_in * 1000);
                user.spotifyAuth.accessToken = refreshResult.body.access_token;
                user.spotifyAuth.accessTokenExpiration = expirationDate;

                user.save();

                spotifyApi.setAccessToken(refreshResult.body.access_token);
                resolve(spotifyApi);
              },
              (refreshError) => {
                reject(refreshError);
              },
            );
          } else {
            spotifyApi.setAccessToken(user.spotifyAuth.accessToken);
            resolve(spotifyApi);
          }
        }
      },
      (findError) => {
        reject(findError);
      },
    );
  });
}

export { getUserSpotifyApi, resetSpotifyApiTokens };
