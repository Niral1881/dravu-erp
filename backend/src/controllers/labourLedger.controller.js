import Labour from "../models/Labour.js";
import LabourWork from "../models/LabourWork.js";
import LabourPayment from "../models/LabourPayment.js";

export const getLabourLedger = async (req, res) => {
  try {
    const { labourId } = req.params;

    const labour = await Labour.findById(labourId);

    if (!labour) {
      return res.status(404).json({
        message: "Labour not found",
      });
    }

    // =====================================
    // GET WORK
    // =====================================
    const works = await LabourWork.find({
      labourId,
    }).sort({
      workDate: 1,
      createdAt: 1,
    });

    // =====================================
    // GET PAYMENTS
    // =====================================
    const payments = await LabourPayment.find({
      labourId,
    }).sort({
      paymentDate: 1,
      createdAt: 1,
    });

    // =====================================
    // COMBINE WORK + PAYMENT
    // =====================================
    const entries = [];

    works.forEach((work) => {
      entries.push({
        _id: work._id,
        date: work.workDate,

        type: "WORK",

        description: `${work.design} - ${work.workType}`,

        productName:
          work.productName || "",

        quantity:
          Number(work.quantity || 0),

        rate:
          Number(work.rate || 0),

        debit:
          Number(work.amount || 0),

        credit: 0,

        paymentMode: "",

        note: work.notes || "",

        createdAt: work.createdAt,
      });
    });

    payments.forEach((payment) => {
      entries.push({
        _id: payment._id,
        date: payment.paymentDate,

        type: "PAYMENT",

        description: "Labour Payment",

        productName: "",

        quantity: 0,

        rate: 0,

        debit: 0,

        credit:
          Number(payment.amount || 0),

        paymentMode:
          payment.paymentMode || "",

        note: payment.note || "",

        createdAt: payment.createdAt,
      });
    });

    // =====================================
    // SORT
    // =====================================
    entries.sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);

      if (dateA.getTime() !== dateB.getTime()) {
        return dateA - dateB;
      }

      return (
        new Date(a.createdAt) -
        new Date(b.createdAt)
      );
    });

    // =====================================
    // CALCULATE RUNNING BALANCE
    // =====================================
    let balance = 0;

    const ledger = entries.map((entry) => {
      balance +=
        Number(entry.debit || 0) -
        Number(entry.credit || 0);

      return {
        ...entry,
        balance,
      };
    });

    // =====================================
    // TOTALS
    // =====================================
    const totalDebit = ledger.reduce(
      (sum, entry) =>
        sum + Number(entry.debit || 0),
      0
    );

    const totalCredit = ledger.reduce(
      (sum, entry) =>
        sum + Number(entry.credit || 0),
      0
    );

    const pending = Math.max(
      totalDebit - totalCredit,
      0
    );

    res.status(200).json({
      labour: {
        _id: labour._id,
        name: labour.name,
        mobile: labour.mobile,
        workType: labour.workType,
        rateType: labour.rateType,
      },

      summary: {
        totalWork: totalDebit,
        totalPaid: totalCredit,
        pending,
      },

      ledger,
    });
  } catch (error) {
    console.error(
      "GET LABOUR LEDGER ERROR:",
      error
    );

    res.status(500).json({
      message: "Failed to fetch labour ledger",
      error: error.message,
    });
  }
};