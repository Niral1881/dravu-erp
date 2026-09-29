import LabourPayment from "../models/LabourPayment.js";
import Labour from "../models/Labour.js";
import LabourWork from "../models/LabourWork.js";

// =====================================
// GET ALL LABOUR PAYMENTS
// =====================================
export const getLabourPayments = async (
  req,
  res
) => {
  try {
    const payments =
      await LabourPayment.find()
        .sort({
          paymentDate: -1,
          createdAt: -1,
        });

    res.status(200).json(payments);
  } catch (error) {
    console.error(
      "GET LABOUR PAYMENTS ERROR:",
      error
    );

    res.status(500).json({
      message: "Failed to fetch labour payments",
      error: error.message,
    });
  }
};

// =====================================
// GET PAYMENTS FOR ONE LABOUR
// =====================================
export const getLabourPaymentsByLabour =
  async (req, res) => {
    try {
      const payments =
        await LabourPayment.find({
          labourId: req.params.labourId,
        }).sort({
          paymentDate: -1,
          createdAt: -1,
        });

      res.status(200).json(payments);
    } catch (error) {
      console.error(
        "GET LABOUR PAYMENT HISTORY ERROR:",
        error
      );

      res.status(500).json({
        message:
          "Failed to fetch labour payment history",
        error: error.message,
      });
    }
  };

// =====================================
// CREATE PAYMENT
// =====================================
export const createLabourPayment = async (
  req,
  res
) => {
  try {
    const {
      labourId,
      labourName,
      amount,
      paymentMode,
      paymentDate,
      note,
    } = req.body;

    if (!labourId) {
      return res.status(400).json({
        message: "Labour is required",
      });
    }

    const labour = await Labour.findById(
      labourId
    );

    if (!labour) {
      return res.status(404).json({
        message: "Labour not found",
      });
    }

    const paymentAmount = Number(amount || 0);

    if (paymentAmount <= 0) {
      return res.status(400).json({
        message:
          "Payment amount must be greater than 0",
      });
    }

    // -------------------------------------
    // CALCULATE TOTAL WORK
    // -------------------------------------
    const workSummary =
      await LabourWork.aggregate([
        {
          $match: {
            labourId:
              labour._id,
          },
        },
        {
          $group: {
            _id: null,
            totalWork: {
              $sum: "$amount",
            },
          },
        },
      ]);

    const totalWork = Number(
      workSummary[0]?.totalWork || 0
    );

    // -------------------------------------
    // CALCULATE ALREADY PAID
    // -------------------------------------
    const paymentSummary =
      await LabourPayment.aggregate([
        {
          $match: {
            labourId:
              labour._id,
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

    const alreadyPaid = Number(
      paymentSummary[0]?.totalPaid || 0
    );

    const pending =
      totalWork - alreadyPaid;

    // -------------------------------------
    // PREVENT OVER PAYMENT
    // -------------------------------------
    if (paymentAmount > pending) {
      return res.status(400).json({
        message: `Maximum payable amount is ₹${Math.max(
          pending,
          0
        ).toFixed(2)}`,
      });
    }

    const payment =
      await LabourPayment.create({
        labourId,
        labourName:
          labourName || labour.name,
        amount: paymentAmount,
        paymentMode:
          paymentMode || "CASH",
        paymentDate:
          paymentDate ||
          new Date()
            .toISOString()
            .split("T")[0],
        note: note || "",
      });

    res.status(201).json(payment);
  } catch (error) {
    console.error(
      "CREATE LABOUR PAYMENT ERROR:",
      error
    );

    res.status(500).json({
      message:
        "Failed to create labour payment",
      error: error.message,
    });
  }
};

// =====================================
// UPDATE PAYMENT
// =====================================
export const updateLabourPayment =
  async (req, res) => {
    try {
      const {
        amount,
        paymentMode,
        paymentDate,
        note,
      } = req.body;

      const payment =
        await LabourPayment.findById(
          req.params.id
        );

      if (!payment) {
        return res.status(404).json({
          message: "Payment not found",
        });
      }

      const newAmount = Number(amount || 0);

      if (newAmount <= 0) {
        return res.status(400).json({
          message:
            "Payment amount must be greater than 0",
        });
      }

      // -------------------------------------
      // TOTAL WORK
      // -------------------------------------
      const workSummary =
        await LabourWork.aggregate([
          {
            $match: {
              labourId:
                payment.labourId,
            },
          },
          {
            $group: {
              _id: null,
              totalWork: {
                $sum: "$amount",
              },
            },
          },
        ]);

      const totalWork = Number(
        workSummary[0]?.totalWork || 0
      );

      // -------------------------------------
      // OTHER PAYMENTS
      // -------------------------------------
      const paymentSummary =
        await LabourPayment.aggregate([
          {
            $match: {
              labourId:
                payment.labourId,
              _id: {
                $ne: payment._id,
              },
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

      const otherPaid = Number(
        paymentSummary[0]?.totalPaid || 0
      );

      const maximum =
        totalWork - otherPaid;

      if (newAmount > maximum) {
        return res.status(400).json({
          message: `Maximum payable amount is ₹${Math.max(
            maximum,
            0
          ).toFixed(2)}`,
        });
      }

      payment.amount = newAmount;

      payment.paymentMode =
        paymentMode || "CASH";

      payment.paymentDate =
        paymentDate ||
        payment.paymentDate;

      payment.note = note || "";

      await payment.save();

      res.status(200).json(payment);
    } catch (error) {
      console.error(
        "UPDATE LABOUR PAYMENT ERROR:",
        error
      );

      res.status(500).json({
        message:
          "Failed to update labour payment",
        error: error.message,
      });
    }
  };

// =====================================
// DELETE PAYMENT
// =====================================
export const deleteLabourPayment =
  async (req, res) => {
    try {
      const payment =
        await LabourPayment.findByIdAndDelete(
          req.params.id
        );

      if (!payment) {
        return res.status(404).json({
          message: "Payment not found",
        });
      }

      res.status(200).json({
        message:
          "Labour payment deleted successfully",
      });
    } catch (error) {
      console.error(
        "DELETE LABOUR PAYMENT ERROR:",
        error
      );

      res.status(500).json({
        message:
          "Failed to delete labour payment",
        error: error.message,
      });
    }
  };