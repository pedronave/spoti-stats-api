import { GraphQLID, GraphQLObjectType, GraphQLSchema } from 'graphql';
import { getUserSpotifyApi } from '../utils/spotify-api.utils';
import UserType from './user.schema';

const RootQueryType = new GraphQLObjectType({
  name: 'RootQuery',
  fields: {
    user: {
      type: UserType,
      args: { id: { type: GraphQLID } },
      // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
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
      },
    },
  },
});

export default new GraphQLSchema({
  query: RootQueryType,
});
