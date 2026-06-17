// src/routes/auth.routes.js

import express from "express";

import validate from "../middleware/validate.js";

import {
  registerSchema,
  loginSchema
}
from "../validators/auth.validator.js";

import {
  registerUser,
  loginUser,
  logoutUser,
  getCurrentUser,
} from "../controllers/auth.controller.js";

import protect from "../middleware/protect.js";

const router = express.Router();

// router.post("/register", registerUser);

router.post(
  "/register",

  validate(registerSchema),

  registerUser
);

// router.post("/login", loginUser);

router.post(
  "/login",

  validate(loginSchema),

  loginUser
);

router.post("/logout", logoutUser);

router.get("/me", protect, getCurrentUser);

export default router;