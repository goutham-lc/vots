import { ObjectType, Field, ID } from "type-graphql";

@ObjectType()
export default class User {
  @Field((type) => ID, { nullable: true })
  _id?: string;

  @Field({ nullable: true })
  name?: string;

  @Field((type) => String, { nullable: true })
  address?: string;

  @Field((type) => String, { nullable: true })
  countryCode?: string;

  @Field((type) => Number, { nullable: true })
  number?: number;

  @Field((type) => String, { nullable: true })
  email?: string;

  @Field((type) => Boolean, { nullable: true })
  isAdmin?: boolean;

  @Field((type) => Date, { nullable: true })
  createdAt?: Date;

  @Field((type) => Date, { nullable: true })
  updatedAt?: Date;

  @Field((type) => Boolean, { nullable: true })
  isDelete?: boolean;

  @Field((type) => Number, { nullable: true })
  personId?: number;
}


