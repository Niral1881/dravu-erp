import express from "express";

import {
  createReturn,
  getReturns,
  getReturnById,
  deleteReturn,
} from "../controllers/return.controller.js";


const router =
  express.Router();


// CREATE RETURN
router.post(
  "/",
  createReturn
);


// GET ALL RETURNS
router.get(
  "/",
  getReturns
);


// GET SINGLE RETURN
router.get(
  "/:id",
  getReturnById
);


// DELETE RETURN
router.delete(
  "/:id",
  deleteReturn
);


export default router;