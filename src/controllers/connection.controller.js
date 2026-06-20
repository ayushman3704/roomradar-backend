import User from "../models/User.js";
import Connection from "../models/Connection.js";

import AppError from "../utils/AppError.js";
import asyncHandler from "../utils/asyncHandler.js";

import {
  calculateCompatibility,
} from "../services/compatibility.service.js";

/*
|--------------------------------------------------------------------------
| Send Connection Request
|--------------------------------------------------------------------------
| POST /api/connections/request
|--------------------------------------------------------------------------
*/

export const sendConnectionRequest =
  asyncHandler(async (req, res) => {
    const {
      recipientId,
      message,
    } = req.body;

    const requesterId =
      req.user._id;

    /*
    |--------------------------------------------------------------------------
    | Cannot connect with yourself
    |--------------------------------------------------------------------------
    */

    if (
      requesterId.toString() ===
      recipientId
    ) {
      throw new AppError(
        "You cannot send a connection request to yourself",
        400
      );
    }

    /*
    |--------------------------------------------------------------------------
    | Fetch Users
    |--------------------------------------------------------------------------
    */

    const [requester, recipient] =
      await Promise.all([
        User.findById(requesterId),
        User.findById(recipientId),
      ]);

    if (!recipient) {
      throw new AppError(
        "Recipient not found",
        404
      );
    }

    /*
    |--------------------------------------------------------------------------
    | Profile Completion Check
    |--------------------------------------------------------------------------
    */

    if (
      !requester.profileCompleted
    ) {
      throw new AppError(
        "Please complete your profile before sending connection requests",
        400
      );
    }

    if (
      !recipient.profileCompleted
    ) {
      throw new AppError(
        "Recipient profile is incomplete",
        400
      );
    }

    /*
    |--------------------------------------------------------------------------
    | Duplicate Request Check
    |--------------------------------------------------------------------------
    */

    const existingConnection =
    await Connection.findOne({
    $or: [
      {
        requester: requesterId,
        recipient: recipientId,
      },
      {
        requester: recipientId,
        recipient: requesterId,
      },
    ],
  });
    if (existingConnection) {
      throw new AppError(
        "Connection request already exists",
        409
      );
    }

    /*
    |--------------------------------------------------------------------------
    | Calculate Compatibility Snapshot
    |--------------------------------------------------------------------------
    */

    const compatibility =
      calculateCompatibility(
        requester,
        recipient
      );

    /*
    |--------------------------------------------------------------------------
    | Create Connection
    |--------------------------------------------------------------------------
    */

    const connection =
      await Connection.create({
        requester: requesterId,

        recipient: recipientId,

        compatibilityScore:
          compatibility.score,

        message,
      });

    res.status(201).json({
      success: true,

      message:
        "Connection request sent successfully",

      connection: {
        id: connection._id,

        status:
          connection.status,

        compatibilityScore:
          connection.compatibilityScore,

        createdAt:
          connection.createdAt,
      },
    });
  });



  /*
|--------------------------------------------------------------------------
| Get Incoming Connection Requests
|--------------------------------------------------------------------------
| GET /api/connections/requests
|--------------------------------------------------------------------------
*/

export const getIncomingRequests =
  asyncHandler(async (req, res) => {

    const requests =
      await Connection.find({
        recipient: req.user._id,

        status: "pending",
      })

      .populate(
        "requester",
        "name avatar city trustScore"
      )

      .sort({
        createdAt: -1,
      });

    const formattedRequests =
      requests.map((request) => ({
        connectionId:
          request._id,

        compatibilityScore:
          request.compatibilityScore,

        status:
          request.status,

        message:
          request.message,

        createdAt:
          request.createdAt,

        requester: {
          id:
            request.requester._id,

          name:
            request.requester.name,

          avatar:
            request.requester.avatar,

          city:
            request.requester.city,

          trustScore:
            request.requester.trustScore,
        },
      }));

    res.status(200).json({
      success: true,

      count:
        formattedRequests.length,

      requests:
        formattedRequests,
    });
  });


  /*
|--------------------------------------------------------------------------
| Accept Connection Request
|--------------------------------------------------------------------------
| PUT /api/connections/:connectionId/accept
|--------------------------------------------------------------------------
*/

