import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const router = express.Router();

// Generate JWT
const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: "1d" });
};

// =======================
// @route   POST /api/auth/signup
// =======================
router.post("/signup", async (req, res) => {
  const { username, password, role } = req.body;
    console.log("signup request body:", req.body); 
   try {
    console.log("signup request body:", req.body);  // 👀 log incoming
    // rest of your code
  } catch (err) {
    console.error("signup error:", err);            // 👀 log error
    res.status(500).json({ message: "Internal Server Error" });
  }

  if (!username || !password || !role) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ username, password: hashedPassword, role });

    res.status(201).json({
      _id: user._id,
      username: user.username,
      role: user.role,
      token: generateToken(user._id, user.role),
    });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// =======================
// @route   POST /api/auth/login
// =======================
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

 try {
    console.log("Login request body:", req.body);  // 👀 log incoming
    // rest of your code
  } catch (err) {
    console.error("Login error:", err);            // 👀 log error
    res.status(500).json({ message: "Internal Server Error" });
  }


  if (!username || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const user = await User.findOne({ username });
    if (user && (await bcrypt.compare(password, user.password))) {
      res.json({
        _id: user._id,
        username: user.username,
        role: user.role,
        token: generateToken(user._id, user.role),
      });
    } else {
      res.status(401).json({ message: "Invalid credentials" });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

export default router;
