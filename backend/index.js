const express = require("express");
const winston = require("winston");
const app = express();
const cors = require("cors");

app.use(cors());
require("./startup/logging")();
require("./startup/routes")(app);
require("./startup/db")();
require("./startup/config")();
require("./startup/validation")();

app.listen(3000, () => winston.info("Listening on port 3000..."));
