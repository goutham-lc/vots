import { InputType, Field, Int } from "type-graphql";

@InputType()
export default class AddUserInfoInput {
  @Field()
  link: string;

  @Field()
  userId: string;

  @Field()
  location: string;
}
