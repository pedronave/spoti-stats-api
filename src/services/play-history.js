
const { getUserSpotifyApi, resetSpotifyApiTokens } = require('../utils/spotify-api.utils');
const PlayHistory = require('../models/play-history.model');

/**
 * Gets the recently played tracks from the spotify api
 * @param {String} userId id of user whose tracks is wanted
 */
function getRecentlyPlayedTracks(userId) {
  return new Promise(
    (resolve, reject) => {
      getUserSpotifyApi(userId).then((spotifyApi) => {
        // TODO add after, before params
        spotifyApi.getMyRecentlyPlayedTracks().then(
          (data) => {
            resolve(data.body);
          },
          (err) => {
            reject(err);
          },
        ).finally(() => {
          resetSpotifyApiTokens(spotifyApi);
        });
      });
    },
  );
}

/**
 * Returns the play history of a given user
 * @param {String} userId id of user
 * @returns {Promise<PlayHistory>} promise with play history
 */
function getPlayHistory(userId) {
  // TODO add filters
  return new Promise(
    (resolve, reject) => {
      getUserSpotifyApi(userId).then((spotifyApi) => {
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
            spotifyApi.getMyRecentlyPlayedTracks({ after: afterValue }).then(
              (data) => {
                const recentPlays = data.body.items.map((item) => {
                  const artists = item.track.artists.map(
                    (artist) => ({ id: artist.id, name: artist.name }),
                  );

                  return {
                    track: {
                      id: item.track.id,
                      name: item.track.name,
                      duration_ms: item.track.duration_ms,
                      album: {
                        id: item.track.album.id,
                        name: item.track.album.name,
                      },
                      artists,
                    },
                    played_at: item.played_at,
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
                // resolve(data.body);
              },
              (err) => {
                reject(err);
              },
            ).finally(() => {
              resetSpotifyApiTokens(spotifyApi);
            });
          },
          (historyError) => {
            reject(historyError);
          },
        );
      }, (err) => {
        reject(err);
      });
    },
  );
}

/**
 * Gets the currently playing track for a given user
 * @param {String} userId id of user
 * @returns {Promise<SpotifyApi.CurrentlyPlayingResponse>} promise of the currently playing track
 */
function getCurrentlyPlayingTrack(userId) {
  return new Promise(
    (resolve, reject) => {
      getUserSpotifyApi(userId).then((spotifyApi) => {
        spotifyApi.getMyCurrentPlayingTrack().then(
          (data) => {
            resolve(data.body);
          },
          (err) => {
            reject(err);
          },
        ).finally(() => {
          resetSpotifyApiTokens(spotifyApi);
        });
      });
    },
  );
}

module.exports = { getRecentlyPlayedTracks, getCurrentlyPlayingTrack, getPlayHistory };
