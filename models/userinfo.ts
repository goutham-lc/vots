import { Schema, model } from "mongoose";

const UserInfoSchema = new Schema({
  link: {
    type: String,
    required: true,
  },

  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  status: {
    type: String,
    default:"Pending"
  },

  location: {
    type: String,
    required: true,
  },

  isVerified: {
    type: Boolean,
    default: false,
  },

  createdAt: {
    type: Date,
    default: new Date(
      new Date().setHours(
        new Date().getHours() + 5,
        new Date().getMinutes() + 30
      )
    ),
  },

  updatedAt: {
    type: Date,
    default: new Date(
      new Date().setHours(
        new Date().getHours() + 5,
        new Date().getMinutes() + 30
      )
    ),
  },

  isDelete: {
    type: Boolean,
    default: false,
  },
});

export const UserInfo = model("UserInfo", UserInfoSchema);
