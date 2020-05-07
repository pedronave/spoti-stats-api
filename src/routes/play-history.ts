import { Router } from 'express';
import { getUserSpotifyApi, resetSpotifyApiTokens } from '../utils/spotify-api.utils';
import { getPlayHistory } from '../services/play-history';

const router = Router();

router.get('/:userid/recent', (req, res) => {
  getUserSpotifyApi(req.params.userid).then((spotifyApi) => {
    spotifyApi
      .getMyRecentlyPlayedTracks()
      .then(
        (data) => {
          res.send(data.body);
        },
        (err) => {
          res.status(err).send(err.message);
        },
      )
      .finally(() => {
        resetSpotifyApiTokens(spotifyApi);
      });
  });
});

router.get('/:userid/history', (req, res) => {
  getPlayHistory(req.params.userid).then(
    (data) => {
      res.send(data);
    },
    (err) => {
      res.status(500).send(err);
    },
  );
});

export default router;
