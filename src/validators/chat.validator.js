import { z } from "zod";

export const sendMessageSchema =
  z.object({
    text: z
      .string()
      .trim()
      .min(
        1,
        "Message cannot be empty"
      )
      .max(
        1000,
        "Message cannot exceed 1000 characters"
      ),
  });