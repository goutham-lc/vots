import { Schema, model } from "mongoose";

const UserSchema = new Schema({
  name: {
    type: String,
    lowercase: true,
  },

  nikshayID: {
    type: String,
    lowercase: true,
  },

  dob: {
    type: Date,
  },

  countryCode: {
    type: String,
    required: true,
    default: "+91",
  },

  number: {
    type: Number,
    unique: true,
    required: true,
    validate: {
      validator: function (val: any) {
        return val.toString().length === 10;
      },
      message: "Contact Number has to be 10 digits",
    },
  },

  email: {
    type: String,
    lowercase: true,
  },

  isAdmin: {
    type: Boolean,
    required: true,
    default: false,
  },

  createdAt: {
    type: Date,
    required: true,
    default: new Date(
      new Date().setHours(
        new Date().getHours() + 5,
        new Date().getMinutes() + 30
      )
    ),
  },

  personId: {
    type: Number,
  },

  updatedAt: {
    type: Date,
    required: true,
    default: new Date(
      new Date().setHours(
        new Date().getHours() + 5,
        new Date().getMinutes() + 30
      )
    ),
  },

  isDelete: {
    type: Boolean,
    required: true,
    default: false,
  },
  otp: {
    type: Number,
  },
});

export const User = model("User", UserSchema);
