import { Resolver, Query, Arg } from 'type-graphql';
import User from '../schemas/user.schema';
import { getUserSpotifyApi, resetSpotifyApiTokens } from '../utils/spotify-api.utils';

@Resolver()
class UserResolver {
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  @Query(() => User)
  // eslint-disable-next-line class-methods-use-this
  async user(@Arg('id') id: string) {
    return new Promise((resolve, reject) => {
      getUserSpotifyApi(id).then(
        (spotifyApi) => {
          spotifyApi
            .getMe()
            .then(
              (userData) => {
                resolve({ id: userData.body.id, displayName: userData.body.display_name });
              },
              (userError) => {
                reject(userError);
              },
            )
            .finally(() => resetSpotifyApiTokens(spotifyApi));
        },
        (error) => {
          reject(error);
        },
      );
    });
  }
}

export default UserResolver;
