import mongoose from "mongoose";
import Invoice from "../models/Invoice.js";
import Product from "../models/Product.js";
import StockHistory
  from "../models/StockHistory.js";

export const createInvoice = async (req, res) => {
  try {
    console.log("========= CREATE INVOICE =========");
    console.log("DELIVERY RECEIVED:", {
      deliveryName: req.body.deliveryName,
      deliveryGstin: req.body.deliveryGstin,
      deliveryMobile: req.body.deliveryMobile,
      deliveryAddress: req.body.deliveryAddress,
      deliveryCity: req.body.deliveryCity,
      deliveryState: req.body.deliveryState,
    });

    const invoice = await Invoice.create({
      invoiceNo: req.body.invoiceNo,
      invoiceType: req.body.invoiceType || "NORMAL",

      partyName: req.body.partyName,
      partyAddress: req.body.partyAddress || "",
      partyGstin: req.body.partyGstin || "",
      partyCity: req.body.partyCity || "",
      partyState: req.body.partyState || "",
      partyMobile: req.body.partyMobile || "",

      // =========================
      // DELIVERY ADDRESS
      // =========================
      deliveryName: req.body.deliveryName || "",
      deliveryGstin: req.body.deliveryGstin || "",
      deliveryMobile: req.body.deliveryMobile || "",
      deliveryAddress: req.body.deliveryAddress || "",
      deliveryCity: req.body.deliveryCity || "",
      deliveryState: req.body.deliveryState || "",

      date: req.body.date,
      dateOfSupply: req.body.dateOfSupply,

      items: req.body.items || [],

      subtotal: req.body.subtotal || 0,
      discountPercent: req.body.discountPercent || 0,
      gstPercent: req.body.gstPercent || 0,
      discountAmount: req.body.discountAmount || 0,

      cgstAmount: req.body.cgstAmount || 0,
      sgstAmount: req.body.sgstAmount || 0,
      igstAmount: req.body.igstAmount || 0,
      gstAmount: req.body.gstAmount || 0,

      roundOff: req.body.roundOff || 0,
      roundedTotal: req.body.roundedTotal || 0,
      grandTotal: req.body.grandTotal || 0,

      paidAmount: req.body.paidAmount || 0,
      pendingAmount: req.body.pendingAmount || 0,
      paymentStatus: req.body.paymentStatus || "UNPAID",
    });

    console.log("========= DELIVERY SAVED =========");
    console.log({
      deliveryName: invoice.deliveryName,
      deliveryGstin: invoice.deliveryGstin,
      deliveryMobile: invoice.deliveryMobile,
      deliveryAddress: invoice.deliveryAddress,
      deliveryCity: invoice.deliveryCity,
      deliveryState: invoice.deliveryState,
    });

    // =========================
    // STOCK UPDATE
    // =========================

    for (const item of req.body.items || []) {
      const product = await Product.findById(item.productId);

      if (product) {
        const beforeStock = product.stock || 0;

        product.stock =
          beforeStock - Number(item.qty || 0);

        await product.save();

        await StockHistory.create({
          productId: product._id,
          productName: product.name,
          type: "SALE",
          qty: Number(item.qty || 0),
          stockBefore: beforeStock,
          stockAfter: product.stock,
          note: `Invoice ${invoice.invoiceNo}`,
        });
      }
    }

    res.status(201).json(invoice);

  } catch (error) {
    console.error("CREATE INVOICE ERROR:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};

export const getInvoices = async (req, res) => {
  try {

    const invoices = await Invoice.find();

    res.json(invoices);

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });
  }
};

export const getSingleInvoice = async (
  req,
  res
) => {
  try {

    const invoice = await Invoice.findById(
      req.params.id
    );

    res.json(invoice);

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });
  }
};

export const updateInvoice = async (req, res) => {
  try {
    const invoice = await Invoice.findByIdAndUpdate(
      req.params.id,
      {
        invoiceNo: req.body.invoiceNo,
        invoiceType: req.body.invoiceType || "NORMAL",

        partyName: req.body.partyName,
        partyAddress: req.body.partyAddress || "",
        partyGstin: req.body.partyGstin || "",
        partyCity: req.body.partyCity || "",
        partyState: req.body.partyState || "",
        partyMobile: req.body.partyMobile || "",

        // =========================
        // DELIVERY ADDRESS
        // =========================
        deliveryName: req.body.deliveryName || "",
        deliveryGstin: req.body.deliveryGstin || "",
        deliveryMobile: req.body.deliveryMobile || "",
        deliveryAddress: req.body.deliveryAddress || "",
        deliveryCity: req.body.deliveryCity || "",
        deliveryState: req.body.deliveryState || "",

        date: req.body.date,
        dateOfSupply: req.body.dateOfSupply,

        items: req.body.items || [],

        subtotal: req.body.subtotal || 0,
        discountPercent: req.body.discountPercent || 0,
        gstPercent: req.body.gstPercent || 0,
        discountAmount: req.body.discountAmount || 0,

        cgstAmount: req.body.cgstAmount || 0,
        sgstAmount: req.body.sgstAmount || 0,
        igstAmount: req.body.igstAmount || 0,
        gstAmount: req.body.gstAmount || 0,

        roundOff: req.body.roundOff || 0,
        roundedTotal: req.body.roundedTotal || 0,
        grandTotal: req.body.grandTotal || 0,

        paidAmount: req.body.paidAmount || 0,
        pendingAmount: req.body.pendingAmount || 0,
        paymentStatus: req.body.paymentStatus || "UNPAID",
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!invoice) {
      return res.status(404).json({
        message: "Invoice not found",
      });
    }

    console.log("========= UPDATED DELIVERY =========");
    console.log({
      deliveryName: invoice.deliveryName,
      deliveryGstin: invoice.deliveryGstin,
      deliveryMobile: invoice.deliveryMobile,
      deliveryAddress: invoice.deliveryAddress,
      deliveryCity: invoice.deliveryCity,
      deliveryState: invoice.deliveryState,
    });

    res.json(invoice);

  } catch (error) {
    console.error("UPDATE INVOICE ERROR:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};

export const deleteInvoice = async (req, res) => {
  try {
    const invoice = await Invoice.findByIdAndDelete(
      req.params.id
    );

    if (!invoice) {
      return res.status(404).json({
        message: "Invoice not found",
      });
    }

    res.json({
      message: "Invoice deleted successfully",
    });

  } catch (error) {
    console.error(
      "DELETE INVOICE ERROR:",
      error
    );

    res.status(500).json({
      message: error.message,
    });
  }
};