import {
  GraphQLBoolean,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql';

import TrackType from './track.schema';

/**
 * Schema used to define the currently playing track
 */
const CurrentPlayType = new GraphQLObjectType({
  name: 'currentPlay',
  fields: () => ({
    item: { type: TrackType },
    is_playing: { type: GraphQLBoolean },
    played_at: { type: GraphQLString },
  }),
});

export default CurrentPlayType;
