// src/controllers/auth.controller.js

import User from "../models/User.js";

import AppError from "../utils/AppError.js";
import asyncHandler from "../utils/asyncHandler.js";
import sendToken from "../utils/sendToken.js";

/*
|--------------------------------------------------------------------------
| Register User
|--------------------------------------------------------------------------
*/

export const registerUser = asyncHandler(
  async (req, res) => {
    const { name, email, password } =
      req.body;

    // if (!name || !email || !password) {
    //   throw new AppError(
    //     "Please provide all required fields",
    //     400
    //   );
    // }

    const existingUser =
      await User.findOne({ email });

    if (existingUser) {
      throw new AppError(
        "User already exists",
        409
      );
    }

    const user = await User.create({
      name,
      email,
      password,
    });

    sendToken(user, 201, res);
  }
);

/*
|--------------------------------------------------------------------------
| Login User
|--------------------------------------------------------------------------
*/

export const loginUser = asyncHandler(
  async (req, res) => {
    const { email, password } = req.body;

    // if (!email || !password) {
    //   throw new AppError(
    //     "Email and password are required",
    //     400
    //   );
    // }

    const user = await User.findOne({
      email,
    }).select("+password");

    if (!user) {
      throw new AppError(
        "Invalid credentials",
        401
      );
    }

    const isPasswordMatched =
      await user.matchPassword(password);

    if (!isPasswordMatched) {
      throw new AppError(
        "Invalid credentials",
        401
      );
    }

    sendToken(user, 200, res);
  }
);

/*
|--------------------------------------------------------------------------
| Logout User
|--------------------------------------------------------------------------
*/

export const logoutUser = asyncHandler(
  async (req, res) => {
    res
      .cookie("token", "", {
        httpOnly: true,

        expires: new Date(0),

        secure:
          process.env.NODE_ENV ===
          "production",

        sameSite: "strict",
      })
      .status(200)
      .json({
        success: true,
        message: "Logged out successfully",
      });
  }
);

/*
|--------------------------------------------------------------------------
| Get Current User
|--------------------------------------------------------------------------
*/

export const getCurrentUser =
  asyncHandler(async (req, res) => {
    res.status(200).json({
      success: true,
      user: req.user,
    });
  });