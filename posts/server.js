const express = require("express");
const cors = require("cors");
const axios = require("axios");
const app = express();
app.use(express.json());
app.use(cors());
const { randomBytes } = require("crypto");
const posts = {};

app.get("/posts", (req, res) => {
  res.send(posts);
});
app.post("/posts", async (req, res) => {
  console.log(req.body);
  const id = randomBytes(4).toString("hex");
  const { title } = req.body;
  posts[id] = { id, title };
  await axios.post("http://localhost:4005/events", {
    type: "PostCreated",
    data: {
      id,
      title,
    },
  });
  res.status(201).send(posts[id]);
});
app.post("/events", (req, res) => {
  console.log("Received Event,", req.body.type);
  res.send("Event dispatched");
});
app.listen(4000, () => {
  console.log("Listening on 4000");
});
