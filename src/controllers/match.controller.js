import User from "../models/User.js";

import asyncHandler
  from "../utils/asyncHandler.js";

import {
  calculateCompatibility,
} from "../services/compatibility.service.js";

import {
  MATCH_RANKING_CONFIG,
} from "../constants/compatibility.constants.js";

const {
  LIFESTYLE_WEIGHT,
  TRUST_SCORE_WEIGHT,
} = MATCH_RANKING_CONFIG;

const hasBudgetOverlap = (
  currentUser,
  candidate
) => {
  return (
    candidate.budgetMin <=
      currentUser.budgetMax &&
    candidate.budgetMax >=
      currentUser.budgetMin
  );
};

export const getMatches =
  asyncHandler(async (req, res) => {

    const page =
      Number(req.query.page) || 1;

    const limit =
      Number(req.query.limit) || 20;

    const currentUser =
      await User.findById(
        req.user._id
      );

    const candidates =
      await User.find({
        _id: {
          $ne: currentUser._id,
        },

        city: currentUser.city,

        profileCompleted: true,

        isActive: true,
      });

    const matches = candidates
  .filter((candidate) =>
    hasBudgetOverlap(
      currentUser,
      candidate
    )
  )
  .map((candidate) => {

    const compatibility =
  calculateCompatibility(
    currentUser,
    candidate
  );

/*
|--------------------------------------------------------------------------
| Final Ranking Score
|--------------------------------------------------------------------------
|
| Lifestyle: 80%
| Trust Score: 20%
|
*/

const finalScore =
  Math.round(
    compatibility.score *
      LIFESTYLE_WEIGHT +
    candidate.trustScore *
      TRUST_SCORE_WEIGHT
  );

return {
  userId: candidate._id,

  name: candidate.name,

  avatar: candidate.avatar,

  city: candidate.city,

  trustScore:
    candidate.trustScore,

  compatibilityScore:
    finalScore,

  lifestyleScore:
    compatibility.score,

  strengths:
    compatibility.strengths,

  conflicts:
    compatibility.conflicts,
  };
  });

    matches.sort(
      (a, b) =>
        b.compatibilityScore -
        a.compatibilityScore
    );

    const start =
      (page - 1) * limit;

    const end =
      start + limit;

    const paginated =
      matches.slice(
        start,
        end
      );

    res.status(200).json({
      success: true,

      count:
        paginated.length,

      page,

      limit,

      matches:
        paginated,
    });
  });