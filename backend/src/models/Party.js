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
  },
  {
    timestamps: true,
  }
);

const Party = mongoose.model(
  "Party",
  partySchema
);

export default Party;