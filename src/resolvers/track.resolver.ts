/* eslint-disable class-methods-use-this */
import { Resolver, Query, Arg, FieldResolver, ResolverInterface, Root, Ctx } from 'type-graphql';
import { getTrack, getAlbum } from '../services/track.services';
import Track from '../schemas/track.schema';
import Album from '../schemas/album.schema';

@Resolver((of) => Track)
class TrackResolver implements ResolverInterface<Track> {
  @Query((returns) => Track)
  // eslint-disable-next-line class-methods-use-this
  async track(@Arg('id') id: string, @Arg('userId') userId: string): Promise<Track> {
    return getTrack(id, userId).then(
      (data) => {
        return Track.fromTrackObjectFull(data);
      },
      // TODO check how to handle errors here
    );
  }

  @FieldResolver()
  async album(@Root() track: Track): Promise<Album> {
    // TODO change the userId to the user currently requesting the data
    return getAlbum(track.album.id, 'troponeme').then((data) => {
      return Album.fromAlbumObjectFull(data);
    });
  }
}

export default TrackResolver;
