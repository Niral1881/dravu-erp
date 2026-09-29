import LabourWork from "../models/LabourWork.js";

// =====================================
// GET ALL LABOUR WORK
// =====================================
export const getLabourWorks = async (req, res) => {
  try {
    const works = await LabourWork.find()
      .sort({ workDate: -1, createdAt: -1 });

    res.status(200).json(works);
  } catch (error) {
    console.error(
      "GET LABOUR WORK ERROR:",
      error
    );

    res.status(500).json({
      message: "Failed to fetch labour work",
      error: error.message,
    });
  }
};

// =====================================
// GET SINGLE LABOUR WORK
// =====================================
export const getLabourWorkById = async (
  req,
  res
) => {
  try {
    const work = await LabourWork.findById(
      req.params.id
    );

    if (!work) {
      return res.status(404).json({
        message: "Labour work not found",
      });
    }

    res.status(200).json(work);
  } catch (error) {
    console.error(
      "GET LABOUR WORK BY ID ERROR:",
      error
    );

    res.status(500).json({
      message: "Failed to fetch labour work",
      error: error.message,
    });
  }
};

// =====================================
// CREATE LABOUR WORK
// =====================================
export const createLabourWork = async (
  req,
  res
) => {
  try {
    const {
      labourId,
      labourName,
      productId,
      design,
      productName,

      // IMPORTANT
      size,

      workType,
      workDate,
      quantity,
      rate,
      notes,
    } = req.body;

    // -------------------------------------
    // VALIDATION
    // -------------------------------------
    if (!labourId) {
      return res.status(400).json({
        message: "Labour is required",
      });
    }

    if (!design?.trim()) {
      return res.status(400).json({
        message: "Design is required",
      });
    }

    if (!productName?.trim()) {
      return res.status(400).json({
        message: "Product is required",
      });
    }

    if (!size?.trim()) {
      return res.status(400).json({
        message: "Size is required",
      });
    }

    if (!workType?.trim()) {
      return res.status(400).json({
        message: "Work type is required",
      });
    }

    const qty = Number(quantity || 0);

    const workRate = Number(rate || 0);

    if (qty <= 0) {
      return res.status(400).json({
        message:
          "Quantity must be greater than 0",
      });
    }

    if (workRate < 0) {
      return res.status(400).json({
        message:
          "Rate cannot be negative",
      });
    }

    // -------------------------------------
    // CALCULATE AMOUNT
    // -------------------------------------
    const amount =
      qty * workRate;

    // -------------------------------------
    // CREATE
    // -------------------------------------
    const work =
      await LabourWork.create({
        labourId,

        labourName:
          labourName || "",

        productId:
          productId || null,

        design:
          design.trim(),

        productName:
          productName.trim(),

        // IMPORTANT
        size:
          size.trim().toUpperCase(),

        workType:
          workType.trim(),

        workDate:
          workDate ||
          new Date()
            .toISOString()
            .split("T")[0],

        quantity: qty,

        rate: workRate,

        amount,

        notes:
          notes || "",
      });

    res.status(201).json(work);

  } catch (error) {
    console.error(
      "CREATE LABOUR WORK ERROR:",
      error
    );

    res.status(500).json({
      message:
        "Failed to create labour work",
      error: error.message,
    });
  }
};

// =====================================
// UPDATE LABOUR WORK
// =====================================
export const updateLabourWork = async (
  req,
  res
) => {
  try {
    const {
      labourId,
      labourName,
      productId,
      design,
      productName,

      // IMPORTANT
      size,

      workType,
      workDate,
      quantity,
      rate,
      notes,
    } = req.body;

    // -------------------------------------
    // VALIDATION
    // -------------------------------------
    if (!labourId) {
      return res.status(400).json({
        message: "Labour is required",
      });
    }

    if (!design?.trim()) {
      return res.status(400).json({
        message: "Design is required",
      });
    }

    if (!productName?.trim()) {
      return res.status(400).json({
        message: "Product is required",
      });
    }

    if (!size?.trim()) {
      return res.status(400).json({
        message: "Size is required",
      });
    }

    if (!workType?.trim()) {
      return res.status(400).json({
        message: "Work type is required",
      });
    }

    const qty =
      Number(quantity || 0);

    const workRate =
      Number(rate || 0);

    if (qty <= 0) {
      return res.status(400).json({
        message:
          "Quantity must be greater than 0",
      });
    }

    if (workRate < 0) {
      return res.status(400).json({
        message:
          "Rate cannot be negative",
      });
    }

    // -------------------------------------
    // CALCULATE AMOUNT
    // -------------------------------------
    const amount =
      qty * workRate;

    // -------------------------------------
    // UPDATE
    // -------------------------------------
    const work =
      await LabourWork.findByIdAndUpdate(
        req.params.id,
        {
          labourId,

          labourName:
            labourName || "",

          productId:
            productId || null,

          design:
            design.trim(),

          productName:
            productName.trim(),

          // IMPORTANT
          size:
            size.trim().toUpperCase(),

          workType:
            workType.trim(),

          workDate,

          quantity: qty,

          rate: workRate,

          amount,

          notes:
            notes || "",
        },
        {
          new: true,
          runValidators: true,
        }
      );

    if (!work) {
      return res.status(404).json({
        message:
          "Labour work not found",
      });
    }

    res.status(200).json(work);

  } catch (error) {
    console.error(
      "UPDATE LABOUR WORK ERROR:",
      error
    );

    res.status(500).json({
      message:
        "Failed to update labour work",
      error: error.message,
    });
  }
};

// =====================================
// DELETE LABOUR WORK
// =====================================
export const deleteLabourWork = async (
  req,
  res
) => {
  try {
    const work =
      await LabourWork.findByIdAndDelete(
        req.params.id
      );

    if (!work) {
      return res.status(404).json({
        message:
          "Labour work not found",
      });
    }

    res.status(200).json({
      message:
        "Labour work deleted successfully",
    });

  } catch (error) {
    console.error(
      "DELETE LABOUR WORK ERROR:",
      error
    );

    res.status(500).json({
      message:
        "Failed to delete labour work",
      error: error.message,
    });
  }
};