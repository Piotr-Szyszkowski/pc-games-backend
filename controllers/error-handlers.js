const handleInternalServerError = (error, request, response, next) => {
  response.status(500).send({
    error: `Oops! Something unexpected happened on our end. Our team has been notified, and we're actively working to fix the issue. Please try again later. Thank you for your understanding and patience and may the Force be with you.`,
  });
};

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

module.exports = {
  handleInternalServerError,
  handleRouteNotFound,
  handleCustomErrors,
};
