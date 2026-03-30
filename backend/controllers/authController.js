import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user.js";

export const register = async (req, res) => {
  try {
    const { username, password, role } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({ username, password: hashedPassword, role });
    await user.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username});
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1d" });

    res.json({ token, role: user.role });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
import cloudinary from "../utils/cloudinary.js"; // Ensure your cloudinary config is correct
import getDataUri from "../utils/datauri.js"; // Ensure this utility exists


export const updateProfile = async (req, res) => {
  try {
    const userId = req.user._id; 
    const { fullname, phoneNumber, rank, badgeNumber, department, station, region, yearsOfService } = req.body;
    const file = req.file;

    let avatarUrl;
    if (file) {
      const fileUri = getDataUri(file);
      const cloudResponse = await cloudinary.uploader.upload(fileUri.content);
      avatarUrl = cloudResponse.secure_url;
    }

    const updateData = {
      fullname,
      phoneNumber,
      profile: {
        rank,
        badgeNumber,
        department,
        station,
        region,
        yearsOfService,
        ...(avatarUrl && { avatar: avatarUrl })
      }
    };

    const updatedUser = await User.findByIdAndUpdate(
      userId, 
      { $set: updateData }, 
      { new: true }
    ).select("-password");

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: updatedUser
    });
  } catch (error) {
    console.error("Update Error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};