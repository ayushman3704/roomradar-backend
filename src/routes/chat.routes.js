import express from "express";

import protect
  from "../middleware/protect.js";

import {
  getChatRooms,
  getRoomMessages,
  sendMessage,
  markRoomMessagesAsRead,
} from "../controllers/chat.controller.js";

import validate
  from "../middleware/validate.js";

import {
  sendMessageSchema,
} from "../validators/chat.validator.js";

const router =
  express.Router();

/*
|--------------------------------------------------------------------------
| Chat Rooms
|--------------------------------------------------------------------------
*/

router.get(
  "/rooms",
  protect,
  getChatRooms
);

router.get(
  "/:roomId/messages",
  protect,
  getRoomMessages
);

router.post(
  "/:roomId/messages",
  protect,
  validate(sendMessageSchema),
  sendMessage
);

router.put(
  "/:roomId/read",
  protect,
  markRoomMessagesAsRead
);

export default router;