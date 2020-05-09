import { Router } from 'express';
import { sendSpotifyAuthURL, spotifyCallback } from '../controllers/authorization.controller';

const router = Router();

router.get('/spotify-auth', (req, res) => {
  sendSpotifyAuthURL(req, res);
});

router.get('/spotify-callback', (req, res) => {
  spotifyCallback(req, res);
});

export default router;
