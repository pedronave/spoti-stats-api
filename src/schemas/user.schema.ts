import { GraphQLID, GraphQLObjectType, GraphQLList, GraphQLString } from 'graphql';

import PlayType from './play.schema';
import { getPlayHistory, getRecentlyPlayedTracks, getCurrentlyPlayingTrack } from '../services/play-history.services';

import CurrentPlayType from './current-play.schema';

const UserType = new GraphQLObjectType({
  name: 'user',
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  fields: () => ({
    id: { type: GraphQLID },
    currentlyPlaying: {
      type: CurrentPlayType,
      // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
      resolve(parent) {
        return getCurrentlyPlayingTrack(parent.id).then(
          (currentData) => currentData,
          // TODO check how to handle errors here
        );
      },
    },
    displayName: { type: GraphQLString },
    recentlyPlayed: {
      type: new GraphQLList(PlayType),
      // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
      resolve(parent) {
        return getRecentlyPlayedTracks(parent.id).then(
          (recentData) => recentData.items,
          // TODO check how to handle errors here
        );
      },
    },
    playHistory: {
      type: new GraphQLList(PlayType),
      // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
      resolve(parent) {
        // console.log(parent);
        return getPlayHistory(parent.id).then((data) => data);
      },
    },
  }),
});

export default UserType;
