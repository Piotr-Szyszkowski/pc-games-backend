const express = require("express");
const apiRouter = express.Router();
const sendHelloFromApi = require("../controllers/api-controller.js");

apiRouter.get("/", sendHelloFromApi);

module.exports = apiRouter;
