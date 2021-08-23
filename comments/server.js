const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use(express.json());
app.use(cors());
const { randomBytes } = require("crypto");
const commentsByPostId = {};

app.get("/posts/:id/comments", (req, res) => {
  res.send(commentsByPostId[req.params.id] || []);
});
app.post("/events", async (req, res) => {
  const { type, data } = req.body;
  if (type == "CommentModerated") {
    const { postId, id, status } = data;
    const comments = commentsByPostId[postId];
    const comment = comments.find((comment) => {
      return comment.id === id;
    });
    comment.status = status;
    await axios.post("http://localhost:4005/events", {
      type: "CommentUpdated",
      data: {
        ...data,
        status,
      },
    });
  }
  console.log("Received Event,", req.body.type);
  res.send("Event dispatched");
});
app.post("/posts/:id/comments", async (req, res) => {
  const commentId = randomBytes(4).toString("hex");
  const { content } = req.body;
  const comments = commentsByPostId[req.params.id] || [];
  comments.push({ id: commentId, content, status: "pending" });
  commentsByPostId[req.params.id] = comments;
  await axios
    .post("http://localhost:4005/events", {
      type: "CommentCreated",
      data: {
        id: commentId,
        content,
        postId: req.params.id,
        status: "pending",
      },
    })
    .catch((e) => console.log(e.message));
  res.status(201).send(comments);
});

app.listen(4001, () => {
  console.log("listening");
});
