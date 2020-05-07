import { GraphQLBoolean, GraphQLObjectType, GraphQLString } from 'graphql';

import TrackType from './track.schema';

/**
 * Schema used to define the currently playing track
 */
const CurrentPlayType = new GraphQLObjectType({
  name: 'currentPlay',
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  fields: () => ({
    item: { type: TrackType },
    // eslint-disable-next-line @typescript-eslint/camelcase
    is_playing: { type: GraphQLBoolean },
    // eslint-disable-next-line @typescript-eslint/camelcase
    played_at: { type: GraphQLString },
  }),
});

export default CurrentPlayType;
