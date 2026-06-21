import mongoose from "mongoose";

const chatRoomSchema = new mongoose.Schema(
  {
    /*
    |--------------------------------------------------------------------------
    | Connection Reference
    |--------------------------------------------------------------------------
    |
    | One accepted connection
    | = One chat room
    |
    */

    connection: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Connection",
      required: true,
      unique: true,
    },

    /*
    |--------------------------------------------------------------------------
    | Participants
    |--------------------------------------------------------------------------
    */

    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    ],

    /*
    |--------------------------------------------------------------------------
    | Room Status
    |--------------------------------------------------------------------------
    */

    isActive: {
      type: Boolean,
      default: true,
    },

    /*
    |--------------------------------------------------------------------------
    | Last Message Preview
    |--------------------------------------------------------------------------
    |
    | Used for:
    | Chat List
    | Sidebar
    | Sorting
    |
    */

    lastMessage: {
      type: String,
      default: "",
      trim: true,
    },

    /*
    |--------------------------------------------------------------------------
    | Last Message Sender
    |--------------------------------------------------------------------------
    */

    lastMessageSender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    /*
    |--------------------------------------------------------------------------
    | Last Message Time
    |--------------------------------------------------------------------------
    */

    lastMessageAt: {
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

chatRoomSchema.index({
  participants: 1,
});

chatRoomSchema.index({
  lastMessageAt: -1,
});

/*
|--------------------------------------------------------------------------
| Ensure Exactly 2 Participants
|--------------------------------------------------------------------------
*/

chatRoomSchema.pre(
  "save",
  function () {

    if (
      this.participants.length !== 2
    ) {
      throw new Error(
        "Chat room must have exactly 2 participants"
      );
    }
  }
);

const ChatRoom = mongoose.model(
  "ChatRoom",
  chatRoomSchema
);

export default ChatRoom;