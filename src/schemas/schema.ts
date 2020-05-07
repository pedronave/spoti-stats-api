import {
  GraphQLID,
  GraphQLObjectType,
  GraphQLSchema,
} from 'graphql';
import { getUserSpotifyApi } from '../utils/spotify-api.utils';
import UserType from './user.schema';

const RootQueryType = new GraphQLObjectType({
  name: 'RootQuery',
  fields: {
    user: {
      type: UserType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        return new Promise((resolve, reject) => {
          getUserSpotifyApi(args.id).then(
            (spotifyApi) => {
              spotifyApi.getMe().then(
                (userData) => {
                  resolve({ id: userData.body.id, displayName: userData.body.display_name });
                },
                (userError) => {
                  reject(userError);
                },
              );
            },
            (error) => {
              reject(error);
            },
          );
        });
        // console.log(`resolving ${args.id}`);
        // return new Promise((resolve, reject) => {
        //   getRecentlyPlayedTracks(args.id).then(
        //     (historyData) => {
        //       // console.log(historyData);
        //       // { recentlyPlayed: historyData.items };
        //       getCurrentlyPlayingTrack(args.id).then(
        //         (currentData) => {
        //           resolve({ recentlyPlayed: historyData.items, currentlyPlaying: currentData });
        //         }, (currentErr) => { reject(currentErr); },
        //       );
        //     }, (historyErr) => { reject(historyErr); },
        //   );
        // });
      },
    },
  },
});

export default new GraphQLSchema({
  query: RootQueryType,
});
