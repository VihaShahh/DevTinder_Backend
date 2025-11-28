import mongoose from "mongoose"
import validator from "validator"
const userSchema = new mongoose.Schema({

   firstName: {
      type: String,
      required: [true, "First name is required"],
      minLength: [2, "First name must be at least 2 characters"],
      maxLength: [50, "First name must be at most 50 characters"]
   },

   lastName: {
      type: String,
   },
   emailId: {
      type: String,
      lowercase: true,
      trim: true,
      required: [true, "Email is required"],
      unique: true,
      validate(value) {
         if (!validator.isEmail(value)) {
            throw new Error("invalid email id" + value
            )
         }
      }
   },

   password: {
      type: String,
      required: [true, "Password is required"],
      validate(value) {
         if (!validator.isStrongPassword(value)) {
            throw new Error("Please enter the valid password " + value)
         }
      }
   },
   age: {
      type: Number,
      min: [18, "Minimum age is 18"],
      max: [200, "Maximum age is 200"]
   },

   gender: {
      type: String,
      validate(value) {
         if (!["male", "female", "other"].includes(value.toLowerCase())) {
            throw new Error("Gender data is not valid")
         }
      }
   },

   shortUrl: {
      type: String,
      validate: {
         validator: (value) => !value || validator.isURL(value, { require_protocol: true }),
         message: "shortUrl must be a valid URL",
      },
   },

   photoUrl: {
      type: String,
      default: "https://stock.adobe.com/in/search?k=default+profile+picture&asset_id=633072621",
      validate: {
         validator: (value) => validator.isURL(value, { require_protocol: true }),
         message: "photoUrl must be a valid URL",
      },
   },

   about: {
      type: String,
      default: "This is a default about section of a user.",
      maxLength: [500, "About section cannot exceed 500 characters"]
   },

   skills: {
      type: [String],
      validate: {
         validator: function (arr) {
            if (arr.length > 20) return false;

            for (let skill of arr) {
               if (typeof skill != "string") return false;
               if (skill.length < 1 || skill.length > 50) return false;
            }
            return true;
         },
         message: "Invalid skills: Maximum 20 skills allowed and each skill must be 1–50 characters."
      }
   }

}, {
   timestamps: true
})

const User = mongoose.model("users", userSchema)
export default User