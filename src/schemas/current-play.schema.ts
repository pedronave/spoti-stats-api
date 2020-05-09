import { ObjectType, Field } from 'type-graphql';
import Track from './track.schema';

@ObjectType({ description: 'The currently playing track' })
class CurrentPlay {
  @Field((type) => Track, { description: 'The track being played' })
  track: Track;

  trackId: string;

  @Field()
  isPlaying: boolean;

  @Field()
  playedAt: Date;
}

export default CurrentPlay;
