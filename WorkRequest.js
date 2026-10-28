import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import Worker from "../models/Worker.js";

const router = express.Router();


// REGISTER WORKER
router.post("/register", async (req, res) => {

  try {

    const {

      name,
      email,
      phone,
      password,
      workType,
      location,

    } = req.body;

    const existingWorker =
      await Worker.findOne({ email });

    if (existingWorker) {

      return res.status(400).json({
        message: "Worker Already Exists",
      });
    }

    const hashedPassword =
      await bcrypt.hash(password, 10);

    const newWorker = new Worker({

      name,
      email,
      phone,
      password: hashedPassword,
      workType,
      location,

    });

    await newWorker.save();

    res.status(201).json({
      message: "Worker Registered Successfully",
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
});


// LOGIN WORKER
router.post("/login", async (req, res) => {

  try {

    const { email, password } = req.body;

    const worker = await Worker.findOne({
      email,
    });

    if (!worker) {

      return res.status(400).json({
        message: "Invalid Credentials",
      });
    }

    const isMatch = await bcrypt.compare(
      password,
      worker.password
    );

    if (!isMatch) {

      return res.status(400).json({
        message: "Invalid Credentials",
      });
    }

    const token = jwt.sign(

      {
        id: worker._id,
      },

      "secretkey",

      {
        expiresIn: "7d",
      }
    );

    res.status(200).json({

      message: "Login Successful",

      token,

      worker,

    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
});


// RATE WORKER
router.put("/rate/:id", async (req, res) => {

  try {

    const worker = await Worker.findById(
      req.params.id
    );

    if (!worker) {

      return res.status(404).json({
        message: "Worker Not Found",
      });
    }

    const {

      customerName,
      rating,
      review,

    } = req.body;

    worker.reviews.push({

      customerName,
      rating,
      review,

    });

    worker.totalRatings += rating;

    worker.ratingCount += 1;

    worker.completedTasks += 1;

    worker.rating =

      worker.totalRatings /

      worker.ratingCount;

    await worker.save();

    res.status(200).json({

      message: "Worker Rated Successfully",

    });

  } catch (error) {

    console.log(error);

    res.status(500).json({

      message: "Server Error",

    });
  }
});


// GET ALL WORKERS
router.get("/", async (req, res) => {

  try {

    const workers = await Worker.find();

    res.status(200).json(workers);

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
});

export default router;