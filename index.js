const express = require("express");
const app = express();
const cors = require("cors");
const { MongoClient } = require("mongodb");

require("dotenv").config();
app.use(cors());
app.use(express.json());

const port = process.env.PORT || 5000;

// create uri
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.bycfb.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

// new client
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// server connection
const server = async () => {
  try {
    await client.connect();
    const database = client.db("lightWars");
    const userCollection = database.collection("users");
    const reviewCollection = database.collection("reviews");
    const sunglassCollection = database.collection("sunglasses");

    // getting all the glasses
    app.get("/glasses/", async (req, res) => {
      const limit = +req.query.limit;

      let result;
      if (limit) {
        result = await sunglassCollection
          .find({})
          .sort({ _id: -1 })
          .limit(limit)
          .toArray();
      } else {
        result = await sunglassCollection.find({}).toArray();
      }

      res.json(result);
    });

    // get all reviews
    app.get("/reviews", async (req, res) => {
      const result = await reviewCollection.find({}).toArray();

      res.json(result);
    });

    // add a review
    app.post("/review", async (req, res) => {
      const review = req.body;

      const result = await reviewCollection.insertOne(review);
      res.send(result);
    });

    //
    console.log("Light Wars database is connected");
  } finally {
    // await client.close();
  }
};
server().catch(console.dir);

// getting server
app.get("/", (req, res) => {
  console.log("Light Wars's Server is running on", port);
  res.send("Welcome to Light Wars server!");
});

// running server on port
app.listen(port, () => {
  console.log(`Light Wars is running on http://localhost:${port}/`);
});
