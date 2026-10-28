import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    customerName: { type: String },
    rating: { type: Number },
    review: { type: String },
  },
  { timestamps: true }
);

const workerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    password: { type: String, required: true },
    workType: { type: String, required: true },
    location: { type: String, required: true },
    organization: { type: String },
    licenseNumber: { type: String },
    experience: { type: String },
    availability: { type: String, default: "Weekdays" },
    status: { type: String, default: "pending" },
    rating: { type: Number, default: 5 },
    totalRatings: { type: Number, default: 0 },
    ratingCount: { type: Number, default: 0 },
    completedTasks: { type: Number, default: 0 },
    reviews: [reviewSchema],
  },
  { timestamps: true }
);

const Worker = mongoose.models.Worker || mongoose.model("Worker", workerSchema);
export default Worker;
