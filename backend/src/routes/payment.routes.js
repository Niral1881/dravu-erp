import express from "express";

import {
  createPayment,
  getPayments,
  updatePayment,
  deletePayment,
} from "../controllers/payment.controller.js";

const router = express.Router();

router.post("/", createPayment);

router.get("/", getPayments);

// EDIT PAYMENT
router.put("/:id", updatePayment);

// DELETE PAYMENT
router.delete("/:id", deletePayment);

export default router;