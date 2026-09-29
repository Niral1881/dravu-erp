import express from "express";

import {
  getLabourWorks,
  getLabourWorkById,
  createLabourWork,
  updateLabourWork,
  deleteLabourWork,
} from "../controllers/labourWork.controller.js";

const router = express.Router();

router.get("/", getLabourWorks);

router.get("/:id", getLabourWorkById);

router.post("/", createLabourWork);

router.put("/:id", updateLabourWork);

router.delete("/:id", deleteLabourWork);

export default router;