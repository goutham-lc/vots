import { Field, ObjectType } from "type-graphql";

@ObjectType()
export default class response {
  @Field((type) => Boolean, { nullable: true })
  smsSent?: boolean;

  @Field((type) => String, { nullable: true })
  userId?: string;

  @Field((type) => Boolean, { nullable: true })
  Login?:boolean;
}   