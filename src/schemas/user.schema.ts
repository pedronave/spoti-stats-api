import { ObjectType, Field, ID } from 'type-graphql';

@ObjectType()
class User {
  @Field((type) => ID)
  id: string;

  @Field()
  displayName: string;
}

export default User;
