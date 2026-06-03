import express from "express";

import {
  createReturn,
  getReturns,
} from "../controllers/return.controller.js";

const router =
  express.Router();

router.post(
  "/",
  createReturn
);

router.get(
  "/",
  getReturns
);

export default router;