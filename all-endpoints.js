const endpoints = {};

endpoints[
  "/api"
] = `Main endpoint. Allowed methods: GET - responds with object describing all endpoints for API`;
endpoints["/api//categories"] = `Allowed methods: GET - responds with object describing all review categories`;

module.exports = endpoints;
