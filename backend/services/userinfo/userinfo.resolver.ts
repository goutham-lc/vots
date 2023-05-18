import { Resolver, Query, Arg, Int, Mutation, ID } from "type-graphql";
import User from "./userinfo.type";
import JSON from "graphql-type-json";
import { User as UserMongo } from "../../../models/user";
import { UserInfo as UserinfoMongo } from "../../../models/userinfo";
import AddUserinfoInput from "./userinfo.input_type";
import UserInfo from "./userinfo.type";
import { RecordCount as RecordCountMongo } from "../../../models/recordcount";
const ObjectID = require("mongodb").ObjectID;
const ExcelJS = require("exceljs");
const workbook = new ExcelJS.Workbook();

@Resolver()
export default class UserInfoResolver {
  @Query((returns) => [UserInfo], {
    description: "Get all the records",
  })
  async records(): Promise<UserInfo[] | undefined> {
    let users = await UserinfoMongo.aggregate([
      {
        $match: {
          isVerified: null,
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
  async recordsAdmin(): Promise<UserInfo[] | undefined> {
    let users = await UserinfoMongo.aggregate([
      {
        $match: {},
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
      {
        $lookup: {
          from: "users",
          localField: "user",
          foreignField: "_id",
          as: "user",
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
        createdAt: new Date(
          new Date().setHours(
            new Date().getHours() + 5,
            new Date().getMinutes() + 30
          )
        ),
        updatedAt: new Date(
          new Date().setHours(
            new Date().getHours() + 5,
            new Date().getMinutes() + 30
          )
        ),
      };

      let record: any = new UserinfoMongo(jsonBody);

      await record.save().catch((err: any) => {
        throw new Error("Error while creating record : " + err);
      });

      let recordCount = new RecordCountMongo({
        Date: new Date(
          new Date().setHours(
            new Date().getHours() + 5,
            new Date().getMinutes() + 30
          )
        ),
        user: addUserinfoInput.userId,
      });
      await recordCount.save().catch((err: any) => {
        throw new Error("Error while creating record count: " + err);
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

  @Mutation((returns) => Boolean, { description: "disapprove the user data" })
  async disapproveRecord(@Arg("redordId") id: String): Promise<any> {
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
            isVerified: false,
            status: "Disapproved",
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

  @Query((returns) => JSON, { description: "Verify the user data" })
  async userpdf(
    @Arg("nikshayID") nikshayID: String,
    @Arg("month") months: Number,
    @Arg("Year") years: Number
  ): Promise<any> {
    try {
      const year: any = years;
      const month: any = months;
      const startDate = new Date(year, month - 1, 1);

      const endDate = new Date(year, month, 2);

      const records = await UserMongo.aggregate([
        {
          $match: {
            nikshayID: nikshayID,
            isDelete: false,
          },
        },
        {
          $lookup: {
            from: "recordcounts",
            localField: "_id",
            foreignField: "user",
            as: "recordsCounts",
          },
        },
      ]);

      let foundDate: any = [];
      let monthDate: any = [];

      let currentDate = new Date(startDate);
      console.log(currentDate, "currentDate");
      while (currentDate <= endDate) {
        monthDate.push({ Date: new Date(currentDate) });
        const dateExists = await records[0].recordsCounts.some((item: any) => {
          if (
            item.Date.toLocaleDateString() == currentDate.toLocaleDateString()
          ) {
            foundDate.push({
              Date: new Date(item.Date),
              isverified: true,
              status: "Completed",
              nikshayID: `${nikshayID.toString()}`,
              userName: records[0].name,
              userEmail: records[0].email,
            });
            return true;
          }
          return false;
        });

        currentDate.setDate(currentDate.getDate() + 1);
        if (dateExists == false) {
          if (currentDate > new Date()) {
            foundDate.push({
              Date: new Date(currentDate),
              isverified: "Awaiting the Arrival",
              status: "Awaiting the Arrival",
              nikshayID: `${nikshayID.toString()}`,
              userName: records[0].name,
              userEmail: records[0].email,
            });
          } else {
            foundDate.push({
              Date: new Date(currentDate),
              isverified: false,
              status: "DisApproved",
              nikshayID: `${nikshayID.toString()}`,
              userName: records[0].name,
              userEmail: records[0].email,
            });
          }
        }
      }

      // const worksheet = workbook.addWorksheet("Sheet 3");
      // worksheet.columns = [
      //   { header: "Date", key: "date", width: 20 },
      //   { header: "Tablete Taken", key: "Completed", width: 10 },
      //   { header: "nikshayID", key: "Nikshay", width: 10 },
      // ];

      // foundDate.forEach((item: any) => {
      //   worksheet.addRow(item);
      // });

      // workbook.xlsx
      //   .writeFile("output.xlsx")
      //   .then(() => {
      //     console.log("Excel file generated successfully!");
      //   })
      //   .catch((error: any) => {
      //     console.error("Error generating Excel file:", error);
      //   });

      return foundDate;
    } catch (error) {
      throw new Error(`${error}`);
    }
  }

  @Query((returns) => JSON, { description: "Verify the user data" })
  async SearchByNiksha(@Arg("nikshayID") nikshayID: String): Promise<any> {
    try {
      const records = await UserMongo.aggregate([
        {
          $match: {
            nikshayID: nikshayID,
            isDelete: false,
          },
        },
        {
          $lookup: {
            from: "userinfos",
            localField: "_id",
            foreignField: "user",
            as: "userrecords",
          },
        },
      ]);

      return records;
    } catch (error) {
      throw new Error(`${error}`);
    }
  }
}
