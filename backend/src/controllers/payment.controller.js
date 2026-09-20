import mongoose from "mongoose";
import Payment from "../models/Payment.js";
import Invoice from "../models/Invoice.js";


// CREATE PAYMENT
export const createPayment = async (req, res) => {
  try {
    const {
      partyName,
      invoiceNo,
      invoiceId,
      amount,
      paymentMode,
      paymentDate,
      note,
    } = req.body;

    if (!invoiceId) {
      return res.status(400).json({
        message: "Invoice ID is required",
      });
    }

    if (!amount || Number(amount) <= 0) {
      return res.status(400).json({
        message: "Please enter a valid payment amount",
      });
    }

    // Create payment
    const payment = await Payment.create({
      partyName,
      invoiceNo,
      invoiceId,
      amount: Number(amount),
      paymentMode,
      paymentDate,
      note,
    });

    // Find invoice
    const invoice = await Invoice.findById(invoiceId);

    if (!invoice) {
      return res.status(404).json({
        message: "Invoice not found",
      });
    }

    // Calculate all payments for this invoice
    const paymentSummary = await Payment.aggregate([
      {
        $match: {
          invoiceId: invoice._id,
        },
      },
      {
        $group: {
          _id: null,
          totalPaid: {
            $sum: "$amount",
          },
        },
      },
    ]);

    const totalPaid = Number(
      paymentSummary[0]?.totalPaid || 0
    );

    const invoiceTotal = Number(
      invoice.roundedTotal ??
      invoice.grandTotal ??
      0
    );

    const pendingAmount = Math.max(
      invoiceTotal - totalPaid,
      0
    );

    // Update invoice payment values
    invoice.paidAmount = totalPaid;
    invoice.pendingAmount = pendingAmount;

    await invoice.save();

    return res.status(201).json({
      message: "Payment added successfully",
      payment,
      paidAmount: totalPaid,
      pendingAmount,
    });
  } catch (error) {
    console.error("CREATE PAYMENT ERROR:", error);

    return res.status(500).json({
      message: "Failed to create payment",
      error: error.message,
    });
  }
};

// GET ALL PAYMENTS
export const getPayments = async (req, res) => {
  try {
    const payments = await Payment.find().sort({
      createdAt: -1,
    });

    res.status(200).json(payments);
  } catch (error) {
    console.error("GET PAYMENTS ERROR:", error);

    res.status(500).json({
      message: "Failed to fetch payments",
      error: error.message,
    });
  }
};

// UPDATE PAYMENT
export const updatePayment = async (req, res) => {
  try {
    const { id } = req.params;

    const updatedPayment = await Payment.findByIdAndUpdate(
      id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedPayment) {
      return res.status(404).json({
        message: "Payment not found",
      });
    }

    res.status(200).json(updatedPayment);
  } catch (error) {
    console.error("UPDATE PAYMENT ERROR:", error);

    res.status(500).json({
      message: "Failed to update payment",
      error: error.message,
    });
  }
};

// DELETE PAYMENT
// DELETE PAYMENT
export const deletePayment = async (req, res) => {
  try {
    const { id } = req.params;

    console.log("DELETE REQUEST RECEIVED");
    console.log("PAYMENT ID:", id);

    if (!id) {
      return res.status(400).json({
        message: "Payment ID is missing",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: `Invalid Payment ID: ${id}`,
      });
    }

    const deletedPayment = await Payment.findByIdAndDelete(id);

    if (!deletedPayment) {
      return res.status(404).json({
        message: "Payment not found in database",
      });
    }

    console.log("PAYMENT DELETED:", id);

    return res.status(200).json({
      message: "Payment deleted successfully",
    });
  } catch (error) {
    console.error("DELETE PAYMENT BACKEND ERROR:", error);

    return res.status(500).json({
      message: "Backend delete error",
      error: error.message,
    });
  }
};