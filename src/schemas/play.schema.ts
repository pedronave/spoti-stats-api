import {
  GraphQLObjectType,
  GraphQLString,
} from 'graphql';

import TrackType from './track.schema';

/**
 * Schema used to define a single play of a track
 */
const PlayType = new GraphQLObjectType({
  name: 'play',
  fields: () => ({
    track: { type: TrackType },
    played_at: { type: GraphQLString },
  }),
});

export default PlayType;
