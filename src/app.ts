import express from "express";
import authRoutes from "./routes/authRoute";
import cookieParser from "cookie-parser";
// import uploadRoutes from "./routes/uploadRoutes.ts";

const app = express();
app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/api/v1/auth", authRoutes);
// app.use("/upload", uploadRoutes);

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
