import express from "express";

import {
  getStockHistory,
} from "../controllers/stockHistory.controller.js";

const router =
  express.Router();

router.get(
  "/",
  getStockHistory
);

export default router;