import { z } from "zod";

/*
|--------------------------------------------------------------------------
| Reusable Preference Schema
|--------------------------------------------------------------------------
|
| value:
|   User's preference level (1-10)
|
| weight:
|   Importance of that preference (1-5)
|
*/

export const preferenceSchema = z.object({
  value: z
    .number({
      required_error: "Preference value is required",
      invalid_type_error: "Preference value must be a number",
    })
    .min(1, "Preference value must be at least 1")
    .max(10, "Preference value cannot exceed 10"),

  weight: z
    .number({
      required_error: "Preference weight is required",
      invalid_type_error: "Preference weight must be a number",
    })
    .min(1, "Preference weight must be at least 1")
    .max(5, "Preference weight cannot exceed 5"),
});

/*
|--------------------------------------------------------------------------
| Lifestyle Preferences Schema
|--------------------------------------------------------------------------
*/

export const lifestylePreferencesSchema = z.object({
  sleepSchedule: preferenceSchema,

  cleanliness: preferenceSchema,

  studyStyle: preferenceSchema,

  noiseTolerance: preferenceSchema,

  guestFrequency: preferenceSchema,

  foodPreference: preferenceSchema,

  gamingFrequency: preferenceSchema,

  smokingPreference: preferenceSchema,

  drinkingPreference: preferenceSchema,

  acPreference: preferenceSchema,
});

/*
|--------------------------------------------------------------------------
| Update Profile Schema
|--------------------------------------------------------------------------
*/

export const updateProfileSchema = z
  .object({
    city: z
      .string()
      .trim()
      .min(2, "City must contain at least 2 characters")
      .max(50, "City cannot exceed 50 characters"),

    state: z
      .string()
      .trim()
      .min(2, "State must contain at least 2 characters")
      .max(50, "State cannot exceed 50 characters"),

    gender: z.enum(
      ["male", "female", "other"],
      {
        errorMap: () => ({
          message:
            "Gender must be male, female, or other",
        }),
      }
    ),

    budgetMin: z
      .number({
        required_error:
          "Minimum budget is required",
      })
      .min(
        1000,
        "Minimum budget must be at least ₹1000"
      ),

    budgetMax: z
      .number({
        required_error:
          "Maximum budget is required",
      })
      .min(
        1000,
        "Maximum budget must be at least ₹1000"
      ),

    lifestylePreferences:
      lifestylePreferencesSchema,
  })

  .refine(
    (data) =>
      data.budgetMax >= data.budgetMin,
    {
      path: ["budgetMax"],
      message:
        "Maximum budget must be greater than or equal to minimum budget",
    }
  );