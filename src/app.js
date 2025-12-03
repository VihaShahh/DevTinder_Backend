import express from "express";
import mongoose from "mongoose";
import connectDb from "../src/config/database.js";
import validator from "validator";
import User from "./models/user.js";
import { validateSignup } from "./middleware/middleware.js";
import bcrypt from "bcrypt"
import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken"
import { userAuth } from "./middleware/middleware.js"
const app = express();
app.use(cookieParser())

// Middleware for parsing JSON
app.use(express.json());


// Ensure indexes are created after DB connection
mongoose.connection.on("connected", async () => {
  try {
    await User.syncIndexes();
    //console.log("Indexes synchronized!");
  } catch (err) {
    console.error("Index sync error:", err.message);
  }
});

// =========================
// POST: Create User
// =========================
app.post("/signup", validateSignup, async (req, res) => {
  try {

    //encrypt the password
    const { firstName, lastName, emailId, password } = req.body
    const hashedPassword = await bcrypt.hash(password, 10)
    const user = new User({
      firstName,
      lastName,
      emailId,
      password: hashedPassword
    });
    await user.save();

    return res.status(201).json({
      success: true,
      message: "User created successfully",
      data: user,
    });
  } catch (error) {

    // Duplicate Email Handling
    if (error.code == 11000) {
      return res.status(400).json({
        success: false,
        message: "Email already exists",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Something went wrong",
      error: error.message,
    });
  }
});


// =========================
// POST: Login User
// =========================  
app.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;

    if (!emailId) {
      return res.status(400).json({ success: false, message: "Email id is required" });
    }

    if (!validator.isEmail(emailId)) {
      return res.status(400).json({ success: false, message: "Invalid email format" });
    }

    if (!password) {
      return res.status(400).json({ success: false, message: "Password is required" });
    }

    const user = await User.findOne({ emailId });
    if (!user) {
      return res.status(404).json({ success: false, message: "Email not found" });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ success: false, message: "Invalid password" });
    }
    if (isValidPassword) {
      const token = jwt.sign({ _id: user._id }, "Dev@Tinder@124")
      res.cookie("token", token);
      // create a jwt token
      //add the token to cookie and send the response back to the browser.
      return res.status(200).json({
        success: true,
        message: "Login successful",
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error"
    });
  }
});

// =========================
// GET: User Profile (Protected)
// =========================  

app.get("/profile", userAuth, (req, res) => {
  return res.status(200).json({
    success: true,
    message: "User profile fetched successfully",
    data: req.user
  });
});

// =========================
// POST: Send the Connection Request
// =========================

app.post("/sendConnectionRequest", userAuth, async (req, res) => {
  const user = req.user;
  res.send("Connection request sent successfully to " + user.firstName)
})

// // =========================
// // GET: Find user by Id
// // =========================

// app.get("/user/:id", async (req, res) => {
//   try {
//     const userId = req.params.id
//     const user = await User.findById(userId)
//     if (!user) {
//       return res.status(404).json({
//         success: false,
//         message: "User not found"
//       })
//     }
//     return res.status(200).json({
//       success: true,
//       data: user
//     })

//   } catch (error) {
//     return res.status(400).json({
//       success: false,
//       message: "Invalid user id",
//       error: error.message
//     })
//   }
// })

// // =========================
// // GET: Find Users by emailId
// // =========================
// app.get("/allUsers", async (req, res) => {
//   try {
//     const userEmail = req.query.emailId;

//     const users = await User.find({ emailId: userEmail });

//     if (users.length == 0) {
//       return res.status(404).json({
//         success: false,
//         message: "No users found",
//       });
//     }

//     return res.status(200).json({
//       success: true,
//       data: users,
//     });

//   } catch (error) {
//     return res.status(400).json({
//       success: false,
//       message: "Couldn't fetch users",
//       error: error.message,
//     });
//   }
// });

// // =========================
// // GET: Fetch All Users
// // =========================
// app.get("/users", async (req, res) => {
//   try {
//     const users = await User.find({});
//     return res.status(200).json({
//       success: true,
//       data: users,
//     });
//   } catch (error) {
//     return res.status(500).json({
//       success: false,
//       message: "Couldn't fetch users",
//       error: error.message,
//     });
//   }
// });

// // =========================
// // PATCH: Update User by Id
// // =========================

// app.patch("/user/:id", async (req, res) => {
//   try {
//     const userId = req.params.id;

//     const ALLOWED_UPDATES = [
//       "photoURL",
//       "about",
//       "gender",
//       "skills",
//       "firstName",
//       "lastName",
//       "age",
//       "userId"
//     ]
//     const data = req.body

//     const isUpdateAllowed = Object.keys(data).every((key) => ALLOWED_UPDATES.includes(key))

//     if (!isUpdateAllowed) {
//       return res.status(400).json({
//         success: false,
//         message: "update not allowed"
//       })
//     }
//     // Find and update
//     const updatedUser = await User.findByIdAndUpdate(
//       userId,
//       data,
//       {
//         returnDocument: "after",  // returns updated user
//         runValidators: true //run schema validators on update
//       }
//     );

//     if (!updatedUser) {
//       return res.status(404).json({
//         success: false,
//         message: "User not found"
//       });
//     }

//     return res.status(200).json({
//       success: true,
//       message: "User updated successfully",
//       data: updatedUser,
//     });

//   } catch (error) {

//     // Email duplicate during update
//     if (error.code === 11000) {
//       return res.status(400).json({
//         success: false,
//         message: "Email already exists",
//       });
//     }

//     return res.status(400).json({
//       success: false,
//       message: "Failed to update user",
//       error: error.message
//     });
//   }
// });

// // =========================
// // Delete user by Id
// // =========================
// app.delete("/user/:id", async (req, res) => {
//   const userId = req.params.id
//   try {
//     const deleteUser = await User.findByIdAndDelete(userId)
//     return res.status(200).json({
//       success: true,
//       message: "User deleted successfully",
//       data: deleteUser
//     })
//   }
//   catch (error) {
//     return res.status(500).json({
//       success: false,
//       message: "Couldn't fetch user",
//       error: error.message,
//     });
//   }
// })

// =========================
// Start Server After DB
// =========================
const startServer = async () => {
  try {
    await connectDb();

    app.listen(3000, () => {
      console.log("Server is successfully listening on port 3000");
    });
  } catch (error) {
    console.error("Failed to start server:", error);
  }
};

startServer();
