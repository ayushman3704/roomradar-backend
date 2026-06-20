/*
|--------------------------------------------------------------------------
| Compatibility Attributes
|--------------------------------------------------------------------------
|
| These attributes participate in compatibility calculation.
| Every attribute is expected to have:
|
| {
|   value: Number (1-10)
|   weight: Number (1-5)
| }
|
*/

export const COMPATIBILITY_ATTRIBUTES = [
  "sleepSchedule",
  "cleanliness",
  "studyStyle",
  "noiseTolerance",
  "guestFrequency",
  "foodPreference",
  "gamingFrequency",
  "smokingPreference",
  "drinkingPreference",
  "acPreference",
];

/*
|--------------------------------------------------------------------------
| Scoring Configuration
|--------------------------------------------------------------------------
*/

export const COMPATIBILITY_CONFIG = {
  MIN_PREFERENCE_VALUE: 1,
  MAX_PREFERENCE_VALUE: 10,

  MIN_WEIGHT: 1,
  MAX_WEIGHT: 5,

  /*
  |--------------------------------------------------------------------------
  | Similarity Thresholds
  |--------------------------------------------------------------------------
  */

  STRENGTH_THRESHOLD: 85,

  /*
  |--------------------------------------------------------------------------
  | Conflict Threshold
  |--------------------------------------------------------------------------
  |
  | If absolute difference between values >= 5,
  | mark as potential conflict.
  |
  */

  CONFLICT_DIFFERENCE_THRESHOLD: 5,
};

/*
|--------------------------------------------------------------------------
| User-Friendly Labels
|--------------------------------------------------------------------------
|
| Used for:
| - API responses
| - Discovery Feed
| - Conflict Messages
| - Ice Breakers
|
*/

export const ATTRIBUTE_LABELS = {
  sleepSchedule: "Sleep Schedule",

  cleanliness: "Cleanliness",

  studyStyle: "Study Style",

  noiseTolerance: "Noise Tolerance",

  guestFrequency: "Guest Frequency",

  foodPreference: "Food Preference",

  gamingFrequency: "Gaming Frequency",

  smokingPreference: "Smoking Preference",

  drinkingPreference: "Drinking Preference",

  acPreference: "AC Preference",
};