const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectId;
const express = require("express");
const bodyParser = require("body-parser");
const dotenv = require('dotenv');
dotenv.config();

const app = express();


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
const cors = require('cors');
app.use(cors());

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, access_token"
  );
  next();
});


// const uri = 'mongodb+srv://kulkarnidhirubhai:Dhirubhai@mymongodb.hncsx9e.mongodb.net/mymongodb?retryWrites=true&w=majority';
const client = new MongoClient(process.env.MONGODB_CONNECT_URI, { useNewUrlParser: true, useUnifiedTopology: true });



var server = require("http").createServer(app)



app.get("/", async (req, res) => {
  try {
    const dbConnection = await client.connect();
    res.status(200).send("Success");
  } catch (error) {
    res.status(500).send("Failed");
  }
});


app.get("/getUserData/:page/:rowsPerPage", async (req, res) => {
  try {
    const dbConnection = await client.connect();
    const db = await dbConnection.db("CodingChallenge");
    const users = await db.collection("Users");
    const usersList = await users.find().skip(parseInt(req.params.page)).limit(parseInt(req.params.rowsPerPage)).toArray();
    let count = await users.find().count()
    let data = {
      count,
      usersList
    }
    res.status(200).send(data);
  } catch (error) {
    res.status(500).send("Failed");
  }

});


app.post("/addUser", async (req, res) => {
  try {
    const dbConnection = await client.connect();
    const db = await dbConnection.db("CodingChallenge");
    const users = await db.collection("Users");
    let newDocument = req.body;
    newDocument.DOB = new Date(req.body.DOB);
    let result = await users.insertOne(newDocument);
    res.status(200).send("Success");
  } catch (error) {
    res.status(500).send("Failed");
  }
});

// Update the post with a new comment
app.post("/ediUser/:id", async (req, res) => {
  try {
    const dbConnection = await client.connect();
    const db = await dbConnection.db("CodingChallenge");
    const users = await db.collection("Users");
    await users.updateOne({ _id: new ObjectID(req.params.id) },
      {
        $set: {
          "Name": req.body.Name,
          "Email": req.body.Email,
          "Phone": req.body.Phone,
          "Gender": req.body.Gender,
          "DOB": new Date(req.body.DOB),
        }
      })
    res.status(200).send("Success");
  } catch (error) {
    res.status(500).send("Failed");
  }
});


// Emit event when a task is fetched
app.delete("/deleteUser/:id", async (req, res) => {
  try {
    const dbConnection = await client.connect();
    const db = await dbConnection.db("CodingChallenge");
    const users = await db.collection("Users");
    const result = await users.deleteOne({ _id: new ObjectID(req.params.id) })
    res.status(200).send("Success");
  } catch (error) {
    res.status(500).send("Failed");
  }
});

server.listen(process.env.PORT, () => console.log(`listening on port 4000...`));

module.exports = app;
