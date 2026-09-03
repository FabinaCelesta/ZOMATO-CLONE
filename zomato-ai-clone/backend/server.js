import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import authRoutes from "./routes/auth.js";
import restaurantRoutes from "./routes/restaurants.js";
import orderRoutes from "./routes/orders.js";
import aiRoutes from "./routes/ai.js";
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.get("/api/health", (req,res)=>res.json({ok:true,message:"API running"}));
app.use("/api/auth", authRoutes);
app.use("/api/restaurants", restaurantRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/ai", aiRoutes);

mongoose.connect(process.env.MONGO_URI)
 .then(()=>app.listen(process.env.PORT||5000,()=>console.log("Server running")))
 .catch(err=>console.error("MongoDB connection error:",err.message));
