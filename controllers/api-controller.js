const endpoints = require("../all-endpoints");

// console.log(endpoints);

const sendHelloFromApi = (request, response, next) => {
  response.status(200).send({ endpoints });
};

module.exports = sendHelloFromApi;
