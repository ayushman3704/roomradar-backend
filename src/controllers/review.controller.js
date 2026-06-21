import User from "../models/User.js";
import Review from "../models/Review.js";
import Connection from "../models/Connection.js";

import {
  recalculateUserReputation,
} from "../services/reputation.service.js";

import AppError from "../utils/AppError.js";
import asyncHandler from "../utils/asyncHandler.js";

/*
|--------------------------------------------------------------------------
| Create Review
|--------------------------------------------------------------------------
| POST /api/reviews
|--------------------------------------------------------------------------
*/

export const createReview =
  asyncHandler(async (req, res) => {

    const {
      revieweeId,
      connectionId,
      ratings,
      comment,
    } = req.body;

    const reviewerId =
      req.user._id;

    /*
    |--------------------------------------------------------------------------
    | Cannot Review Yourself
    |--------------------------------------------------------------------------
    */

    if (
      reviewerId.toString() ===
      revieweeId
    ) {
      throw new AppError(
        "You cannot review yourself",
        400
      );
    }

    /*
    |--------------------------------------------------------------------------
    | Reviewee Must Exist
    |--------------------------------------------------------------------------
    */

    const reviewee =
      await User.findById(
        revieweeId
      );

    if (!reviewee) {
      throw new AppError(
        "Reviewee not found",
        404
      );
    }

    /*
    |--------------------------------------------------------------------------
    | Connection Must Exist
    |--------------------------------------------------------------------------
    */

    const connection =
      await Connection.findById(
        connectionId
      );

    if (!connection) {
      throw new AppError(
        "Connection not found",
        404
      );
    }

    /*
    |--------------------------------------------------------------------------
    | Connection Must Be Accepted
    |--------------------------------------------------------------------------
    */

    if (
      connection.status !==
      "accepted"
    ) {
      throw new AppError(
        "Reviews can only be submitted for accepted connections",
        400
      );
    }

    /*
    |--------------------------------------------------------------------------
    | Reviewer Must Belong To Connection
    |--------------------------------------------------------------------------
    */

    const reviewerBelongs =
      [
        connection.requester.toString(),
        connection.recipient.toString(),
      ].includes(
        reviewerId.toString()
      );

    if (!reviewerBelongs) {
      throw new AppError(
        "You are not part of this connection",
        403
      );
    }

    /*
    |--------------------------------------------------------------------------
    | Reviewee Must Belong To Connection
    |--------------------------------------------------------------------------
    */

    const revieweeBelongs =
      [
        connection.requester.toString(),
        connection.recipient.toString(),
      ].includes(
        revieweeId
      );

    if (!revieweeBelongs) {
      throw new AppError(
        "Reviewee does not belong to this connection",
        400
      );
    }

    /*
    |--------------------------------------------------------------------------
    | Prevent Duplicate Review
    |--------------------------------------------------------------------------
    */

    const existingReview =
      await Review.findOne({
        reviewer:
          reviewerId,

        reviewee:
          revieweeId,
      });

    if (existingReview) {
      throw new AppError(
        "You have already reviewed this user",
        409
      );
    }

    /*
    |--------------------------------------------------------------------------
    | Create Review
    |--------------------------------------------------------------------------
    */

    const review =
      await Review.create({
        reviewer:
          reviewerId,

        reviewee:
          revieweeId,

        connection:
          connectionId,

        ratings,

        comment,
      });

await recalculateUserReputation(
  revieweeId
);

    res.status(201).json({
      success: true,

      message:
        "Review submitted successfully",

      review: {
        id:
          review._id,

        reviewee:
          review.reviewee,

        ratings:
          review.ratings,

        createdAt:
          review.createdAt,
      },
    });
  });