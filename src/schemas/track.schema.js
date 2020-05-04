const GraphQL = require('graphql');

const ArtistType = require('./artist.schema');
const AlbumType = require('./album.schema');

const {
  GraphQLID,
  GraphQLInt,
  GraphQLList,
  GraphQLObjectType,
  GraphQLString,
} = GraphQL;

const TrackType = new GraphQLObjectType({
  name: 'track',
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    duration_ms: { type: GraphQLInt },
    trackNumber: { type: GraphQLInt },
    artists: {
      type: new GraphQLList(ArtistType),
      // resolve(parent, args) {
      //   return Department.findById(parent.deptId);
      // },
    },
    album: {
      type: AlbumType,
      // resolve(parent, args) {
      //   return Position.findById(parent.positionId);
      // },
    },
  }),
});

module.exports = TrackType;
