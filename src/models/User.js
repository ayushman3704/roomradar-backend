import mongoose from "mongoose";
import bcrypt from "bcryptjs";


/*
|--------------------------------------------------------------------------
| Preference Schema
|--------------------------------------------------------------------------
*/

const preferenceSchema = new mongoose.Schema(
  {
    value: {
      type: Number,
      required: true,
      min: 1,
      max: 10,
    },

    weight: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
  },
  {
    _id: false,
  }
);


/*
|--------------------------------------------------------------------------
| User Schema
|--------------------------------------------------------------------------
*/


const userSchema = new mongoose.Schema(
  {
    /*
    |--------------------------------------------------------------------------
    | Authentication
    |--------------------------------------------------------------------------
    */

    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: 6,
      select: false,
    },

    avatar: {
      type: String,
      default: null,
    },

    /*
    |--------------------------------------------------------------------------
    | User Status
    |--------------------------------------------------------------------------
    */

    profileCompleted: {
      type: Boolean,
      default: false,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    lastSeen: {
      type: Date,
      default: Date.now,
    },

    /*
    |--------------------------------------------------------------------------
    | Reputation
    |--------------------------------------------------------------------------
    */

trustScore: {
  type: Number,
  default: 100,
  min: 0,
  max: 100,
},

reviewStats: {
  totalReviews: {
    type: Number,
    default: 0,
  },

  averageCleanliness: {
    type: Number,
    default: 0,
    min: 0,
    max: 5,
  },

  averageFinancialReliability: {
    type: Number,
    default: 0,
    min: 0,
    max: 5,
  },

  averageRespectsBoundaries: {
    type: Number,
    default: 0,
    min: 0,
    max: 5,
  },
},

    /*
    |--------------------------------------------------------------------------
    | Basic Filters
    |--------------------------------------------------------------------------
    */

    city: {
      type: String,
      trim: true,
    },

    state: {
      type: String,
      trim: true,
    },

    gender: {
      type: String,
      enum: ["male", "female", "other"],
    },

    budgetMin: {
      type: Number,
      min: 0,
    },

    budgetMax: {
      type: Number,
      min: 0,
    },

    /*
    |--------------------------------------------------------------------------
    | Lifestyle Preference Vector
    |--------------------------------------------------------------------------
    */

    lifestylePreferences: {
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

userSchema.index({
  city: 1,
  isActive: 1,
});

userSchema.index({
  city: 1,
  profileCompleted: 1,
});

userSchema.index({
  trustScore: -1,
});


// Encrypt password before saving user
userSchema.pre("save", async function () {
  // 1. If password is not modified, exit early.
  // A simple 'return' resolves the Promise, telling Mongoose to move on.
  if (!this.isModified("password")) {
    return; 
  }

  // 2. Hash the password
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  
  // 3. No need to call next() at the end! 
  // Once the async function finishes, Mongoose automatically saves the document.
});


// Compare entered password with hashed password
userSchema.methods.matchPassword =
  async function (enteredPassword) {
    return await bcrypt.compare(
      enteredPassword,
      this.password
    );
};

const User = mongoose.model(
  "User",
  userSchema
);

export default User;