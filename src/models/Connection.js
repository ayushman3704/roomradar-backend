import mongoose from "mongoose";

/*
|--------------------------------------------------------------------------
| Connection Status Enum
|--------------------------------------------------------------------------
*/

export const CONNECTION_STATUS = {
  PENDING: "pending",
  ACCEPTED: "accepted",
  REJECTED: "rejected",
};

/*
|--------------------------------------------------------------------------
| Connection Schema
|--------------------------------------------------------------------------
*/

const connectionSchema = new mongoose.Schema(
  {
    /*
    |--------------------------------------------------------------------------
    | Participants
    |--------------------------------------------------------------------------
    */

    requester: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Requester is required"],
    },

    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Recipient is required"],
    },

    /*
    |--------------------------------------------------------------------------
    | Compatibility Snapshot
    |--------------------------------------------------------------------------
    |
    | Stored when request is created.
    | Historical score remains unchanged even if users
    | later update their profiles.
    |
    */

    compatibilityScore: {
      type: Number,
      required: [
        true,
        "Compatibility score is required",
      ],
      min: 0,
      max: 100,
    },

    /*
    |--------------------------------------------------------------------------
    | Request Status
    |--------------------------------------------------------------------------
    */

    status: {
      type: String,
      enum: Object.values(
        CONNECTION_STATUS
      ),
      default:
        CONNECTION_STATUS.PENDING,
    },

    /*
    |--------------------------------------------------------------------------
    | Optional Intro Message
    |--------------------------------------------------------------------------
    */

    message: {
      type: String,
      trim: true,
      maxlength: [
        300,
        "Message cannot exceed 300 characters",
      ],
    },

    /*
    |--------------------------------------------------------------------------
    | Request Metadata
    |--------------------------------------------------------------------------
    */

    respondedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

/*
|--------------------------------------------------------------------------
| Indexes
|--------------------------------------------------------------------------
*/

/*
|--------------------------------------------------------------------------
| Prevent Duplicate Requests
|--------------------------------------------------------------------------
|
| Same user cannot send the same request twice.
|
*/

connectionSchema.index(
  {
    requester: 1,
    recipient: 1,
  },
  {
    unique: true,
  }
);

/*
|--------------------------------------------------------------------------
| Incoming Requests
|--------------------------------------------------------------------------
|
| GET /connections/requests
|
*/

connectionSchema.index({
  recipient: 1,
  status: 1,
});

/*
|--------------------------------------------------------------------------
| Sent Requests
|--------------------------------------------------------------------------
*/

connectionSchema.index({
  requester: 1,
  status: 1,
});

/*
|--------------------------------------------------------------------------
| Accepted Connections
|--------------------------------------------------------------------------
*/

connectionSchema.index({
  status: 1,
  createdAt: -1,
});

/*
|--------------------------------------------------------------------------
| Export Model
|--------------------------------------------------------------------------
*/

const Connection = mongoose.model(
  "Connection",
  connectionSchema
);

export default Connection;