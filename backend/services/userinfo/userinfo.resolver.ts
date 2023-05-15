import { Resolver, Query, Arg, Int, Mutation, ID } from "type-graphql";
import User from "./userinfo.type";
import { User as UserMongo } from "../../../models/user";
import { UserInfo as UserinfoMongo } from "../../../models/userinfo";
import AddUserinfoInput from "./userinfo.input_type";
import UserInfo from "./userinfo.type";
const ObjectID = require("mongodb").ObjectID;

@Resolver()
export default class UserInfoResolver {
  @Query((returns) => [UserInfo], {
    description: "Get all the records",
  })
  async records(): Promise<UserInfo[] | undefined> {
    let users = await UserinfoMongo.aggregate([
      {
        $match: {
          isVerified: false,
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "user",
          foreignField: "_id",
          as: "userDetails",
        },
      },
    ]);

    return users;
  }

  @Query((returns) => [UserInfo], {
    description: "Get all the records",
  })
  async userRecords(
    @Arg("userId") id: String
  ): Promise<UserInfo[] | undefined> {
    let users = await UserinfoMongo.aggregate([
      {
        $match: {
          user: ObjectID(id),
          isDelete: false,
        },
      },
      { $sort: { updatedAt: -1 } },
    ]);

    return users;
  }

  @Mutation((returns) => UserInfo, { description: "Add User Information" })
  async CreateRecord(
    @Arg("recordInput")
    addUserinfoInput: AddUserinfoInput
  ): Promise<UserInfo> {
    try {
      let users = await UserMongo.aggregate([
        {
          $match: {
            _id: ObjectID(addUserinfoInput.userId),
            isDelete: false,
          },
        },
      ]);

      if (users.length == 0) {
        throw new Error("User does not exist");
      }
      let jsonBody = {
        link: addUserinfoInput.link,
        user: addUserinfoInput.userId,
        location: addUserinfoInput.location,
      };

      let record: any = new UserinfoMongo(jsonBody);

      await record.save().catch((err: any) => {
        throw new Error("Error while creating record : " + err);
      });
      return record;
    } catch (error) {
      throw new Error(`${error}`);
    }
  }

  @Mutation((returns) => Boolean, { description: "Verify the user data" })
  async verifyRecord(@Arg("redordId") id: String): Promise<any> {
    try {
      let record = await UserinfoMongo.aggregate([
        {
          $match: {
            _id: ObjectID(id),
            isDelete: false,
          },
        },
      ]);

      if (record.length == 0) {
        throw new Error("Unable to find the record");
      }

      let updatedRecord = await UserinfoMongo.updateOne(
        {
          _id: ObjectID(id),
        },
        {
          $set: {
            isVerified: true,
            status: "Completed",
            updatedAt: new Date(
              new Date().setHours(
                new Date().getHours() + 5,
                new Date().getMinutes() + 30
              )
            ),
          },
        }
      );

      return updatedRecord.nModified > 0 ? true : false;
    } catch (error) {
      throw new Error(`${error}`);
    }
  }
}
