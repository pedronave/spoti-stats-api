const GraphQL = require('graphql');

const ArtistType = require('./artist.schema');

const {
  GraphQLID,
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLList,
} = GraphQL;

const AlbumType = new GraphQLObjectType({
  name: 'album',
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    release_date: { type: GraphQLString },
    total_tracks: { type: GraphQLInt },
    artists: {
      type: new GraphQLList(ArtistType),
      // resolve(parent, args) {
      //   return Department.findById(parent.deptId);
      // },
    },
  }),
});

module.exports = AlbumType;
