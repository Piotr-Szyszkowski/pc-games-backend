const sendHelloFromApi = (request, response, next) => {
  response.status(200).send("API sends its regards!");
};

module.exports = sendHelloFromApi;
