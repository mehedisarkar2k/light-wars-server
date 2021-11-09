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
console.log(uri);

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
