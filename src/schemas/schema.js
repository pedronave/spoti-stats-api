const GraphQL = require('graphql');
const { getUserSpotifyApi } = require('../utils/spotify-api.utils');
const UserType = require('./user.schema');

const {
  GraphQLID,
  GraphQLObjectType,
  GraphQLSchema,
} = GraphQL;

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

module.exports = new GraphQLSchema({
  query: RootQueryType,
});
