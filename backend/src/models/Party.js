import mongoose from "mongoose";

const partySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    mobile: String,

    gstin: String,

    agent: String,

    address: String,

    city: String,

    state: String,

    pincode: String,

    partyType: {
      type: String,
      enum: ["SALES", "PURCHASE"],
      default: "SALES",
    },

    openingBalance: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const Party = mongoose.model("Party", partySchema);

export default Party;