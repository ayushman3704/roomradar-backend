import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
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

    profileCompleted: {
      type: Boolean,
      default: false,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);


// Encrypt password before saving user
// userSchema.pre("save", async function (next) {
//   if (!this.isModified("password")) {
//     return next();
//   }

//   const salt = await bcrypt.genSalt(10);

//   this.password = await bcrypt.hash(
//     this.password,
//     salt
//   );

//   next();
// });

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