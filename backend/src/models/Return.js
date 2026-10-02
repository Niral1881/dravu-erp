import mongoose from "mongoose";

const returnSchema = new mongoose.Schema(
  {
    invoiceNo: {
      type: String,
      trim: true,
    },

    partyName: {
      type: String,
      trim: true,
    },

    // Product is entered manually
    productName: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
    },

    // No Product Master ID required
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      default: null,
    },

    // Return quantity
    qty: {
      type: Number,
      required: true,
      min: 1,
    },

    // Product rate
    rate: {
      type: Number,
      required: true,
      min: 0,
    },

    reason: {
      type: String,
      trim: true,
      default: "",
    },

    returnDate: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Return = mongoose.model(
  "Return",
  returnSchema
);

export default Return;