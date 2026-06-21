import mongoose from "mongoose";

const reviewSchema =
  new mongoose.Schema(
    {
      reviewer: {
        type:
          mongoose.Schema.Types.ObjectId,

        ref: "User",

        required: true,
      },

      reviewee: {
        type:
          mongoose.Schema.Types.ObjectId,

        ref: "User",

        required: true,
      },

      connection: {
        type:
          mongoose.Schema.Types.ObjectId,

        ref: "Connection",

        required: true,
      },

      ratings: {
        cleanliness: {
          type: Number,
          required: true,
          min: 1,
          max: 5,
        },

        financialReliability: {
          type: Number,
          required: true,
          min: 1,
          max: 5,
        },

        respectsBoundaries: {
          type: Number,
          required: true,
          min: 1,
          max: 5,
        },
      },

      comment: {
        type: String,
        trim: true,
        maxlength: 500,
      },
    },
    {
      timestamps: true,
    }
  );

reviewSchema.index({
  reviewee: 1,
});

reviewSchema.index(
  {
    reviewer: 1,
    reviewee: 1,
  },
  {
    unique: true,
  }
);

const Review =
  mongoose.model(
    "Review",
    reviewSchema
  );

export default Review;