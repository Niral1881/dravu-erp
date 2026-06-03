import mongoose from "mongoose";

const returnSchema =
  new mongoose.Schema(
    {
      invoiceNo: String,

      partyName: String,

      productId: {
        type:
          mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },

      productName: String,

      qty: Number,

      reason: String,

      returnDate: String,
    },
    {
      timestamps: true,
    }
  );

const Return =
  mongoose.model(
    "Return",
    returnSchema
  );

export default Return;