const express = require("express");
const router = require("express").Router();
const cors = require("cors");
const mongoose = require("mongoose");

require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
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
app.use(express.json({ extended: false }));

app.get("/", (req, res) => res.send("API running"));
app.use("/api/users", require("./routes/users"));
app.use("/api/auth", require("./routes/auth"));
app.use('/ingredients', require("./routes/ingredients"));

app.listen(port, () => {
  //console.log(`Server is running on port: ${port}`);
});
