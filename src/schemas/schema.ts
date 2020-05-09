import { buildSchemaSync } from 'type-graphql';
import CurrentPlayResolver from '../resolvers/current-play.resolver';
import UserResolver from '../resolvers/user.resolver';
import TrackResolver from '../resolvers/track.resolver';
import PlayHistoryResolver from '../resolvers/play-history.resolver';

const schema = buildSchemaSync({
  resolvers: [CurrentPlayResolver, UserResolver, TrackResolver, PlayHistoryResolver],
});

export default schema;
