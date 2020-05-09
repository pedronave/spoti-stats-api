import { getUserSpotifyApi, resetSpotifyApiTokens, mapRecentPlayToPlayHistory } from '../utils/spotify-api.utils';
import PlayHistoryModel, { PlayHistory, PlayHistoryDocument } from '../models/play-history.model';

import SpotifyWebApi = require('spotify-web-api-node');

/**
 * Gets the recently played tracks from the spotify api
 * @param {String} userId id of user whose tracks is wanted
 */
function getRecentlyPlayedTracks(userId: string): Promise<SpotifyApi.UsersRecentlyPlayedTracksResponse> {
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
function getPlayHistory(userId: string, limit = 10): Promise<PlayHistory[]> {
  // TODO add filters
  return new Promise((resolve, reject) => {
    if (limit <= 0) {
      reject(new Error('Invalid parameters'));
    }

    getUserSpotifyApi(userId).then(
      (spotifyApi: SpotifyWebApi) => {
        // Get the play history from the DB
        PlayHistoryModel.find({ userId })
          .sort({ playedAt: -1 })
          .limit(limit)
          .then(
            (historyFound: PlayHistoryDocument[]) => {
              let lastTrackTime;

              // If there is an item in the play history get the time it was played to avoid getting duplicates
              if (historyFound !== null && historyFound.length > 0) {
                if (historyFound[0] !== null && historyFound[0].playedAt !== undefined) {
                  lastTrackTime = historyFound[0].playedAt.getTime();
                }
              }

              // Get recently played tracks from spotify after last saved track
              spotifyApi
                .getMyRecentlyPlayedTracks({ after: lastTrackTime })
                .then(
                  (data) => {
                    // TODO if there is a big gap we need to follow the cursor to get the ones before.
                    const newPlays = data.body.items.map(
                      (item) => new PlayHistoryModel(mapRecentPlayToPlayHistory(userId, item)),
                    );

                    // Save the new plays to the DB
                    newPlays.forEach((play) => {
                      play.save();
                    });

                    let recentPlays: PlayHistory[];

                    // If we get more recently played from Spotify than asked, slice it. Otherwise concat the ones from the DB
                    if (newPlays.length >= limit) {
                      recentPlays = newPlays.slice(0, limit);
                    } else {
                      recentPlays = newPlays.concat(historyFound).slice(0, limit);
                    }

                    resolve(recentPlays);
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
function getCurrentlyPlayingTrack(userId: string): Promise<SpotifyApi.CurrentlyPlayingResponse> {
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
