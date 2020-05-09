import { ObjectType, Field, Int, ID } from 'type-graphql';

import Artist from './artist.schema';
import Album from './album.schema';

@ObjectType()
class Track {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;

  @Field(() => Int)
  durationMs: number;

  @Field(() => Int)
  trackNumber: number;

  @Field(() => [Artist])
  artists: Artist[];

  @Field(() => Album)
  album: Album;

  static fromTrackObjectFull(track: SpotifyApi.TrackObjectFull): Track {
    const newTrack = new Track();
    newTrack.id = track.id;
    newTrack.name = track.name;
    newTrack.durationMs = track.duration_ms;
    newTrack.trackNumber = track.track_number;

    newTrack.artists = track.artists.map((artist) => Artist.fromArtistObject(artist));
    newTrack.album = Album.fromAlbumObjectFull(track.album);

    return newTrack;
  }
}

export default Track;
