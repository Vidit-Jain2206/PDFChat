import express from "express";
import authRoutes from "./routes/authRoute";
import cookieParser from "cookie-parser";
import uploadRoutes from "./routes/uploadRoute";

const app = express();
app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/upload", uploadRoutes);

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
