// src/utils/sendToken.js

import generateToken from "./generateToken.js";

const sendToken = (user, statusCode, res) => {
  const token = generateToken(user._id);

  const cookieOptions = {
    httpOnly: true,

    secure:
      process.env.NODE_ENV === "production",

    sameSite: "strict",

    maxAge:
      7 * 24 * 60 * 60 * 1000, // 7 days
  };

  res
    .status(statusCode)
    .cookie("token", token, cookieOptions)
    .json({
      success: true,

      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        profileCompleted:
          user.profileCompleted,
      },
    });
};

export default sendToken;