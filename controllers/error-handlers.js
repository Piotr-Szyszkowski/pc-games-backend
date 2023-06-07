const handleRouteNotFound = (request, response, next) => {
  response
    .status(404)
    .send({ message: `This is not the page you are looking for` });
};

module.exports = { handleRouteNotFound };
