import {
  GraphQLID,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql';

const ArtistType = new GraphQLObjectType({
  name: 'artist',
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
  }),
});

export default ArtistType;
