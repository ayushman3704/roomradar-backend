import { z } from "zod";

/*
|--------------------------------------------------------------------------
| Send Connection Request
|--------------------------------------------------------------------------
|
| Example:
|
| {
|   "recipientId": "686c123abc456def78901234",
|   "message": "Hey! I think we'd be compatible roommates."
| }
|
*/

export const sendConnectionRequestSchema =
  z.object({
    recipientId: z
      .string()
      .trim()
      .min(1, "Recipient ID is required"),

    message: z
      .string()
      .trim()
      .max(
        300,
        "Message cannot exceed 300 characters"
      )
      .optional(),
  });

/*
|--------------------------------------------------------------------------
| Connection ID Params
|--------------------------------------------------------------------------
|
| Used for:
|
| PUT /connections/:connectionId/accept
| PUT /connections/:connectionId/reject
|
*/

export const connectionParamsSchema =
  z.object({
    connectionId: z
      .string()
      .trim()
      .min(
        1,
        "Connection ID is required"
      ),
  });