import express from "express";

import {
  createDebitNote,
  getDebitNotes,
  getSingleDebitNote,
  updateDebitNote,
  deleteDebitNote,
} from "../controllers/debitNote.controller.js";

const router = express.Router();

router.get(
  "/",
  getDebitNotes
);

router.post(
  "/",
  createDebitNote
);

router.get(
  "/:id",
  getSingleDebitNote
);

router.put(
  "/:id",
  updateDebitNote
);

router.delete(
  "/:id",
  deleteDebitNote
);

export default router;