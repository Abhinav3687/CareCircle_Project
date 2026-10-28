import express from "express";
import Booking from "../models/Booking.js";

const router = express.Router();

router.post("/create", async (req, res) => {
  try {
    const booking = new Booking(req.body);
    await booking.save();
    req.app.get("io")?.emit("newBooking", booking);
    res.status(201).json({ message: "Care request created", booking });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/", async (req, res) => {
  try {
    const filter = {};

    if (req.query.customerId) {
      filter.customerId = req.query.customerId;
    }

    if (req.query.serviceType) {
      filter.serviceType = req.query.serviceType;
    }

    const bookings = await Booking.find(filter).sort({ createdAt: -1 });
    res.status(200).json(bookings);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
});

router.put("/status/:id", async (req, res) => {
  try {
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      {
        status: req.body.status,
        ...(req.body.providerId ? { providerId: req.body.providerId } : {}),
        ...(req.body.providerName ? { providerName: req.body.providerName } : {}),
      },
      { new: true }
    );

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    req.app.get("io")?.emit("bookingUpdated", booking);
    res.status(200).json({ message: "Booking updated", booking });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
