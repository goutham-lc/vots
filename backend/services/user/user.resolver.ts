import { Resolver, Query, Arg, Int, Mutation, ID } from "type-graphql";
import User from "./user.type";
import { User as UserMongo } from "../../../models/user";
import AddUserInput from "./user.input_type";
import response from "./userotp.response";
const ObjectID = require("mongodb").ObjectID;

@Resolver()
export default class UserResolver {
  @Query((returns) => [User], {
    description: "Get all the users",
  })
  async users(): Promise<User[] | undefined> {
    let users = await UserMongo.find().catch((err: any) => {
      throw new Error("Error in finding users : " + err);
    });

    return users;
  }

  @Mutation((returns) => response, { description: "Verify User" })
  async Login(
    @Arg("PhoneNumber")
    phoneNumber: number,
    @Arg("OTP")
    otpNumber: number
  ): Promise<any> {
    try {
      let users = await UserMongo.aggregate([
        {
          $match: {
            number: phoneNumber,
            isDelete: false,
          },
        },
      ]);
      if (users.length == 0) {
        throw new Error("Phone Number does not exist");
      }
      if (users[0].otp == 0) {
        throw new Error("OTP Expired");
      }
      if (otpNumber == users[0].otp) {
        await UserMongo.updateOne(
          {
            _id: ObjectID(users[0]._id),
          },
          {
            $set: {
              otp: 0,
            },
          }
        );
        return { Login: true, userId: users[0]._id,isAdmin:users[0].isAdmin };
      } else {
        return { Login: false, userId: null,isAdmin:null };
      }
    } catch (error) {
      throw new Error(`${error}`);
    }
  }

  @Mutation((returns) => response, { description: "Add an User" })
  async register(
    @Arg("userInput")
    userInput: AddUserInput
  ): Promise<any> {
   
    try {
      let users = await UserMongo.aggregate([
        {
          $match: {
            $or: [{ email: userInput.email }, { number: userInput.number }],
          },
        },
      ]);
     
      if (users.length != 0) {
        throw new Error("User with this email/phone number id already exist");
      }

      var min = 100000;
      var max = 999999;
      let jsonBody = {
        name: userInput.name,
        email: userInput.email,
        // dob: userInput.dob,
        number: userInput.number,
        personId: Math.floor(Math.random() * (max - min + 1)) + min,
        otp: Math.floor(Math.random() * (max - min + 1)) + min,
      };
      let user: any = new UserMongo(jsonBody);

      await user.save().catch((err: any) => {
        throw new Error("Error while creating user : " + err);
      });
     

      const accountSid = "AC910e8cf6d3d7f68adc1987b8c23aacf7";
      const authToken = "7b7e0df76369b3125d63ab3db26220fa";
      let client = require("twilio")(accountSid, authToken);

      let sms = await client.messages
        .create({
          body: `Your Vots Verification OTP is: ${user.otp}`,
          from: "+13143505646",
          to: "+91" + user.number,
        })
        .then((response: any) => {
          console.log(response.sid, "response");
          return true;
        })
        .catch((err: any) => {
          console.log(err, "error");
          return false;
        });
      if (sms == true) {
        return { Login: true, userId: user._id };
      } else {
        return { Login: false, userId: user._id };
      }
    } catch (error) {
      throw new Error(`${error}`);
    }
  }

  @Mutation((returns) => response, { description: "Resend OTP" })
  async resendOtp(
    @Arg("PhoneNumber")
    phoneNumber: number
  ): Promise<any> {
    try {
      let users = await UserMongo.aggregate([
        {
          $match: {
            number: phoneNumber,
            isDelete: false,
          },
        },
      ]);
      if (users.length == 0) {
        throw new Error("Phone Number does not exist");
      }
      var min = 100000;
      var max = 999999;

      await UserMongo.updateOne(
        {
          _id: ObjectID(users[0]._id),
        },
        {
          $set: {
            otp: Math.floor(Math.random() * (max - min + 1)) + min,
          },
        }
      );
      let user = await UserMongo.findById(users[0]._id);

      const accountSid = "AC910e8cf6d3d7f68adc1987b8c23aacf7";
      const authToken = "7b7e0df76369b3125d63ab3db26220fa";
      let client = require("twilio")(accountSid, authToken);

      let sms = await client.messages
        .create({
          body: `Your Vots Verification OTP is: ${user.otp}`,
          from: "+13143505646",
          to: "+91" + user.number,
        })
        .then((response: any) => {
          console.log(response.sid, "response");
          return true;
        })
        .catch((err: any) => {
          console.log(err, "error");
          return false;
        });
      if (sms == true) {
        return { smsSent: true, userId: users[0]._id };
      } else {
        return { smsSent: false };
      }
    } catch (error) {
      throw new Error(`${error}`);
    }
  }
}
