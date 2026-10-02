import Return from "../models/Return.js";

// =====================================================
// CREATE RETURN
// =====================================================

export const createReturn = async (req, res) => {
  try {
    const {
      invoiceNo,
      partyName,
      productName,
      qty,
      rate,
      reason,
      returnDate,
    } = req.body;

    // -----------------------------
    // VALIDATION
    // -----------------------------

    if (!invoiceNo) {
      return res.status(400).json({
        message: "Invoice number is required",
      });
    }

    if (!productName || !productName.trim()) {
      return res.status(400).json({
        message: "Product name is required",
      });
    }

    if (!qty || Number(qty) <= 0) {
      return res.status(400).json({
        message: "Valid quantity is required",
      });
    }

    if (rate === undefined || rate === null || Number(rate) < 0) {
      return res.status(400).json({
        message: "Valid rate is required",
      });
    }

    // -----------------------------
    // CREATE RETURN
    // -----------------------------

    const returned = await Return.create({
      invoiceNo: invoiceNo.trim(),

      partyName: partyName?.trim() || "",

      productName: productName
        .trim()
        .toUpperCase(),

      productId: null,

      qty: Number(qty),

      rate: Number(rate),

      reason: reason?.trim() || "",

      returnDate,
    });

    // -----------------------------
    // RESPONSE
    // -----------------------------

    res.status(201).json(returned);

  } catch (error) {
    console.error(
      "CREATE RETURN ERROR:",
      error
    );

    res.status(500).json({
      message: error.message,
    });
  }
};


// =====================================================
// GET ALL RETURNS
// =====================================================

export const getReturns = async (req, res) => {
  try {
    const returns = await Return.find()
      .sort({
        returnDate: -1,
        createdAt: -1,
      });

    res.json(returns);

  } catch (error) {
    console.error(
      "GET RETURNS ERROR:",
      error
    );

    res.status(500).json({
      message: error.message,
    });
  }
};