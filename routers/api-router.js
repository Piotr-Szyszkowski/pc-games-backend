const express = require("express");
const apiRouter = express.Router();
const categoriesRouter = require("./categories-router");
const sendHelloFromApi = require("../controllers/api-controller.js");

apiRouter.get("/", sendHelloFromApi);
apiRouter.use("/categories", categoriesRouter);

module.exports = apiRouter;
