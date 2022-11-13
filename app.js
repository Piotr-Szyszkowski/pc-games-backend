const cors = require("cors");
const express = require("express");
const apiRouter = require("./routers/api-router");
const app = express();

app.use(express.json());
app.use(cors());
app.use("/api", apiRouter);

module.exports = app;
