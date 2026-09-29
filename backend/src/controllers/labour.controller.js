import Labour from "../models/Labour.js";

// ================================
// GET ALL LABOUR
// ================================
export const getLabours = async (req, res) => {
  try {
    const labours = await Labour.find().sort({
      createdAt: -1,
    });

    res.status(200).json(labours);
  } catch (error) {
    console.error("GET LABOUR ERROR:", error);

    res.status(500).json({
      message: "Failed to fetch labour",
      error: error.message,
    });
  }
};

// ================================
// GET SINGLE LABOUR
// ================================
export const getLabourById = async (req, res) => {
  try {
    const labour = await Labour.findById(req.params.id);

    if (!labour) {
      return res.status(404).json({
        message: "Labour not found",
      });
    }

    res.status(200).json(labour);
  } catch (error) {
    console.error("GET LABOUR BY ID ERROR:", error);

    res.status(500).json({
      message: "Failed to fetch labour",
      error: error.message,
    });
  }
};

// ================================
// CREATE LABOUR
// ================================
export const createLabour = async (req, res) => {
  try {
    const {
      name,
      mobile,
      workType,
      rateType,
      defaultRate,
      address,
      joiningDate,
      status,
      notes,
    } = req.body;

    if (!name?.trim()) {
      return res.status(400).json({
        message: "Labour name is required",
      });
    }

    if (!workType?.trim()) {
      return res.status(400).json({
        message: "Work type is required",
      });
    }

    const labour = await Labour.create({
      name: name.trim(),
      mobile: mobile || "",
      workType: workType.trim(),
      rateType: rateType || "PER_PIECE",
      defaultRate: Number(defaultRate || 0),
      address: address || "",
      joiningDate: joiningDate || "",
      status: status || "ACTIVE",
      notes: notes || "",
    });

    res.status(201).json(labour);
  } catch (error) {
    console.error("CREATE LABOUR ERROR:", error);

    res.status(500).json({
      message: "Failed to create labour",
      error: error.message,
    });
  }
};

// ================================
// UPDATE LABOUR
// ================================
export const updateLabour = async (req, res) => {
  try {
    const {
      name,
      mobile,
      workType,
      rateType,
      defaultRate,
      address,
      joiningDate,
      status,
      notes,
    } = req.body;

    if (!name?.trim()) {
      return res.status(400).json({
        message: "Labour name is required",
      });
    }

    if (!workType?.trim()) {
      return res.status(400).json({
        message: "Work type is required",
      });
    }

    const labour = await Labour.findByIdAndUpdate(
      req.params.id,
      {
        name: name.trim(),
        mobile: mobile || "",
        workType: workType.trim(),
        rateType: rateType || "PER_PIECE",
        defaultRate: Number(defaultRate || 0),
        address: address || "",
        joiningDate: joiningDate || "",
        status: status || "ACTIVE",
        notes: notes || "",
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!labour) {
      return res.status(404).json({
        message: "Labour not found",
      });
    }

    res.status(200).json(labour);
  } catch (error) {
    console.error("UPDATE LABOUR ERROR:", error);

    res.status(500).json({
      message: "Failed to update labour",
      error: error.message,
    });
  }
};

// ================================
// DELETE LABOUR
// ================================
export const deleteLabour = async (req, res) => {
  try {
    const labour = await Labour.findByIdAndDelete(
      req.params.id
    );

    if (!labour) {
      return res.status(404).json({
        message: "Labour not found",
      });
    }

    res.status(200).json({
      message: "Labour deleted successfully",
    });
  } catch (error) {
    console.error("DELETE LABOUR ERROR:", error);

    res.status(500).json({
      message: "Failed to delete labour",
      error: error.message,
    });
  }
};