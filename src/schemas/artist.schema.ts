import { ObjectType, Field, ID } from 'type-graphql';

@ObjectType()
class Artist {
  @Field((type) => ID)
  id: string;

  @Field()
  name: string;

  static fromArtistObject(artist: SpotifyApi.ArtistObjectSimplified): Artist {
    const newArtist = new Artist();
    newArtist.id = artist.id;
    newArtist.name = artist.name;

    return newArtist;
  }
}

export default Artist;
