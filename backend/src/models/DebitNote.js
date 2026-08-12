import mongoose from "mongoose";

const debitNoteSchema = new mongoose.Schema(
  {
    debitNoteNo: {
      type: String,
      required: true,
    },

    supplierId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Party",
      required: true,
    },

    supplierName: {
      type: String,
      required: true,
    },

    supplierAddress: String,

    supplierCity: String,

    supplierState: String,

    supplierPincode: String,

    supplierMobile: String,

    supplierGstin: String,

    date: {
      type: String,
      required: true,
    },

    reason: {
      type: String,
      default: "RAW MATERIAL PURCHASE",
    },

    taxType: {
      type: String,
      enum: ["CGST_SGST", "IGST"],
      default: "CGST_SGST",
    },

    items: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
        },

        product: {
          type: String,
          required: true,
        },

        qty: {
          type: Number,
          required: true,
        },

        rate: {
          type: Number,
          required: true,
        },

        total: {
          type: Number,
          required: true,
        },
      },
    ],

    subtotal: {
      type: Number,
      default: 0,
    },

    gstPercent: {
      type: Number,
      default: 0,
    },

    cgstAmount: {
      type: Number,
      default: 0,
    },

    sgstAmount: {
      type: Number,
      default: 0,
    },

    igstAmount: {
      type: Number,
      default: 0,
    },

    gstAmount: {
      type: Number,
      default: 0,
    },

    roundOff: {
      type: Number,
      default: 0,
    },

    roundedTotal: {
      type: Number,
      default: 0,
    },

    grandTotal: {
      type: Number,
      default: 0,
    },

    note: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

const DebitNote = mongoose.model(
  "DebitNote",
  debitNoteSchema
);

export default DebitNote;