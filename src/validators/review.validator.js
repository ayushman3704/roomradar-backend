import { z } from "zod";

/*
|--------------------------------------------------------------------------
| Common Rating Schema
|--------------------------------------------------------------------------
*/

const ratingSchema = z
  .number({
    required_error: "Rating is required",
  })
  .int("Rating must be an integer")
  .min(1, "Rating must be at least 1")
  .max(5, "Rating cannot exceed 5");

/*
|--------------------------------------------------------------------------
| Create Review
|--------------------------------------------------------------------------
|
| POST /api/reviews
|
*/

export const createReviewSchema =
  z.object({
    revieweeId: z
      .string()
      .regex(
        /^[0-9a-fA-F]{24}$/,
        "Invalid reviewee ID"
      ),

    connectionId: z
      .string()
      .regex(
        /^[0-9a-fA-F]{24}$/,
        "Invalid connection ID"
      ),

    ratings: z.object({
      cleanliness:
        ratingSchema,

      financialReliability:
        ratingSchema,

      respectsBoundaries:
        ratingSchema,
    }),

    comment: z
      .string()
      .trim()
      .max(
        500,
        "Comment cannot exceed 500 characters"
      )
      .optional(),
  });