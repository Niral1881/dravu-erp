import express from "express";

import {
  createReturn,
  getReturns,
  getReturnById,
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


router.get(
  "/:id",
  getReturnById
);


export default router;