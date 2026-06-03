import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    design: {
      type: String,
      required: true,
    },

    name: {
      type: String,
      required: true,
    },

    size: {
      type: String,
    },

    color: {
      type: String,
    },

    stock: {
      type: Number,
      default: 0,
    },

    rate: {
      type: Number,
      required: true,
    },

    stock: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model(
  "Product",
  productSchema
);

export default Product;