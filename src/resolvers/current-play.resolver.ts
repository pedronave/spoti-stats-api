/* eslint-disable class-methods-use-this */
import { Resolver, Query, Arg, FieldResolver, ResolverInterface, Root } from 'type-graphql';
import { getCurrentlyPlayingTrack } from '../services/play-history.services';
import CurrentPlay from '../schemas/current-play.schema';
import Track from '../schemas/track.schema';
import { getTrack } from '../services/track.services';

@Resolver((of) => CurrentPlay)
class CurrentPlayResolver implements ResolverInterface<CurrentPlay> {
  @Query((returns) => CurrentPlay)
  async currentlyPlaying(@Arg('userId') userId: string): Promise<CurrentPlay> {
    return getCurrentlyPlayingTrack(userId).then(
      (data) => {
        const currentPlay = new CurrentPlay();
        currentPlay.isPlaying = data.is_playing;
        currentPlay.playedAt = new Date(data.timestamp);
        // currentPlay.track = Track.fromTrackObjectFull(data.item);
        currentPlay.trackId = data.item.id;
        return currentPlay;
      },
      // TODO check how to handle errors here
    );
  }

  @FieldResolver()
  async track(@Root() root: CurrentPlay): Promise<Track> {
    // TODO doesn't make much sense to use root.track as it's what we're fetching, but there's no other way to get the track id. Or is there?
    // TODO change the userID to the id of the user
    return getTrack(root.track.id, 'troponeme').then((data) => {
      return Track.fromTrackObjectFull(data);
    });
  }
}

export default CurrentPlayResolver;
