import mongoose from "mongoose";

const elderProfileSchema = new mongoose.Schema({
  fullName: { type: String },
  age: { type: Number },
  relation: { type: String },
  address: { type: String },
  medicalConditions: { type: String },
  allergies: { type: String },
  medicines: { type: String },
  emergencyContact: { type: String },
  preferredHospital: { type: String },
});

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    phone: { type: String, required: true },
    password: { type: String, required: true },
    selectedPlan: { type: String, default: "Basic Care" },
    planStatus: { type: String, default: "Active" },
    elderProfile: elderProfileSchema,
  },
  { timestamps: true }
);

const User = mongoose.models.User || mongoose.model("User", userSchema);
export default User;
