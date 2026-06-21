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

 /*
|--------------------------------------------------------------------------
| Get User Reputation
|--------------------------------------------------------------------------
| GET /api/users/:userId/reputation
|--------------------------------------------------------------------------
*/

export const getUserReputation =
  asyncHandler(async (req, res) => {

    const { userId } =
      req.params;

    const user =
      await User.findById(
        userId
      ).select(
        "trustScore reviewStats"
      );

    if (!user) {
      throw new AppError(
        "User not found",
        404
      );
    }

    res.status(200).json({
      success: true,

      reputation: {
        trustScore:
          user.trustScore,

        totalReviews:
          user.reviewStats
            .totalReviews,

        averageRatings: {
          cleanliness:
            user.reviewStats
              .averageCleanliness,

          financialReliability:
            user.reviewStats
              .averageFinancialReliability,

          respectsBoundaries:
            user.reviewStats
              .averageRespectsBoundaries,
        },
      },
    });
  });
  //   /*
  //   |--------------------------------------------------------------------------
  //   | Aggregate Ratings
  //   |--------------------------------------------------------------------------
  //   */

  //   let cleanliness = 0;

  //   let financialReliability = 0;

  //   let respectsBoundaries = 0;

  //   for (const review of reviews) {

  //     cleanliness +=
  //       review.ratings.cleanliness;

  //     financialReliability +=
  //       review.ratings.financialReliability;

  //     respectsBoundaries +=
  //       review.ratings.respectsBoundaries;
  //   }

  //   const totalReviews =
  //     reviews.length;

  //   const avgCleanliness =
  //     cleanliness /
  //     totalReviews;

  //   const avgFinancialReliability =
  //     financialReliability /
  //     totalReviews;

  //   const avgRespectsBoundaries =
  //     respectsBoundaries /
  //     totalReviews;

  //   /*
  //   |--------------------------------------------------------------------------
  //   | Trust Score
  //   |--------------------------------------------------------------------------
  //   */

  //   const overallAverage =
  //     (
  //       avgCleanliness +
  //       avgFinancialReliability +
  //       avgRespectsBoundaries
  //     ) / 3;

  //   const trustScore =
  //     Math.round(
  //       (overallAverage / 5) *
  //         100
  //     );

  //   res.status(200).json({
  //     success: true,

  //     reputation: {
  //       trustScore,

  //       totalReviews,

  //       averageRatings: {
  //         cleanliness:
  //           Number(
  //             avgCleanliness.toFixed(1)
  //           ),

  //         financialReliability:
  //           Number(
  //             avgFinancialReliability.toFixed(
  //               1
  //             )
  //           ),

  //         respectsBoundaries:
  //           Number(
  //             avgRespectsBoundaries.toFixed(
  //               1
  //             )
  //           ),
  //       },
  //     },
  //   });
  // });