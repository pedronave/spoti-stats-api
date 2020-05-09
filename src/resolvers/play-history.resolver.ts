/* eslint-disable class-methods-use-this */
import { Resolver, Query, Arg, FieldResolver, ResolverInterface, Root } from 'type-graphql';
import { getCurrentlyPlayingTrack, getPlayHistory } from '../services/play-history.services';
import CurrentPlay from '../schemas/current-play.schema';
import Track from '../schemas/track.schema';
import { getTrack } from '../services/track.services';
import PlayHistory from '../schemas/play-history.schema';

@Resolver((of) => PlayHistory)
class PlayHistoryResolver implements ResolverInterface<PlayHistory> {
  @Query((returns) => [PlayHistory])
  async playHistory(
    @Arg('userId') userId: string,
    @Arg('limit', { defaultValue: 10 }) limit: number,
  ): Promise<PlayHistory[]> {
    return getPlayHistory(userId, limit).then(
      (data) => {
        return data.map<PlayHistory>((play) => {
          const newPlay = new PlayHistory();
          newPlay.playedAt = play.playedAt;
          newPlay.trackId = play.track.id;
          return newPlay;
        });
      },
      // TODO check how to handle errors here
    );
  }

  @FieldResolver()
  async track(@Root() root: PlayHistory): Promise<Track> {
    // TODO doesn't make much sense to use root.track as it's what we're fetching, but there's no other way to get the track id. Or is there?
    // TODO change the userID to the id of the user requesting
    return getTrack(root.trackId, 'troponeme').then((data) => {
      return Track.fromTrackObjectFull(data);
    });
  }
}

export default PlayHistoryResolver;
