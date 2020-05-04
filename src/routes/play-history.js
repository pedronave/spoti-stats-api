const { Router } = require('express');
const { getUserSpotifyApi, resetSpotifyApiTokens } = require('../utils/spotify-api.utils');
const { getPlayHistory } = require('../services/play-history');


const router = Router();

router.get('/:userid/recent', (req, res) => {
  getUserSpotifyApi(req.params.userid).then((spotifyApi) => {
    spotifyApi.getMyRecentlyPlayedTracks().then(
      (data) => {
        res.send(data.body);
      },
      (err) => {
        res.status(err).send(err.message);
      },
    ).finally(() => {
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


module.exports = router;
