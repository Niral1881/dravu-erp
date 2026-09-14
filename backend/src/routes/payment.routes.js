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
router.put("/:id", updatePayment);
router.delete("/:id", deletePayment);

export default router;