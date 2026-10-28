import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import { createServer } from "http";
import { Server } from "socket.io";

import workerRoutes from "./routes/workerRoutes.js";
import workRequestRoutes from "./routes/workRequestRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";

dotenv.config();

const app = express();
const httpServer = createServer(app);

export const io = new Server(httpServer, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "PATCH"],
  },
});
app.set("io", io);

io.on("connection", (socket) => {
  console.log("Client connected");
  socket.on("disconnect", () => console.log("Client disconnected"));
});

app.use(cors());
app.use(express.json());

app.use("/api/users", userRoutes);
app.use("/api/workers", workerRoutes);
app.use("/api/workrequests", workRequestRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/bookings", bookingRoutes);

app.get("/", (req, res) => res.json({ message: "CareCircle API running" }));

mongoose
  .connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/carecircle")
  .then(() => console.log("MongoDB connected"))
  .catch((error) => console.log(error));

const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => console.log(`Server running on port ${PORT}`));
