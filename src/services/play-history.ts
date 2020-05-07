import { getUserSpotifyApi, resetSpotifyApiTokens } from '../utils/spotify-api.utils';
import PlayHistory, { Play } from '../models/play-history.model';

import SpotifyWebApi = require('spotify-web-api-node');

/**
 * Gets the recently played tracks from the spotify api
 * @param {String} userId id of user whose tracks is wanted
 */
function getRecentlyPlayedTracks(userId): Promise<SpotifyApi.UsersRecentlyPlayedTracksResponse> {
  return new Promise((resolve, reject) => {
    getUserSpotifyApi(userId).then((spotifyApi: SpotifyWebApi) => {
      // TODO add after and before params for filtering
      spotifyApi
        .getMyRecentlyPlayedTracks()
        .then(
          (data) => {
            resolve(data.body);
          },
          (err) => {
            reject(err);
          },
        )
        .finally(() => {
          resetSpotifyApiTokens(spotifyApi);
        });
    });
  });
}

/**
 * Returns the play history of a given user
 * @param {String} userId id of user
 * @returns {Promise<PlayHistory>} promise with play history
 */
function getPlayHistory(userId): Promise<Play[]> {
  // TODO add filters
  return new Promise((resolve, reject) => {
    getUserSpotifyApi(userId).then(
      (spotifyApi: SpotifyWebApi) => {
        // If this gets in here the userId is registered
        PlayHistory.findOne({ userId }).then(
          (historyFound) => {
            let userHistory = historyFound;
            if (historyFound === null) {
              userHistory = new PlayHistory({
                userId,
                plays: [],
              });
            }
            let afterValue;

            if (userHistory.plays !== null && userHistory.plays !== undefined) {
              if (userHistory.plays.length > 0 && userHistory.plays[0].played_at !== undefined) {
                afterValue = userHistory.plays[0].played_at.getTime();
              }
            }

            // Get recently played tracks from spotify
            spotifyApi
              .getMyRecentlyPlayedTracks({ after: afterValue })
              .then(
                (data) => {
                  const recentPlays = data.body.items.map<Play>((item) => {
                    const artists = item.track.artists.map((artist) => ({ id: artist.id, name: artist.name }));

                    return {
                      track: {
                        id: item.track.id,
                        name: item.track.name,
                        // duration_ms: item.track.duration_ms,
                        album: {
                          id: 'test', // item.track.album.id,
                          name: 'test', // item.track.album.name,
                        },
                        artists,
                      },
                      // eslint-disable-next-line @typescript-eslint/camelcase
                      played_at: new Date(item.played_at),
                    };
                  });

                  let updatedPlays = recentPlays;
                  // If there are previous played tracks add them to the new ones.
                  if (userHistory.plays !== null && userHistory.plays !== undefined) {
                    updatedPlays = recentPlays.concat(userHistory.plays);
                  }

                  userHistory.plays = updatedPlays;
                  userHistory.save();
                  resolve(updatedPlays);
                },
                (err) => {
                  reject(err);
                },
              )
              .finally(() => {
                resetSpotifyApiTokens(spotifyApi);
              });
          },
          (historyError) => {
            reject(historyError);
          },
        );
      },
      (err) => {
        reject(err);
      },
    );
  });
}

/**
 * Gets the currently playing track for a given user
 * @param {String} userId id of user
 * @returns {Promise<SpotifyApi.CurrentlyPlayingResponse>} promise of the currently playing track
 */
function getCurrentlyPlayingTrack(userId): Promise<SpotifyApi.CurrentlyPlayingResponse> {
  return new Promise((resolve, reject) => {
    getUserSpotifyApi(userId).then((spotifyApi: SpotifyWebApi) => {
      spotifyApi
        .getMyCurrentPlayingTrack()
        .then(
          (data) => {
            resolve(data.body);
          },
          (err) => {
            reject(err);
          },
        )
        .finally(() => {
          resetSpotifyApiTokens(spotifyApi);
        });
    });
  });
}

export { getRecentlyPlayedTracks, getCurrentlyPlayingTrack, getPlayHistory };
