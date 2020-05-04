const { Router } = require('express');
const { getRecentlyPlayedTracks, getPlayHistory } = require('../services/play-history.js');

const router = Router();

router.get('/:userid/recent', (req, res) => {
  getRecentlyPlayedTracks(req.params.userid).then(
    (data) => {
      res.send(data.body);
    },
    (err) => {
      res.status(500).send(err.message);
    },
  );
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
