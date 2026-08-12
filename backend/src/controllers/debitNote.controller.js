import DebitNote from "../models/DebitNote.js";


// ======================================
// CREATE DEBIT NOTE
// ======================================

export const createDebitNote = async (req, res) => {
  try {
    console.log("\n================================");
    console.log("CREATE DEBIT NOTE");
    console.log("REQUEST BODY:");
    console.log(
      JSON.stringify(req.body, null, 2)
    );
    console.log("================================");

    const debitNote = await DebitNote.create(
      req.body
    );

    console.log(
      "DEBIT NOTE CREATED:",
      debitNote._id
    );

    res.status(201).json(debitNote);

  } catch (error) {

    console.error("\n================================");
    console.error("CREATE DEBIT NOTE ERROR");
    console.error("NAME:", error.name);
    console.error("MESSAGE:", error.message);
    console.error("ERROR:", error);
    console.error("================================\n");

    res.status(400).json({
      message: error.message,
      error: error.name,
      details: error.errors
        ? Object.keys(error.errors).reduce(
          (result, key) => {
            result[key] =
              error.errors[key].message;
            return result;
          },
          {}
        )
        : null,
    });
  }
};


// ======================================
// GET ALL DEBIT NOTES
// ======================================

export const getDebitNotes = async (
  req,
  res
) => {
  try {
    const debitNotes =
      await DebitNote.find()
        .sort({
          createdAt: -1,
        });

    res.json(debitNotes);

  } catch (error) {
    console.error(
      "GET DEBIT NOTES ERROR:",
      error
    );

    res.status(500).json({
      message: error.message,
    });
  }
};


// ======================================
// GET SINGLE DEBIT NOTE
// ======================================

export const getSingleDebitNote =
  async (req, res) => {
    try {
      const debitNote =
        await DebitNote.findById(
          req.params.id
        );

      if (!debitNote) {
        return res.status(404).json({
          message:
            "Debit Note not found",
        });
      }

      res.json(debitNote);

    } catch (error) {
      console.error(
        "GET SINGLE DEBIT NOTE ERROR:",
        error
      );

      res.status(500).json({
        message: error.message,
      });
    }
  };


// ======================================
// UPDATE DEBIT NOTE
// ======================================

export const updateDebitNote =
  async (req, res) => {
    try {
      const debitNote =
        await DebitNote.findByIdAndUpdate(
          req.params.id,
          req.body,
          {
            new: true,
            runValidators: true,
          }
        );

      if (!debitNote) {
        return res.status(404).json({
          message:
            "Debit Note not found",
        });
      }

      res.json(debitNote);

    } catch (error) {
      console.error(
        "UPDATE DEBIT NOTE ERROR:",
        error
      );

      res.status(500).json({
        message: error.message,
      });
    }
  };


// ======================================
// DELETE DEBIT NOTE
// ======================================

export const deleteDebitNote =
  async (req, res) => {
    try {
      const debitNote =
        await DebitNote.findByIdAndDelete(
          req.params.id
        );

      if (!debitNote) {
        return res.status(404).json({
          message:
            "Debit Note not found",
        });
      }

      res.json({
        message:
          "Debit Note deleted",
      });

    } catch (error) {
      console.error(
        "DELETE DEBIT NOTE ERROR:",
        error
      );

      res.status(500).json({
        message: error.message,
      });
    }
  };