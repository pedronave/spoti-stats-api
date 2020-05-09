import UserModel, { User } from '../models/user.model';
import { PlayHistory } from '../models/play-history.model';

import SpotifyWebApi = require('spotify-web-api-node');

/**
 * Resets the tokens for a given SpotifyWebApi oject
 * @param {SpotifyWebApi} spotifyApi SpotifyWebApi oject to reset
 */
function resetSpotifyApiTokens(spotifyApi: SpotifyWebApi): void {
  spotifyApi.resetAccessToken();
  spotifyApi.resetRefreshToken();
}

function isSpotifyTokenExpired(tokenExpiration: Date): boolean {
  return tokenExpiration.getTime() <= Date.now();
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
    UserModel.findById(userId).then(
      (foundUser: User) => {
        const user = foundUser;
        if (user === null) {
          const userNotFoundError = new Error('User not found');

          reject(userNotFoundError);
        } else {
          const { refreshToken } = user.spotifyAuth;

          spotifyApi.setRefreshToken(refreshToken);

          if (isSpotifyTokenExpired(user.spotifyAuth.accessTokenExpiration)) {
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

export function mapRecentPlayToPlayHistory(userId: string, data: SpotifyApi.PlayHistoryObject): PlayHistory {
  const artists = data.track.artists.map((artist) => ({ id: artist.id, name: artist.name }));

  return {
    userId,
    track: {
      id: data.track.id,
      name: data.track.name,
      // duration_ms: item.track.duration_ms,
      album: {
        // TODO check why spotify API returns this even though it's not in the API docs
        // eslint-disable-next-line dot-notation
        id: data.track['album'].id,
        // eslint-disable-next-line dot-notation
        name: data.track['album'].id,
      },
      artists,
    },
    playedAt: new Date(data.played_at),
  };
}

export { getUserSpotifyApi, resetSpotifyApiTokens };
