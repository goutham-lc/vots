import { Schema, model } from "mongoose";

const UserSchema = new Schema({
  name: {
    type: String,
    required: true,
    lowercase: true,
    validate: {
      validator: (value: any) => !/\s/g.test(value),
      message: "Name must not contain any whitespace characters",
    },
  },

  nikshayID: {
    type: String,
    required: true,
    lowercase: true,
    validate: {
      validator: (value: any) => !/\s/g.test(value),
      message: "Name must not contain any whitespace characters",
    },
  },

  dob: {
    type: Date,
    required: true,
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
    validate: {
      validator: (value: any) => !/\s/g.test(value),
      message: "Email must not contain any whitespace characters",
    },
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
