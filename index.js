const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const Config = require("./config");
const Router = require("./router/routes");
const mongoose = require("mongoose");
require("dotenv").config();

const port = Config.port || 3000;
app.use(cors("*"));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

mongoose
  .connect(process.env.URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });

app.use("/todo", Router);

app.listen(port, (res) => {
  console.log(`App listening on port ${port}`);
});
