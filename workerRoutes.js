import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Worker from "../models/Worker.js";

const router = express.Router();
const isNumericPhone = (value) => /^\d{10}$/.test(String(value || ""));
const isNameText = (value) => !value || /^[A-Za-z. ]+$/.test(String(value).trim());

router.post("/register", async (req, res) => {
  try {
    const { name, email, phone, password, workType, location, organization, licenseNumber, experience, availability } = req.body;

    if (!isNameText(name) || !isNameText(organization)) {
      return res.status(400).json({ message: "Names can contain only letters, spaces, and dots" });
    }

    if (!isNumericPhone(phone)) {
      return res.status(400).json({ message: "Invalid phone number. Phone number must be exactly 10 digits" });
    }

    const existingWorker = await Worker.findOne({ email });

    if (existingWorker) {
      return res.status(400).json({ message: "Partner already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newWorker = new Worker({
      name,
      email,
      phone,
      password: hashedPassword,
      workType,
      location,
      organization,
      licenseNumber,
      experience,
      availability,
      status: "pending",
    });

    await newWorker.save();
    res.status(201).json({ message: "Partner application submitted" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const worker = await Worker.findOne({ email });

    if (!worker) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, worker.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: worker._id }, process.env.JWT_SECRET || "secretkey", { expiresIn: "7d" });
    res.status(200).json({ message: "Login successful", token, worker });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/forgot-password", async (req, res) => {
  try {
    const { email, phone, newPassword } = req.body;

    if (!email || !isNumericPhone(phone) || !newPassword || newPassword.length < 6) {
      return res.status(400).json({ message: "Enter email, a 10 digit phone number, and a password with at least 6 characters" });
    }

    const worker = await Worker.findOne({ email, phone });

    if (!worker) {
      return res.status(404).json({ message: "No partner found for this email and phone" });
    }

    worker.password = await bcrypt.hash(newPassword, 10);
    await worker.save();

    res.status(200).json({ message: "Password reset successful" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Password reset failed" });
  }
});

router.put("/approve/:id", async (req, res) => {
  try {
    const worker = await Worker.findByIdAndUpdate(req.params.id, { status: "approved" }, { new: true });

    if (!worker) {
      return res.status(404).json({ message: "Partner not found" });
    }

    res.status(200).json({ message: "Partner approved", worker });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
});

router.put("/status/:id", async (req, res) => {
  try {
    const worker = await Worker.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });

    if (!worker) {
      return res.status(404).json({ message: "Partner not found" });
    }

    res.status(200).json({ message: "Partner updated", worker });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
});

router.put("/rate/:id", async (req, res) => {
  try {
    const worker = await Worker.findById(req.params.id);

    if (!worker) {
      return res.status(404).json({ message: "Partner not found" });
    }

    const { customerName, rating, review } = req.body;
    worker.reviews.push({ customerName, rating, review });
    worker.totalRatings += rating;
    worker.ratingCount += 1;
    worker.completedTasks += 1;
    worker.rating = worker.totalRatings / worker.ratingCount;
    await worker.save();

    res.status(200).json({ message: "Review submitted" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/", async (req, res) => {
  try {
    const workers = await Worker.find().select("-password").sort({ createdAt: -1 });
    res.status(200).json(workers);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
