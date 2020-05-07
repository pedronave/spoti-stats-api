import {
  GraphQLID,
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLList,
} from 'graphql';

import ArtistType from './artist.schema';

const AlbumType = new GraphQLObjectType({
  name: 'album',
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    // eslint-disable-next-line @typescript-eslint/camelcase
    release_date: { type: GraphQLString },
    // eslint-disable-next-line @typescript-eslint/camelcase
    total_tracks: { type: GraphQLInt },
    artists: {
      type: new GraphQLList(ArtistType),
      // resolve(parent, args) {
      //   return Department.findById(parent.deptId);
      // },
    },
  }),
});

export default AlbumType;
