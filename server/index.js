const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const multer = require("multer");
const morgan = require("morgan");
const http = require("http");
const { Server } = require("socket.io");

const {
  signupController,
  logInController,
  protected,
} = require("./controllers/AuthController");
const {
  setAvatarController,
  uploadImage,
  getAllMyPosts,
  getAllPosts,
  likePost,
  likeCount,
  makeComment,
  getAllComments,
  follow,
  getFollowing,
  getAllFriends,
  getMessages,
  sendMessage,
} = require("./controllers/UserController");
const { Socket } = require("dgram");
dotenv.config({
  path: "config.env",
});
const app = express();

app.use(
  cors({
    origin: "http://localhost:3000",
  })
);

const port = process.env.PORT || 8888;
// const server = http.createServer(app);

const server = app.listen(port);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
  },
});

app.use(morgan("dev"));

app.use(cookieParser());

app.use(express.json());

app.post("/signup", signupController);

app.post("/login", logInController);

app.get("/test", protected, (req, res) => {
  res.send("good");
});

app.post("/set-avatar", protected, setAvatarController);

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "../client/public/images");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = file.originalname.split(".").pop();
    cb(null, file.fieldname + "-" + uniqueSuffix + "." + ext);
  },
});
const upload = multer({ storage });

app.post("/upload-image", upload.single("image"), protected, uploadImage);

app.post("/get-all-my-posts", protected, getAllMyPosts);

app.post("/get-all-posts", protected, getAllPosts);

app.post("/like-post", protected, likePost);

app.post("/like-count", protected, likeCount);

app.post("/make-comment", protected, makeComment);

app.post("/get-all-comments", protected, getAllComments);

app.post("/follow", protected, follow);

app.post("/get-following", protected, getFollowing);

app.post("/get-friends", protected, getAllFriends);

app.post("/get-messages", protected, getMessages);

app.post("/send-message", protected, sendMessage);

io.on("connection", (socket) => {
  socket.on("join", (roomId) => {
    socket.join(roomId);
  });

  socket.on("send", (data) => {
    io.to(data.roomId).emit("back", {
      message: data.message,
      createdAt: data.createdAt,
    });
  });
});

io.on("disconnection", (socket) => {
  io.emit("disconnect");
});
