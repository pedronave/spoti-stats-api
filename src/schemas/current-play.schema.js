const GraphQL = require('graphql');

const TrackType = require('./track.schema');

const {
  GraphQLBoolean,
  GraphQLObjectType,
  GraphQLString,
} = GraphQL;


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

module.exports = CurrentPlayType;
