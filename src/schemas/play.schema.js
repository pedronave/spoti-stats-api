const GraphQL = require('graphql');

const TrackType = require('./track.schema');

const {
  GraphQLObjectType,
  GraphQLString,
} = GraphQL;


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

module.exports = PlayType;
