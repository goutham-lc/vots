import { Schema, model } from "mongoose";

const RecordCountSchema = new Schema({
  Date: {
    type: Date,
    required: true,
    default: new Date(
        new Date().setHours(
          new Date().getHours() + 5,
          new Date().getMinutes() + 30
        )
      ),
  },

  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
});

export const RecordCount = model("RecordCount", RecordCountSchema);
