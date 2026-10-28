import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    elderName: { type: String },
    serviceType: { type: String, required: true },
    providerId: { type: mongoose.Schema.Types.ObjectId, ref: "Worker" },
    providerName: { type: String },
    date: { type: String, required: true },
    time: { type: String },
    address: { type: String, required: true },
    notes: { type: String },
    amount: { type: Number, default: 0 },
    urgency: { type: String, default: "normal" },
    status: { type: String, default: "pending" },
  },
  { timestamps: true }
);

const Booking = mongoose.models.Booking || mongoose.model("Booking", bookingSchema);
export default Booking;
