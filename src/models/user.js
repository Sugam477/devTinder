const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken"); // For generating and verifying JWT tokens


const userSchema = mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      index: true,
      minLength: 4,
      maxLength: 50,
    },
    lastName: {
      type: String,
    },
    emailId: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Invalid email address" + value);
        }
      },
    },

    password: {
      type: String,
      required: true,
      // NOTE: strength is validated on the plaintext password in
      // utils/validation.js — the value stored here is a bcrypt hash.
    },
    age: {
      type: Number,
      min: 18,
    },
    gender: {
      type: String,
      enum: {
        values: ["male", "female", "others"],
        message: `{VALUE} is not a valid gender type`
      },
      // validate(value) {
      //   if (!["male", "female", "other"].includes(value)) {
      //     throw new Error("Gender must be either male, female, or other");
      //   }
      // },
    },
    photoUrl: {
      type: String,
      validate(value) {
        if (!validator.isURL(value)) {
          throw new Error("Invalid URL" + value);
        }
      },
    },
    about: {
      type: String,
      default: "This is a default about me description.",
    },
    skills: {
      type: [String],
    },
  },

  {
    timestamps: true,
    // Never send the password hash to the client. The field is still loaded
    // from the DB (so validatePassword works); it is only removed when the
    // document is converted to JSON for a response.
    toJSON: {
      transform: (doc, ret) => {
        delete ret.password;
        return ret;
      },
    },
  },
);
userSchema.methods.getJWT = async function () {
  const user = this;
  // Keep "1h" in sync with the cookie maxAge in routes/auth.js
  const token = await jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
  return token;
};
userSchema.methods.validatePassword = async function (passwordInputByUser) {
  const user = this;
  const passwordHash = user.password;
  const isPasswordValid = await bcrypt.compare(passwordInputByUser, passwordHash);
  return isPasswordValid;

}
module.exports = mongoose.model("User", userSchema);
