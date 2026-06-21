import express from "express";

import {
  getMyProfile,
  updateProfile,
  getPublicProfile,
} from "../controllers/user.controller.js";

import protect from "../middleware/protect.js";
import validate from "../middleware/validate.js";

import {
  updateProfileSchema,
} from "../validators/user.validator.js";

import {
  getUserReputation,
} from "../controllers/user.controller.js";

const router = express.Router();

/*
|--------------------------------------------------------------------------
| Current User Profile
|--------------------------------------------------------------------------
*/

router.get(
  "/profile",
  protect,
  getMyProfile
);

router.put(
  "/profile",
  protect,
  validate(updateProfileSchema),
  updateProfile
);



router.get(
  "/:userId/reputation",
  getUserReputation
);

/*
|--------------------------------------------------------------------------
| Public User Profile
|--------------------------------------------------------------------------
*/

router.get(
  "/:userId",
  protect,
  getPublicProfile
);

export default router;