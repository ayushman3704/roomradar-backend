import {
  COMPATIBILITY_ATTRIBUTES,
  COMPATIBILITY_CONFIG,
  ATTRIBUTE_LABELS,
} from "../constants/compatibility.constants.js";

const {
  MAX_PREFERENCE_VALUE,
  MIN_PREFERENCE_VALUE,
  STRENGTH_THRESHOLD,
  CONFLICT_DIFFERENCE_THRESHOLD,
} = COMPATIBILITY_CONFIG;

/*
|--------------------------------------------------------------------------
| Calculate Similarity
|--------------------------------------------------------------------------
|
| Converts difference into a score between:
|
| 0   -> Completely different
| 100 -> Identical
|
*/

const calculateSimilarity = (
  valueA,
  valueB
) => {
  const difference = Math.abs(
    valueA - valueB
  );

  const maxDifference =
    MAX_PREFERENCE_VALUE -
    MIN_PREFERENCE_VALUE;

  const similarity =
    (1 - difference / maxDifference) *
    100;

  return similarity;
};

/*
|--------------------------------------------------------------------------
| Calculate Compatibility
|--------------------------------------------------------------------------
*/

export const calculateCompatibility = (
  userA,
  userB
) => {

  const preferencesA =
    userA.lifestylePreferences;

  const preferencesB =
    userB.lifestylePreferences;

  const breakdown = {};

  const strengths = [];

  const conflicts = [];

  let totalWeightedScore = 0;

  let totalWeight = 0;

  for (const attribute of COMPATIBILITY_ATTRIBUTES) {

    const prefA =
      preferencesA?.[attribute];

    const prefB =
      preferencesB?.[attribute];

    /*
    |--------------------------------------------------------------------------
    | Skip Missing Preferences
    |--------------------------------------------------------------------------
    */

    if (!prefA || !prefB) {
      continue;
    }

    const valueA = prefA.value;

    const valueB = prefB.value;

    const weightA = prefA.weight;

    const weightB = prefB.weight;

    /*
    |--------------------------------------------------------------------------
    | Similarity
    |--------------------------------------------------------------------------
    */

    const similarity =
      calculateSimilarity(
        valueA,
        valueB
      );

    /*
    |--------------------------------------------------------------------------
    | Combined Weight
    |--------------------------------------------------------------------------
    */

    const combinedWeight =
      (weightA + weightB) / 2;

    /*
    |--------------------------------------------------------------------------
    | Weighted Score
    |--------------------------------------------------------------------------
    */

    totalWeightedScore +=
      similarity *
      combinedWeight;

    totalWeight +=
      combinedWeight;

    breakdown[
      ATTRIBUTE_LABELS[
        attribute
      ]
    ] =
      Math.round(similarity);

    /*
    |--------------------------------------------------------------------------
    | Strength Detection
    |--------------------------------------------------------------------------
    */

    if (
      similarity >=
      STRENGTH_THRESHOLD
    ) {
      strengths.push(
        ATTRIBUTE_LABELS[
          attribute
        ]
      );
    }

    /*
    |--------------------------------------------------------------------------
    | Conflict Detection
    |--------------------------------------------------------------------------
    */

    const difference =
      Math.abs(
        valueA - valueB
      );

    if (
      difference >=
      CONFLICT_DIFFERENCE_THRESHOLD
    ) {
      conflicts.push(
        ATTRIBUTE_LABELS[
          attribute
        ]
      );
    }
  }

  /*
  |--------------------------------------------------------------------------
  | Final Score
  |--------------------------------------------------------------------------
  */

  const score =
    totalWeight === 0
      ? 0
      : Math.round(
          totalWeightedScore /
            totalWeight
        );

  return {
    score,

    breakdown,

    strengths,

    conflicts,
  };
};