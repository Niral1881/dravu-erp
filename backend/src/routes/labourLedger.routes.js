import express from "express";

import {
  getLabourLedger,
} from "../controllers/labourLedger.controller.js";

const router = express.Router();

router.get(
  "/:labourId",
  getLabourLedger
);

export default router;