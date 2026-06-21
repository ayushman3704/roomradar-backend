import ChatRoom from "../models/ChatRoom.js";

import asyncHandler
  from "../utils/asyncHandler.js";

import Message from "../models/Message.js";

import AppError from "../utils/AppError.js";

/*
|--------------------------------------------------------------------------
| Get My Chat Rooms
|--------------------------------------------------------------------------
| GET /api/chat/rooms
|--------------------------------------------------------------------------
*/

export const getChatRooms =
  asyncHandler(async (req, res) => {

    const currentUserId =
      req.user._id;

    const rooms =
      await ChatRoom.find({
        participants:
          currentUserId,

        isActive: true,
      })

      .populate(
        "participants",
        "name avatar city"
      )

      .sort({
        lastMessageAt: -1,
      });

    const formattedRooms =
      rooms.map((room) => {

        const otherUser =
          room.participants.find(
            (participant) =>
              participant._id.toString() !==
              currentUserId.toString()
          );

        return {
          roomId:
            room._id,

          user: {
            id:
              otherUser._id,

            name:
              otherUser.name,

            avatar:
              otherUser.avatar,

            city:
              otherUser.city,
          },

          lastMessage:
            room.lastMessage,

          lastMessageAt:
            room.lastMessageAt,
        };
      });

    res.status(200).json({
      success: true,

      count:
        formattedRooms.length,

      rooms:
        formattedRooms,
    });
  });


  /*
|--------------------------------------------------------------------------
| Get Room Messages
|--------------------------------------------------------------------------
| GET /api/chat/:roomId/messages
|--------------------------------------------------------------------------
*/

export const getRoomMessages =
  asyncHandler(async (req, res) => {

    const { roomId } =
      req.params;

    const currentUserId =
      req.user._id;

    /*
    |--------------------------------------------------------------------------
    | Verify Room Exists
    |--------------------------------------------------------------------------
    */

    const room =
      await ChatRoom.findById(
        roomId
      );

    if (!room) {
      throw new AppError(
        "Chat room not found",
        404
      );
    }

    /*
    |--------------------------------------------------------------------------
    | Verify User Is Participant
    |--------------------------------------------------------------------------
    */

    const isParticipant =
      room.participants.some(
        (participant) =>
          participant.toString() ===
          currentUserId.toString()
      );

    if (!isParticipant) {
      throw new AppError(
        "You are not authorized to access this chat room",
        403
      );
    }

    /*
    |--------------------------------------------------------------------------
    | Fetch Messages
    |--------------------------------------------------------------------------
    */

    const messages =
      await Message.find({
        room: roomId,
      })

      .populate(
        "sender",
        "name avatar"
      )

      .sort({
        createdAt: 1,
      });

    const formattedMessages =
      messages.map(
        (message) => ({
          id:
            message._id,

          text:
            message.text,

          isRead:
            message.isRead,

          createdAt:
            message.createdAt,

          sender: {
            id:
              message.sender._id,

            name:
              message.sender.name,

            avatar:
              message.sender.avatar,
          },
        })
      );

    res.status(200).json({
      success: true,

      count:
        formattedMessages.length,

      messages:
        formattedMessages,
    });
  });


  /*
|--------------------------------------------------------------------------
| Send Message
|--------------------------------------------------------------------------
| POST /api/chat/:roomId/messages
|--------------------------------------------------------------------------
*/

export const sendMessage =
  asyncHandler(async (req, res) => {

    const { roomId } =
      req.params;

    const { text } =
      req.body;

    const currentUserId =
      req.user._id;

    /*
    |--------------------------------------------------------------------------
    | Verify Room Exists
    |--------------------------------------------------------------------------
    */

    const room =
      await ChatRoom.findById(
        roomId
      );

    if (!room) {
      throw new AppError(
        "Chat room not found",
        404
      );
    }

    /*
    |--------------------------------------------------------------------------
    | Verify Participant
    |--------------------------------------------------------------------------
    */

    const isParticipant =
      room.participants.some(
        (participant) =>
          participant.toString() ===
          currentUserId.toString()
      );

    if (!isParticipant) {
      throw new AppError(
        "You are not authorized to send messages in this room",
        403
      );
    }

    /*
    |--------------------------------------------------------------------------
    | Create Message
    |--------------------------------------------------------------------------
    */

    const message =
      await Message.create({
        room: roomId,

        sender:
          currentUserId,

        text,
      });

    /*
    |--------------------------------------------------------------------------
    | Update ChatRoom Metadata
    |--------------------------------------------------------------------------
    */

    room.lastMessage = text;

    room.lastMessageSender =
      currentUserId;

    room.lastMessageAt =
      new Date();

    await room.save();

    /*
    |--------------------------------------------------------------------------
    | Populate Sender
    |--------------------------------------------------------------------------
    */

    await message.populate(
      "sender",
      "name avatar"
    );

    res.status(201).json({
      success: true,

      message: {
        id:
          message._id,

        text:
          message.text,

        isRead:
          message.isRead,

        createdAt:
          message.createdAt,

        sender: {
          id:
            message.sender._id,

          name:
            message.sender.name,

          avatar:
            message.sender.avatar,
        },
      },
    });
  });

  /*
|--------------------------------------------------------------------------
| Mark Messages As Read
|--------------------------------------------------------------------------
| PUT /api/chat/:roomId/read
|--------------------------------------------------------------------------
*/

export const markRoomMessagesAsRead =
  asyncHandler(async (req, res) => {

    const { roomId } =
      req.params;

    const currentUserId =
      req.user._id;

    /*
    |--------------------------------------------------------------------------
    | Verify Room Exists
    |--------------------------------------------------------------------------
    */

    const room =
      await ChatRoom.findById(
        roomId
      );

    if (!room) {
      throw new AppError(
        "Chat room not found",
        404
      );
    }

    /*
    |--------------------------------------------------------------------------
    | Verify User Is Participant
    |--------------------------------------------------------------------------
    */

    const isParticipant =
      room.participants.some(
        participant =>
          participant.toString() ===
          currentUserId.toString()
      );

    if (!isParticipant) {
      throw new AppError(
        "You are not authorized to access this room",
        403
      );
    }

    /*
    |--------------------------------------------------------------------------
    | Mark Messages Read
    |--------------------------------------------------------------------------
    */

    const result =
      await Message.updateMany(
        {
          room: roomId,

          sender: {
            $ne:
              currentUserId,
          },

          isRead: false,
        },
        {
          isRead: true,

          readAt:
            new Date(),
        }
      );

    res.status(200).json({
      success: true,

      message:
        "Messages marked as read",

      updatedCount:
        result.modifiedCount,
    });
  });