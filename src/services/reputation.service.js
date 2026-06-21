import Review from "../models/Review.js";
import User from "../models/User.js";

/*
|--------------------------------------------------------------------------
| Recalculate User Reputation
|--------------------------------------------------------------------------
|
| Recomputes:
| - trustScore
| - reviewStats
|
| Called whenever reviews change.
|
*/

export const recalculateUserReputation =
  async (userId) => {

    const reviews =
      await Review.find({
        reviewee: userId,
      });

    /*
    |--------------------------------------------------------------------------
    | No Reviews Yet
    |--------------------------------------------------------------------------
    */

    if (
      reviews.length === 0
    ) {
      await User.findByIdAndUpdate(
        userId,
        {
          trustScore: 100,

          reviewStats: {
            totalReviews: 0,

            averageCleanliness: 0,

            averageFinancialReliability: 0,

            averageRespectsBoundaries: 0,
          },
        }
      );

      return;
    }

    /*
    |--------------------------------------------------------------------------
    | Aggregate Ratings
    |--------------------------------------------------------------------------
    */

    let cleanliness = 0;

    let financialReliability = 0;

    let respectsBoundaries = 0;

    for (const review of reviews) {

      cleanliness +=
        review.ratings.cleanliness;

      financialReliability +=
        review.ratings.financialReliability;

      respectsBoundaries +=
        review.ratings.respectsBoundaries;
    }

    const totalReviews =
      reviews.length;

    const averageCleanliness =
      cleanliness /
      totalReviews;

    const averageFinancialReliability =
      financialReliability /
      totalReviews;

    const averageRespectsBoundaries =
      respectsBoundaries /
      totalReviews;

    /*
    |--------------------------------------------------------------------------
    | Calculate Trust Score
    |--------------------------------------------------------------------------
    |
    | Average of all category averages.
    | Convert 0-5 scale to 0-100 scale.
    |
    */

    const overallAverage =
      (
        averageCleanliness +
        averageFinancialReliability +
        averageRespectsBoundaries
      ) / 3;

    const trustScore =
      Math.round(
        (overallAverage / 5) *
          100
      );

    /*
    |--------------------------------------------------------------------------
    | Update User
    |--------------------------------------------------------------------------
    */

    await User.findByIdAndUpdate(
      userId,
      {
        trustScore,

        reviewStats: {
          totalReviews,

          averageCleanliness:
            Number(
              averageCleanliness.toFixed(
                1
              )
            ),

          averageFinancialReliability:
            Number(
              averageFinancialReliability.toFixed(
                1
              )
            ),

          averageRespectsBoundaries:
            Number(
              averageRespectsBoundaries.toFixed(
                1
              )
            ),
        },
      },
      {
        new: true,
      }
    );
  };