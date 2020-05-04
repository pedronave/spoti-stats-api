const GraphQL = require('graphql');

const {
  GraphQLID,
  GraphQLObjectType,
  GraphQLString,
} = GraphQL;

const ArtistType = new GraphQLObjectType({
  name: 'artist',
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
  }),
});

module.exports = ArtistType;
