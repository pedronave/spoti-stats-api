import { GraphQLObjectType, GraphQLString } from 'graphql';

import TrackType from './track.schema';

/**
 * Schema used to define a single play of a track
 */
const PlayType = new GraphQLObjectType({
  name: 'play',
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  fields: () => ({
    track: { type: TrackType },
    // eslint-disable-next-line @typescript-eslint/camelcase
    played_at: { type: GraphQLString },
  }),
});

export default PlayType;
