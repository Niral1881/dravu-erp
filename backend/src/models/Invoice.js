import mongoose from "mongoose";

const invoiceSchema = new mongoose.Schema(
  {
    invoiceNo: {
      type: String,
      required: true,
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