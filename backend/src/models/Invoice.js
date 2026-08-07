import mongoose from "mongoose";

const invoiceSchema = new mongoose.Schema(
  {
    invoiceNo: {
      type: String,
      required: true,
    },

    invoiceType: {
      type: String,
      default: "NORMAL",
    },

    partyName: {
      type: String,
      required: true,
    },

    partyAddress: String,

    partyGstin: String,

    dateOfSupply: String,

    partyCity: String,

    partyState: String,

    partyPincode: String,

    partyMobile: String,

    date: String,

    paidAmount: {
      type: Number,
      default: 0,
    },

    pendingAmount: {
      type: Number,
      default: 0,
    },

    paymentStatus: {
      type: String,
      default: "UNPAID",
    },

    items: [
      {
        product: String,

        qty: Number,

        rate: Number,

        total: Number,
      },
    ],

    subtotal: Number,

    discountPercent: Number,

    gstPercent: Number,

    discountAmount: Number,

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

    gstAmount: Number,

    roundOff: Number,

    roundedTotal: Number,

    grandTotal: Number,
  },
  {
    timestamps: true,
  }
);

const Invoice = mongoose.model(
  "Invoice",
  invoiceSchema
);

export default Invoice;