import mongoose from "mongoose";
import Payment from "../models/Payment.js";
import Invoice from "../models/Invoice.js";

/* =========================================================
   HELPER
   Recalculate invoice payment totals
========================================================= */

const recalculateInvoicePayment = async (invoiceId) => {
  if (!invoiceId) return null;

  const invoice = await Invoice.findById(invoiceId);

  if (!invoice) return null;

  const payments = await Payment.find({
    invoiceId: invoice._id,
  });

  const invoiceTotal = Number(
    invoice.roundedTotal ??
    invoice.grandTotal ??
    0
  );

  let totalReceived = 0;
  let totalDiscountAmount = 0;

  payments.forEach((payment) => {
    const received = Number(payment.amount || 0);

    const discountPercent = Number(
      payment.discountPercent || 0
    );

    const discountAmount =
      (invoiceTotal * discountPercent) / 100;

    totalReceived += received;
    totalDiscountAmount += discountAmount;
  });

  const totalPaid =
    totalReceived + totalDiscountAmount;

  const pendingAmount = Math.max(
    invoiceTotal - totalPaid,
    0
  );

  let paymentStatus = "UNPAID";

  if (totalPaid >= invoiceTotal && invoiceTotal > 0) {
    paymentStatus = "PAID";
  } else if (totalPaid > 0) {
    paymentStatus = "PARTIAL";
  }

  invoice.paidAmount = totalPaid;
  invoice.pendingAmount = pendingAmount;
  invoice.paymentStatus = paymentStatus;

  await invoice.save();

  return {
    paidAmount: totalPaid,
    receivedAmount: totalReceived,
    discountAmount: totalDiscountAmount,
    pendingAmount,
    paymentStatus,
  };
};

/* =========================================================
   CREATE PAYMENT
========================================================= */

