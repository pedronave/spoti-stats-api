import { ObjectType, Field, ID } from 'type-graphql';

import Artist from './artist.schema';

@ObjectType()
class Album {
  @Field((type) => ID)
  id: string;

  @Field()
  name: string;

  @Field()
  releaseDate: Date;

  @Field((type) => [Artist])
  artists: Artist[];

  static fromAlbumObjectFull(album: SpotifyApi.AlbumObjectSimplified): Album {
    const newAlbum = new Album();
    newAlbum.id = album.id;
    newAlbum.name = album.name;
    newAlbum.releaseDate = new Date(album.release_date);
    newAlbum.artists = album.artists.map((artist) => Artist.fromArtistObject(artist));

    return newAlbum;
  }
}

export default Album;
