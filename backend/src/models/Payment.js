import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    partyName: {
      type: String,
      trim: true,
    },

    invoiceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Invoice",
    },

    invoiceNo: {
      type: String,
      trim: true,
    },

    // Actual amount received from customer
    amount: {
      type: Number,
      default: 0,
      min: 0,
    },

    // Discount / transaction charge in percentage
    discountPercent: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },

    paymentMode: {
      type: String,
      default: "Cash",
    },

    note: {
      type: String,
      default: "",
      trim: true,
    },

    paymentDate: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const Payment = mongoose.model(
  "Payment",
  paymentSchema
);

export default Payment;