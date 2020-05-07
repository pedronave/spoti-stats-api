import {
  GraphQLID,
  GraphQLInt,
  GraphQLList,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql';

import ArtistType from './artist.schema';
import AlbumType from './album.schema';

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

export default TrackType;
