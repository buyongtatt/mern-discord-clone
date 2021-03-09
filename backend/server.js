import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import mongoData from "./mongoData.js";
import Pusher from "pusher";

// app config
const app = express();
const port = process.env.PORT || 8002;

const pusher = new Pusher({
  appId: "1168894",
  key: "77f2ebac2fe329128b70",
  secret: "48c144742cec398f69be",
  cluster: "ap1",
  useTLS: true,
});

// middleware
app.use(express.json());
app.use(cors());

// db config
const MONGOOSE_URI =
  "mongodb+srv://buyongtatt:gl5tnQ9t8j1QWYuH@cluster0.sckr1.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";

mongoose.connect(MONGOOSE_URI, {
  useCreateIndex: true,
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.connection.once("open", () => {
  console.log("DB Connected");

  const changeStream = mongoose.connection.collection("conversations").watch();

  changeStream.on("change", (change) => {
    if (change.operationType === "insert") {
      pusher.trigger("channels", "newChannel", {
        change: change,
      });
    } else if (change.operationType === "update") {
      pusher.trigger("conversation", "newMessage", {
        change: change,
      });
    } else {
      console.log("Error triggering Pusher");
    }
  });
});

// api routes
app.get("/", (req, res) => {
  res.status(200).send("Hello World");
});

app.post("/new/channel", (req, res) => {
  const dbData = req.body;

  mongoData.create(dbData, (err, data) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(201).send(data);
    }
  });
});

app.get("/get/channelList", (req, res) => {
  mongoData.find((err, data) => {
    if (err) {
      res.status(500).send(err);
    } else {
      let channels = [];

      data.map((channelData) => {
        const channelInfo = {
          id: channelData._id,
          name: channelData.channelName,
        };
        channels.push(channelInfo);
      });

      res.status(200).send(data);
    }
  });
});

app.post("/new/message", (req, res) => {
  const newMessage = req.body;

  mongoData.update(
    { _id: req.query.id },
    { $push: { conversation: req.body } },
    (err, data) => {
      if (err) {
        res.status(500).send(err);
      } else {
        res.status(201).send(data);
      }
    }
  );
});

app.get("/get/data", (req, res) => {
  mongoData.find((err, data) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(200).send(data);
    }
  });
});

app.get("/get/conversation", (req, res) => {
  const id = req.query.id;

  mongoData.find({ _id: id }, (err, data) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(200).send(data);
    }
  });
});

// listener
app.listen(port, () => console.log(`Listening on port: ${port}`));
