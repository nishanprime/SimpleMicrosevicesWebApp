const express = require("express");
const axios = require("axios");
const app = express();
app.use(express.json());

app.post("/events", async (req, res) => {
  const { type, data } = req.body;
  if (type == "CommentCreated") {
    const status = data.content.includes("orange") ? "rejected" : "approved";
    await axios.post("http://localhost:4005/events", {
      type: "CommentModerated",
      data: {
        ...data,
        status,
      },
    });
  }
  res.send({message:"Moderated comment sent to Event-Bus"})
});

app.listen(4003, () => {
  console.log("Moderating service: listening on port 4003");
});
