import express from "express";
import bcrypt from "bcryptjs";
import User from "../models/User.js";

const router = express.Router();

const sanitizeUser = (user) => {
  const safeUser = user.toObject ? user.toObject() : user;
  delete safeUser.password;
  return safeUser;
};
const isNumericPhone = (value) => /^\d{10}$/.test(String(value || ""));
const isNameText = (value) => /^[A-Za-z. ]+$/.test(String(value || "").trim());

router.post("/register", async (req, res) => {
  try {
    const { name, email, phone, password, selectedPlan, elderProfile } = req.body;

    if (!isNameText(name) || !isNameText(elderProfile?.fullName) || !isNameText(elderProfile?.relation)) {
      return res.status(400).json({ message: "Names can contain only letters, spaces, and dots" });
    }

    if (!isNumericPhone(phone) || !isNumericPhone(elderProfile?.emergencyContact)) {
      return res.status(400).json({ message: "Invalid phone number. Phone numbers must be exactly 10 digits" });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: "Account already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      name,
      email,
      phone,
      password: hashedPassword,
      selectedPlan,
      elderProfile,
    });

    await newUser.save();
    res.status(201).json({ message: "Registration successful", user: sanitizeUser(newUser) });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Registration failed" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    res.status(200).json({ message: "Login successful", user: sanitizeUser(user) });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Login failed" });
  }
});

router.post("/forgot-password", async (req, res) => {
  try {
    const { email, phone, newPassword } = req.body;

    if (!email || !isNumericPhone(phone) || !newPassword || newPassword.length < 6) {
      return res.status(400).json({ message: "Enter email, a 10 digit phone number, and a password with at least 6 characters" });
    }

    const user = await User.findOne({ email, phone });

    if (!user) {
      return res.status(404).json({ message: "No account found for this email and phone" });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.status(200).json({ message: "Password reset successful" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Password reset failed" });
  }
});

router.post("/admin/login", (req, res) => {
  const { email, password } = req.body;
  const adminEmail = process.env.ADMIN_EMAIL || "admin@carecircle.com";
  const adminPassword = process.env.ADMIN_PASSWORD || "Admin@123";

  if (email === adminEmail && password === adminPassword) {
    return res.status(200).json({
      message: "Admin login successful",
      admin: { email: adminEmail, role: "admin" },
    });
  }

  return res.status(401).json({ message: "Invalid admin credentials" });
});

router.get("/", async (req, res) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });
    res.status(200).json(users);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
