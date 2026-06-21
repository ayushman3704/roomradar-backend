import express from "express";

import protect from "../middleware/protect.js";
import validate from "../middleware/validate.js";

import {
  createReview,
} from "../controllers/review.controller.js";

import {
  createReviewSchema,
} from "../validators/review.validator.js";

const router = express.Router();

/*
|--------------------------------------------------------------------------
| Reviews
|--------------------------------------------------------------------------
| POST /api/reviews
|--------------------------------------------------------------------------
*/

router.post(
  "/",
  protect,
  validate(createReviewSchema),
  createReview
);

export default router;