export const acceptConnectionRequest =
  asyncHandler(async (req, res) => {

    const {
      connectionId,
    } = req.params;

    const connection =
      await Connection.findById(
        connectionId
      );

    if (!connection) {
      throw new AppError(
        "Connection request not found",
        404
      );
    }

    /*
    |--------------------------------------------------------------------------
    | Only recipient can accept
    |--------------------------------------------------------------------------
    */

    if (
      connection.recipient.toString() !==
      req.user._id.toString()
    ) {
      throw new AppError(
        "You are not authorized to accept this request",
        403
      );
    }

    /*
    |--------------------------------------------------------------------------
    | Must be pending
    |--------------------------------------------------------------------------
    */

    if (
      connection.status !==
      "pending"
    ) {
      throw new AppError(
        `Request already ${connection.status}`,
        400
      );
    }

    connection.status =
      "accepted";

    connection.respondedAt =
      new Date();

    await connection.save();

    res.status(200).json({
      success: true,

      message:
        "Connection request accepted successfully",

      connection: {
        id:
          connection._id,

        status:
          connection.status,

        compatibilityScore:
          connection.compatibilityScore,

        respondedAt:
          connection.respondedAt,
      },
    });
  });


  /*
|--------------------------------------------------------------------------
| Get Accepted Connections
|--------------------------------------------------------------------------
| GET /api/connections
|--------------------------------------------------------------------------
*/

export const getConnections =
  asyncHandler(async (req, res) => {

    const currentUserId =
      req.user._id;

    const connections =
      await Connection.find({
        status: "accepted",

        $or: [
          {
            requester:
              currentUserId,
          },

          {
            recipient:
              currentUserId,
          },
        ],
      })

      .populate(
        "requester",
        "name avatar city trustScore"
      )

      .populate(
        "recipient",
        "name avatar city trustScore"
      )

      .sort({
        updatedAt: -1,
      });

    const formattedConnections =
      connections.map(
        (connection) => {

          const otherUser =
            connection.requester._id.toString() ===
            currentUserId.toString()
              ? connection.recipient
              : connection.requester;

          return {
            connectionId:
              connection._id,

            compatibilityScore:
              connection.compatibilityScore,

            connectedAt:
              connection.respondedAt,

            user: {
              id:
                otherUser._id,

              name:
                otherUser.name,

              avatar:
                otherUser.avatar,

              city:
                otherUser.city,

              trustScore:
                otherUser.trustScore,
            },
          };
        }
      );

    res.status(200).json({
      success: true,

      count:
        formattedConnections.length,

      connections:
        formattedConnections,
    });
  });


  /*
|--------------------------------------------------------------------------
| Reject Connection Request
|--------------------------------------------------------------------------
| PUT /api/connections/:connectionId/reject
|--------------------------------------------------------------------------
*/

export const rejectConnectionRequest =
  asyncHandler(async (req, res) => {

    const { connectionId } =
      req.params;

    const connection =
      await Connection.findById(
        connectionId
      );

    if (!connection) {
      throw new AppError(
        "Connection request not found",
        404
      );
    }

    /*
    |--------------------------------------------------------------------------
    | Only recipient can reject
    |--------------------------------------------------------------------------
    */

    if (
      connection.recipient.toString() !==
      req.user._id.toString()
    ) {
      throw new AppError(
        "You are not authorized to reject this request",
        403
      );
    }

    /*
    |--------------------------------------------------------------------------
    | Must be pending
    |--------------------------------------------------------------------------
    */

    if (
      connection.status !==
      "pending"
    ) {
      throw new AppError(
        `Request already ${connection.status}`,
        400
      );
    }

    connection.status =
      "rejected";

    connection.respondedAt =
      new Date();

    await connection.save();

    res.status(200).json({
      success: true,

      message:
        "Connection request rejected successfully",

      connection: {
        id:
          connection._id,

        status:
          connection.status,

        respondedAt:
          connection.respondedAt,
      },
    });
  });


  /*
|--------------------------------------------------------------------------
| Get Sent Connection Requests
|--------------------------------------------------------------------------
| GET /api/connections/sent
|--------------------------------------------------------------------------
*/

export const getSentRequests =
  asyncHandler(async (req, res) => {

    const requests =
      await Connection.find({
        requester: req.user._id,
      })

      .populate(
        "recipient",
        "name avatar city trustScore"
      )

      .sort({
        createdAt: -1,
      });

    const formattedRequests =
      requests.map((request) => ({
        connectionId:
          request._id,

        compatibilityScore:
          request.compatibilityScore,

        status:
          request.status,

        message:
          request.message,

        createdAt:
          request.createdAt,

        respondedAt:
          request.respondedAt,

        recipient: {
          id:
            request.recipient._id,

          name:
            request.recipient.name,

          avatar:
            request.recipient.avatar,

          city:
            request.recipient.city,

          trustScore:
            request.recipient.trustScore,
        },
      }));

    res.status(200).json({
      success: true,

      count:
        formattedRequests.length,

      requests:
        formattedRequests,
    });
  });