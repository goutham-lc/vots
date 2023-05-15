import { ObjectType, Field, ID } from "type-graphql";
import User from "../../services/user/user.type";

@ObjectType()
export default class UserInfo {
  @Field((type) => ID, { nullable: true })
  _id?: string;

  @Field({ nullable: true })
  link?: string;

  @Field((type) => User, { nullable: true })
  user: User;

  @Field((type) => String, { nullable: true })
  status?: string;

  @Field((type) => String, { nullable: true })
  location?: string;

  @Field((type) => Boolean, { nullable: true })
  isVerified?: boolean;

  @Field((type) => Date, { nullable: true })
  createdAt?: Date;

  @Field((type) => Date, { nullable: true })
  updatedAt?: Date;

  @Field((type) => Boolean, { nullable: true })
  isDelete?: boolean;

  @Field((type) => [User], { nullable: true })
  userDetails: User[];
  
}
