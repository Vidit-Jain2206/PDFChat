import express from "express";
import authRoutes from "./routes/authRoute";
import cookieParser from "cookie-parser";
import uploadRoutes from "./routes/uploadRoute";
import { Server } from "socket.io";
import http from "http";
import { getAnswers, initiateChat } from "./controllers/getAnswers";
const app = express();
const server = http.createServer(app);
import { v4 as uuidv4 } from "uuid";
import { aiApp } from "./utils/chatModel";

const io = new Server(server);

io.on("connection", async (socket) => {
  console.log("a user connected");
  const config = { configurable: { thread_id: uuidv4() } };
  socket.on("start:chat", async (document_id: number) => {
    initiateChat(Number(document_id), config);
    socket.emit(
      "started:chat",
      "Chat started You can now start asking questions"
    );
  });

  socket.on("ask:question", async (question: string) => {
    const answers = await getAnswers(question, config);
    socket.emit("got:answer", answers);
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/upload", uploadRoutes);

server.listen(3000, () => {
  console.log("Server is running on port 3000");
});
