const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { uploadToCloudinary, deleteFromCloudinary } = require("../utils/cloudinary");
const fs = require("fs");
const path = require("path");

// ✅ Signup
exports.signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ msg: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();

    const token = jwt.sign(
      { user: { id: newUser._id } },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(201).json({
      msg: "Signup successful 🎉",
      token,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        profilePic: newUser.profilePic || null,
      },
    });
  } catch (err) {
    console.error("❌ Signup error:", err.message);
    res.status(500).json({ msg: "Server error during signup" });
  }
};

// ✅ Login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ msg: "Invalid email or password" });

    const token = jwt.sign(
      { user: { id: user._id } },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      msg: "Login successful 🎉",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        profilePic: user.profilePic || null,
      },
    });
  } catch (err) {
    console.error("❌ Login error:", err.message);
    res.status(500).json({ msg: "Server error during login" });
  }
};

// ✅ Get Profile
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ msg: "User not found" });

    res.json(user);
  } catch (err) {
    console.error("❌ Profile fetch error:", err.message);
    res.status(500).json({ msg: "Server error fetching profile" });
  }
};

// ✅ Update Profile (Cloudinary + Delete Old Image)
exports.updateProfile = async (req, res) => {
  try {
    const { name, email } = req.body;
    const user = await User.findById(req.user.id);

    if (!user) return res.status(404).json({ msg: "User not found" });

    const updateData = { name, email };

    // ✅ Agar nayi image aayi hai
    if (req.file) {
      // 🔴 Step 1: Purani image Cloudinary se delete kar (agar koi hai aur default nahi)
      if (user.cloudinaryPublicId) {
        try {
          await deleteFromCloudinary(user.cloudinaryPublicId);
        } catch (err) {
          console.warn("⚠️ Cloudinary delete failed:", err.message);
        }
      }

      // 🟢 Step 2: Nayi image upload kar
      const uploadResult = await uploadToCloudinary(req.file.path);

      updateData.profilePhoto = uploadResult.secure_url; // ✅ consistent field name
      updateData.cloudinaryPublicId = uploadResult.public_id;

      // 🧹 Step 3: Local temp file delete
      if (fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
    }

    // 🟣 Step 4: Update user
    const updatedUser = await User.findByIdAndUpdate(req.user.id, updateData, {
      new: true,
      runValidators: true,
    }).select("-password");

    res.json({
      msg: "Profile updated successfully ✅",
      updatedUser,
    });
  } catch (err) {
    console.error("❌ Profile update error:", err);
    res.status(500).json({ msg: "Server error updating profile" });
  }
};
