import mongoose from "mongoose";

const stockHistorySchema =
  new mongoose.Schema(
    {
      productId: {
        type:
          mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },

      productName: String,

      type: String,

      qty: Number,

      stockBefore: Number,

      stockAfter: Number,

      note: String,
    },
    {
      timestamps: true,
    }
  );

const StockHistory =
  mongoose.model(
    "StockHistory",
    stockHistorySchema
  );

export default StockHistory;