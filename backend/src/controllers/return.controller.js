import Return
  from "../models/Return.js";

import Product
  from "../models/Product.js";

import StockHistory
  from "../models/StockHistory.js";

export const createReturn =
  async (req, res) => {

    try {

      const returned =
        await Return.create(
          req.body
        );

      const product =
        await Product.findById(
          req.body.productId
        );

      if (product) {

        const beforeStock =
          product.stock || 0;

        product.stock =
          beforeStock +
          Number(req.body.qty);

        await product.save();

        await StockHistory.create({

          productId:
            product._id,

          productName:
            product.name,

          type: "RETURN",

          qty:
            Number(req.body.qty),

          stockBefore:
            beforeStock,

          stockAfter:
            product.stock,

          note:
            `Return Invoice ${req.body.invoiceNo}`,
        });
      }

      res.status(201).json(
        returned
      );

    } catch (error) {

      res.status(500).json({
        message:
          error.message,
      });
    }
  };

export const getReturns =
  async (req, res) => {

    try {

      const returns =
        await Return.find()
          .sort({
            createdAt: -1,
          });

      res.json(returns);

    } catch (error) {

      res.status(500).json({
        message:
          error.message,
      });
    }
  };