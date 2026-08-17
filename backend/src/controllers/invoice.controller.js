import Invoice from "../models/Invoice.js";
import Product from "../models/Product.js";
import StockHistory
  from "../models/StockHistory.js";

export const createInvoice = async (req, res) => {
  try {
    console.log("========= REQUEST BODY =========");
    console.log(req.body);

    const invoice = await Invoice.create(
      req.body
    );

    console.log("========= SAVED INVOICE =========");
    console.log(invoice);




    for (const item of req.body.items) {

      const product =
        await Product.findById(
          item.productId
        );

      if (product) {

        const beforeStock =
          product.stock || 0;

        product.stock =
          beforeStock -
          Number(item.qty);

        await product.save();

        await StockHistory.create({

          productId:
            product._id,

          productName:
            product.name,

          type: "SALE",

          qty:
            Number(item.qty),

          stockBefore:
            beforeStock,

          stockAfter:
            product.stock,

          note:
            `Invoice ${invoice.invoiceNo}`,
        });
      }
    }

    res.status(201).json(invoice);

  } catch (error) {

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

export const updateInvoice = async (
  req,
  res
) => {
  try {

    const invoice =
      await Invoice.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );

    res.json(invoice);

  } catch (error) {

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