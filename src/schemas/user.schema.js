const GraphQL = require('graphql');

const PlayType = require('./play.schema');
const { getPlayHistory } = require('../services/play-history');
const { getRecentlyPlayedTracks, getCurrentlyPlayingTrack } = require('../services/play-history');

const {
  GraphQLID,
  GraphQLObjectType,
  GraphQLList,
  GraphQLString,
} = GraphQL;

const CurrentPlayType = require('./current-play.schema');

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

module.exports = UserType;
