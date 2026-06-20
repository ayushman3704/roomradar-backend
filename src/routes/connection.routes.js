import express from "express";

import protect from "../middleware/protect.js";
import validate from "../middleware/validate.js";

import {
  sendConnectionRequest,
  getIncomingRequests,
  acceptConnectionRequest,
  getConnections,
  rejectConnectionRequest,
  getSentRequests,
} from "../controllers/connection.controller.js";

import {
  sendConnectionRequestSchema,
} from "../validators/connection.validator.js";

const router = express.Router();


/*
|--------------------------------------------------------------------------
| Get Incoming Connection Requests
|--------------------------------------------------------------------------
*/
router.get(
  "/requests",
  protect,
  getIncomingRequests
);

/*
|--------------------------------------------------------------------------
| Get Sent Connection Requests
|--------------------------------------------------------------------------
*/
router.get(
  "/sent",
  protect,
  getSentRequests
);

/*
|--------------------------------------------------------------------------
| Get Accept Connections
|--------------------------------------------------------------------------
*/
router.get(
  "/",
  protect,
  getConnections
);

/*
|--------------------------------------------------------------------------
| Accept Connection Request
|--------------------------------------------------------------------------
*/
router.put(
  "/:connectionId/accept",
  protect,
  acceptConnectionRequest
);

/*
|--------------------------------------------------------------------------
| Reject Connection Request
|--------------------------------------------------------------------------
*/
router.put(
  "/:connectionId/reject",
  protect,
  rejectConnectionRequest
);

/*
|--------------------------------------------------------------------------
| Send Connection Request
|--------------------------------------------------------------------------
*/

router.post(
  "/request",
  protect,
  validate(sendConnectionRequestSchema),
  sendConnectionRequest
);




export default router;