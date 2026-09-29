import mongoose from "mongoose";

const labourPaymentSchema = new mongoose.Schema(
  {
    labourId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Labour",
      required: true,
    },

    labourName: {
      type: String,
      required: true,
      trim: true,
    },

    amount: {
      type: Number,
      required: true,
      min: 0.01,
    },

    paymentMode: {
      type: String,
      enum: [
        "CASH",
        "UPI",
        "BANK",
        "CHEQUE",
        "OTHER",
      ],
      default: "CASH",
    },

    paymentDate: {
      type: String,
      required: true,
    },

    note: {
      type: String,
      default: "",
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model(
  "LabourPayment",
  labourPaymentSchema
);