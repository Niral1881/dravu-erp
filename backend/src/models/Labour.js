import mongoose from "mongoose";

const labourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    mobile: {
      type: String,
      trim: true,
      default: "",
    },

    workType: {
      type: String,
      required: true,
      trim: true,
    },

    rateType: {
      type: String,
      enum: [
        "PER_PIECE",
        "PER_DOZEN",
        "PER_DAY",
        "FIXED",
      ],
      default: "PER_PIECE",
    },

    defaultRate: {
      type: Number,
      default: 0,
      min: 0,
    },

    address: {
      type: String,
      trim: true,
      default: "",
    },

    joiningDate: {
      type: String,
      default: "",
    },

    status: {
      type: String,
      enum: ["ACTIVE", "INACTIVE"],
      default: "ACTIVE",
    },

    notes: {
      type: String,
      trim: true,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Labour", labourSchema);