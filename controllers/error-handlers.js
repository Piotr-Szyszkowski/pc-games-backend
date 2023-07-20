const handleRouteNotFound = (request, response, next) => {
  response
    .status(404)
    .send({ message: `This is not the page you are looking for` });
};

const handleCustomErrors = (error, request, response, next) => {
  if (error.status && error.message) {
    response.status(error.status).send({ message: error.message });
  }
};

module.exports = { handleRouteNotFound, handleCustomErrors };
