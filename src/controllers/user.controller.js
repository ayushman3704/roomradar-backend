import User from "../models/User.js";

import AppError from "../utils/AppError.js";
import asyncHandler from "../utils/asyncHandler.js";

/*
|--------------------------------------------------------------------------
| Get Current User Profile
|--------------------------------------------------------------------------
| GET /api/users/profile
|--------------------------------------------------------------------------
*/

export const getMyProfile = asyncHandler(
  async (req, res) => {
    res.status(200).json({
      success: true,
      user: req.user,
    });
  }
);

/*
|--------------------------------------------------------------------------
| Update User Profile
|--------------------------------------------------------------------------
| PUT /api/users/profile
|--------------------------------------------------------------------------
*/

export const updateProfile = asyncHandler(
  async (req, res) => {
    const {
      city,
      state,
      gender,
      budgetMin,
      budgetMax,
      lifestylePreferences,
    } = req.body;

    const user = await User.findById(
      req.user._id
    );

    if (!user) {
      throw new AppError(
        "User not found",
        404
      );
    }

    user.city = city;
    user.state = state;

    user.gender = gender;

    user.budgetMin = budgetMin;
    user.budgetMax = budgetMax;

    user.lifestylePreferences =
      lifestylePreferences;

    user.profileCompleted = true;

    await user.save();

    res.status(200).json({
      success: true,

      message:
        "Profile updated successfully",

      profileCompleted:
        user.profileCompleted,

      user,
    });
  }
);

/*
|--------------------------------------------------------------------------
| Get Public User Profile
|--------------------------------------------------------------------------
| GET /api/users/:userId
|--------------------------------------------------------------------------
*/

export const getPublicProfile =
  asyncHandler(async (req, res) => {

    const user =
      await User.findById(
        req.params.userId
      ).select([
  "name",
  "avatar",
  "city",
  "state",
  "gender",
  "trustScore",
  "lifestylePreferences",
].join(" "));

    if (!user) {
      throw new AppError(
        "User not found",
        404
      );
    }

    res.status(200).json({
      success: true,
      user,
    });
  });