export const createPayment = async (req, res) => {
  try {
    const {
      partyName,
      invoiceNo,
      invoiceId,
      amount,
      discountPercent,
      paymentMode,
      paymentDate,
      note,
    } = req.body;

    /* =========================================
       VALIDATION
    ========================================= */

    if (!invoiceId) {
      return res.status(400).json({
        message: "Invoice ID is required",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(invoiceId)) {
      return res.status(400).json({
        message: "Invalid Invoice ID",
      });
    }

    const paymentAmount = Number(amount || 0);

    const discountPercentage = Number(
      discountPercent || 0
    );

    if (paymentAmount <= 0) {
      return res.status(400).json({
        message: "Please enter a valid payment amount",
      });
    }

    if (
      discountPercentage < 0 ||
      discountPercentage > 100
    ) {
      return res.status(400).json({
        message:
          "Discount percentage must be between 0 and 100",
      });
    }

    /* =========================================
       FIND INVOICE
    ========================================= */

    const invoice = await Invoice.findById(
      invoiceId
    );

    if (!invoice) {
      return res.status(404).json({
        message: "Invoice not found",
      });
    }

    const invoiceTotal = Number(
      invoice.roundedTotal ??
      invoice.grandTotal ??
      0
    );

    /* =========================================
       CURRENT SETTLED AMOUNT
    ========================================= */

    const currentPayments = await Payment.find({
      invoiceId: invoice._id,
    });

    let currentReceived = 0;
    let currentDiscountAmount = 0;

    currentPayments.forEach((payment) => {
      const received = Number(
        payment.amount || 0
      );

      const oldDiscountPercent = Number(
        payment.discountPercent || 0
      );

      const oldDiscountAmount =
        (invoiceTotal * oldDiscountPercent) / 100;

      currentReceived += received;
      currentDiscountAmount += oldDiscountAmount;
    });

    const currentPaid =
      currentReceived + currentDiscountAmount;

    const pendingBeforePayment = Math.max(
      invoiceTotal - currentPaid,
      0
    );

    /* =========================================
       CURRENT DISCOUNT AMOUNT
    ========================================= */

    const discountAmount =
      (invoiceTotal * discountPercentage) / 100;

    const totalSettlement =
      paymentAmount + discountAmount;

    /* =========================================
       PREVENT OVERPAYMENT
    ========================================= */

    if (totalSettlement > pendingBeforePayment) {
      return res.status(400).json({
        message:
          `Payment + Discount cannot be greater than ` +
          `pending amount ₹${pendingBeforePayment.toFixed(2)}`,
      });
    }

    /* =========================================
       CREATE PAYMENT
    ========================================= */

    const payment = await Payment.create({
      partyName,
      invoiceNo,
      invoiceId,

      amount: paymentAmount,

      discountPercent: discountPercentage,

      paymentMode,
      paymentDate,
      note: note || "",
    });

    /* =========================================
       RECALCULATE INVOICE
    ========================================= */

    const paymentSummary =
      await recalculateInvoicePayment(
        invoiceId
      );

    return res.status(201).json({
      message: "Payment added successfully",

      payment,

      paidAmount:
        paymentSummary?.paidAmount || 0,

      receivedAmount:
        paymentSummary?.receivedAmount || 0,

      discountAmount:
        paymentSummary?.discountAmount || 0,

      pendingAmount:
        paymentSummary?.pendingAmount || 0,

      paymentStatus:
        paymentSummary?.paymentStatus ||
        "UNPAID",
    });
  } catch (error) {
    console.error(
      "CREATE PAYMENT ERROR:",
      error
    );

    return res.status(500).json({
      message: "Failed to create payment",
      error: error.message,
    });
  }
};

/* =========================================================
   GET ALL PAYMENTS
========================================================= */

export const getPayments = async (
  req,
  res
) => {
  try {
    const payments =
      await Payment.find().sort({
        paymentDate: -1,
        createdAt: -1,
      });

    return res.status(200).json(
      payments
    );
  } catch (error) {
    console.error(
      "GET PAYMENTS ERROR:",
      error
    );

    return res.status(500).json({
      message: "Failed to fetch payments",
      error: error.message,
    });
  }
};

/* =========================================================
   UPDATE PAYMENT
========================================================= */

export const updatePayment = async (
  req,
  res
) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        message: "Payment ID is missing",
      });
    }

    if (
      !mongoose.Types.ObjectId.isValid(id)
    ) {
      return res.status(400).json({
        message: "Invalid Payment ID",
      });
    }

    const oldPayment =
      await Payment.findById(id);

    if (!oldPayment) {
      return res.status(404).json({
        message: "Payment not found",
      });
    }

    const invoiceId =
      oldPayment.invoiceId;

    const invoice =
      await Invoice.findById(invoiceId);

    if (!invoice) {
      return res.status(404).json({
        message: "Invoice not found",
      });
    }

    const invoiceTotal = Number(
      invoice.roundedTotal ??
      invoice.grandTotal ??
      0
    );

    const paymentAmount = Number(
      req.body.amount || 0
    );

    const discountPercentage = Number(
      req.body.discountPercent || 0
    );

    if (paymentAmount <= 0) {
      return res.status(400).json({
        message: "Please enter a valid payment amount",
      });
    }

    if (
      discountPercentage < 0 ||
      discountPercentage > 100
    ) {
      return res.status(400).json({
        message:
          "Discount percentage must be between 0 and 100",
      });
    }

    /* =========================================
       CALCULATE OTHER PAYMENTS
       Exclude current payment
    ========================================= */

    const otherPayments =
      await Payment.find({
        invoiceId,
        _id: { $ne: id },
      });

    let otherReceived = 0;
    let otherDiscountAmount = 0;

    otherPayments.forEach((payment) => {
      otherReceived += Number(
        payment.amount || 0
      );

      const percentage = Number(
        payment.discountPercent || 0
      );

      otherDiscountAmount +=
        (invoiceTotal * percentage) / 100;
    });

    const otherSettled =
      otherReceived +
      otherDiscountAmount;

    const pendingBeforeUpdate =
      Math.max(
        invoiceTotal - otherSettled,
        0
      );

    const discountAmount =
      (invoiceTotal * discountPercentage) / 100;

    const newSettlement =
      paymentAmount + discountAmount;

    if (
      newSettlement >
      pendingBeforeUpdate
    ) {
      return res.status(400).json({
        message:
          `Payment + Discount cannot be greater than ` +
          `pending amount ₹${pendingBeforeUpdate.toFixed(2)}`,
      });
    }

    /* =========================================
       UPDATE
    ========================================= */

    const updatedPayment =
      await Payment.findByIdAndUpdate(
        id,
        {
          amount: paymentAmount,

          discountPercent:
            discountPercentage,

          paymentMode:
            req.body.paymentMode,

          paymentDate:
            req.body.paymentDate,

          note: req.body.note || "",
        },
        {
          new: true,
          runValidators: true,
        }
      );

    /* =========================================
       RECALCULATE
    ========================================= */

    const paymentSummary =
      await recalculateInvoicePayment(
        invoiceId
      );

    return res.status(200).json({
      message:
        "Payment updated successfully",

      payment:
        updatedPayment,

      paidAmount:
        paymentSummary?.paidAmount || 0,

      receivedAmount:
        paymentSummary?.receivedAmount || 0,

      discountAmount:
        paymentSummary?.discountAmount || 0,

      pendingAmount:
        paymentSummary?.pendingAmount || 0,

      paymentStatus:
        paymentSummary?.paymentStatus ||
        "UNPAID",
    });
  } catch (error) {
    console.error(
      "UPDATE PAYMENT ERROR:",
      error
    );

    return res.status(500).json({
      message: "Failed to update payment",
      error: error.message,
    });
  }
};

/* =========================================================
   DELETE PAYMENT
========================================================= */

export const deletePayment = async (
  req,
  res
) => {
  try {
    const { id } = req.params;

    if (
      !mongoose.Types.ObjectId.isValid(id)
    ) {
      return res.status(400).json({
        message: "Invalid payment ID",
      });
    }

    const payment =
      await Payment.findById(id);

    if (!payment) {
      return res.status(404).json({
        message: "Payment not found",
      });
    }

    const invoiceId =
      payment.invoiceId;

    await Payment.findByIdAndDelete(id);

    const result =
      await recalculateInvoicePayment(
        invoiceId
      );

    return res.status(200).json({
      message:
        "Payment deleted successfully",

      paymentId: id,
      invoiceId,

      paidAmount:
        result?.paidAmount || 0,

      receivedAmount:
        result?.receivedAmount || 0,

      discountAmount:
        result?.discountAmount || 0,

      pendingAmount:
        result?.pendingAmount || 0,

      paymentStatus:
        result?.paymentStatus ||
        "UNPAID",
    });
  } catch (error) {
    console.error(
      "DELETE PAYMENT ERROR:",
      error
    );

    return res.status(500).json({
      message: "Failed to delete payment",
      error: error.message,
    });
  }
};