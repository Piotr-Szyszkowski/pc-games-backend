const endpoints = require("../all-endpoints");

const sendHelloFromApi = (request, response, next) => {
  // response.status(200).send({ endpoints });
  response.status(200).send("random something");
};

module.exports = sendHelloFromApi;
