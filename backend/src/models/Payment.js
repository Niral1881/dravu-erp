import mongoose from "mongoose";

const paymentSchema =
  new mongoose.Schema(
    {
      partyName: String,

      invoiceId: {
        type:
          mongoose.Schema.Types.ObjectId,
        ref: "Invoice",
      },

      invoiceNo: String,

      amount: Number,

      paymentMode: String,

      note: String,

      paymentDate: String,
    },
    {
      timestamps: true,
    }
  );

const Payment =
  mongoose.model(
    "Payment",
    paymentSchema
  );

export default Payment;