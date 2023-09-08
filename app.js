const cors = require("cors");
const express = require("express");
const apiRouter = require("./routers/api-router");
const {
  handleRouteNotFound,
  handleCustomErrors,
  handleInternalServerError,
} = require("./controllers/error-handlers");
const app = express();

app.use(express.json());
app.use(cors());
app.use("/api", apiRouter);

/**************** ERROR HANDLERS BELOW **************/
app.all(`/*`, handleRouteNotFound);
app.use(handleCustomErrors);
app.use(handleInternalServerError);

module.exports = app;
