import express from "express";

import {
  getLabourPayments,
  getLabourPaymentsByLabour,
  createLabourPayment,
  updateLabourPayment,
  deleteLabourPayment,
} from "../controllers/labourPayment.controller.js";

const router = express.Router();

router.get(
  "/",
  getLabourPayments
);

router.get(
  "/labour/:labourId",
  getLabourPaymentsByLabour
);

router.post(
  "/",
  createLabourPayment
);

router.put(
  "/:id",
  updateLabourPayment
);

router.delete(
  "/:id",
  deleteLabourPayment
);

export default router;