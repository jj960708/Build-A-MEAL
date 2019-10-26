const express = require("express");
const router = require("express").Router();
const cors = require("cors");
const mongoose = require("mongoose");
const cookieParser = require('cookie-parser');
const withAuth = require('./middleware/auth');
require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;
app.use(cors());
app.options('*', cors());
app.use(express.json());
const uri = process.env.ATLAS_URI;
console.log(uri);
mongoose.connect(
  uri,
  { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true },
  function(error) {
    console.log(error);
  }
);
const connection = mongoose.connection;
connection.once("open", () => {
  console.log("MongoDB database connection established successfully!");
});

// Middleware
app.use(cookieParser());
app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.header('Access-Control-Allow-Headers', 'Origin, Content-Type, Accept');
  res.header('Access-Control-Allow-Credentials', true);
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  next();
});
app.use(express.json({ extended: false }));
app.get("/", (req, res) => res.send("API running"));
app.get('/checkToken', withAuth, (req, res) => res.sendStatus(200));
app.use("/api/users", require("./routes/users"));
app.use("/api/auth", require("./routes/auth"));
app.use('/ingredients', require("./routes/ingredients"));
app.use('/api/inventory', require("./routes/inventory"));

app.listen(port, () => {
  //console.log(`Server is running on port: ${port}`);
});
