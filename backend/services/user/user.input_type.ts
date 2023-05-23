import { InputType, Field, Int } from "type-graphql";

@InputType()
export default class AddUserInput {
  @Field({ nullable: true })
  name: string;

  @Field({ nullable: true })
  bod: string;

  @Field()
  number: Number;

  @Field({ nullable: true })
  email: string;

  @Field({ nullable: true })
  nikshayID: string;
}
