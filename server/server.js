const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const http = require("http");
const { Server } = require("socket.io");
const Document = require("./models/Document");
const documentRoutes = require("./routes/documentRoutes");
const authenticate = require("./middleware/firebaseAuth");

dotenv.config();

const app = express();
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());

const MONGO_URI = process.env.MONGO_URI;

mongoose
  .connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("Mongo error:", err));

app.use("/documents", authenticate, documentRoutes);

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("joinDocument", (docId) => {
    socket.join(docId);
    console.log(`User joined document: ${docId}`);
  });

  socket.on("editDocument", async ({ documentId, title, content }) => {
    try {
      await Document.findByIdAndUpdate(documentId, { title, content });
      socket.to(documentId).emit("documentUpdated", { title, content });
    } catch (error) {
      console.error("Failed to save real-time edit:", error);
    }
  });

  socket.on("save-document", async ({ documentId, content, title }) => {
    try {
      await Document.findByIdAndUpdate(documentId, { content, title });
    } catch (err) {
      console.error("Failed to save real-time edit:", err);
    }
  });

  socket.on("leaveDocument", (docId) => {
    socket.leave(docId);
    console.log(`User left document: ${docId}`);
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
