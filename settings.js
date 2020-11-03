

const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const Joi = require('@hapi/joi');
const routes = require('./routes');


const app = express();

var corsOptions = {
  origin: "http://localhost:8081"
};

app.use(cors(corsOptions));


const db = require("./models");
db.sequelize.sync();

// parse requests of content-type - application/json
app.use(bodyParser.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

routes(app);

// simple route
app.get("/PING", (req, res) => {
  res.json({ message: "Welcome to bezkoder application." });
});



// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
