import Payment from "../models/Payment.js";
import Invoice from "../models/Invoice.js";

export const createPayment =
  async (req, res) => {

    try {

      const payment =
        await Payment.create(
          req.body
        );

      const invoice =
        await Invoice.findById(
          req.body.invoiceId
        );

      if (invoice) {

        invoice.paidAmount =
          (
            invoice.paidAmount || 0
          ) +
          Number(req.body.amount);

        invoice.pendingAmount =
          (
            invoice.roundedTotal ||
            invoice.grandTotal
          ) -
          invoice.paidAmount;

        // PAYMENT STATUS
        if (
          invoice.pendingAmount <= 0
        ) {

          invoice.paymentStatus =
            "PAID";

        } else if (
          invoice.paidAmount > 0
        ) {

          invoice.paymentStatus =
            "PARTIAL";

        } else {

          invoice.paymentStatus =
            "UNPAID";
        }

        await invoice.save();
      }

      res.status(201).json(
        payment
      );

    } catch (error) {

      res.status(500).json({
        message:
          error.message,
      });
    }
  };

export const getPayments =
  async (req, res) => {

    try {

      const payments =
        await Payment.find()
          .sort({
            createdAt: -1,
          });

      res.json(payments);

    } catch (error) {

      res.status(500).json({
        message:
          error.message,
      });
    }
  };