import express from "express";

import protect
  from "../middleware/protect.js";

import {
  getMatches,
} from "../controllers/match.controller.js";

const router =
  express.Router();

router.get(
  "/",
  protect,
  getMatches
);

export default router;