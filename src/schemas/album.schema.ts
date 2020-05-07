import {GraphQLID,
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLList } from 'graphql';

import ArtistType from './artist.schema';

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

export default AlbumType;
