import { GraphQLObjectType, GraphQLString } from 'graphql';

import { ObjectType, Field } from 'type-graphql';
import Track from './track.schema';

@ObjectType()
class PlayHistory {
  @Field((type) => Track)
  track: Track;

  trackId: string;

  @Field()
  playedAt: Date;
}

export default PlayHistory;
