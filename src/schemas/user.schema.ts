import {
  GraphQLID,
  GraphQLObjectType,
  GraphQLList,
  GraphQLString,
} from 'graphql';

import PlayType from './play.schema';
import { getPlayHistory } from '../services/play-history';
import { getRecentlyPlayedTracks, getCurrentlyPlayingTrack } from '../services/play-history';

import CurrentPlayType from './current-play.schema';

const UserType = new GraphQLObjectType({
  name: 'user',
  fields: () => ({
    id: { type: GraphQLID },
    currentlyPlaying: {
      type: CurrentPlayType,
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
      resolve(parent) {
        return getRecentlyPlayedTracks(parent.id).then(
          (recentData) => recentData.items,
          // TODO check how to handle errors here
        );
      },
    },
    playHistory: {
      type: new GraphQLList(PlayType),
      resolve(parent) {
        // console.log(parent);
        return getPlayHistory(parent.id).then(
          (data) => data,
        );
      },
    },
  }),
});

export default UserType;
