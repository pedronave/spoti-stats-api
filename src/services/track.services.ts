import { getUserSpotifyApi, resetSpotifyApiTokens } from '../utils/spotify-api.utils';

import SpotifyWebApi = require('spotify-web-api-node');

export function getTrack(trackId: string, userId: string): Promise<SpotifyApi.SingleTrackResponse> {
  return new Promise((resolve, reject) => {
    getUserSpotifyApi(userId).then((spotifyApi: SpotifyWebApi) => {
      // TODO add after and before params for filtering
      spotifyApi
        .getTrack(trackId)
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

export function getAlbum(albumId: string, userId: string): Promise<SpotifyApi.SingleAlbumResponse> {
  return new Promise((resolve, reject) => {
    getUserSpotifyApi(userId).then((spotifyApi: SpotifyWebApi) => {
      // TODO add after and before params for filtering
      spotifyApi
        .getAlbum(albumId)
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

export function getTrackFeatures(trackId: string): Promise<SpotifyApi.AudioFeaturesObject> {
  return new Promise((resolve, reject) => {
    getUserSpotifyApi('troponeme').then((spotifyApi: SpotifyWebApi) => {
      spotifyApi
        .getAudioFeaturesForTrack(trackId)
        .then(
          (data) => {
            console.log('Get audio feats');
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
