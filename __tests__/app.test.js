console.log("*** app.test.js file firing up! ***");

const db = require(`../db/connection.js`);
const app = require("../app.js");
const request = require("supertest");
const testData = require("../db/data/test-data/index");
const seed = require("../db/seeds/seed");
const endpoints = require(`../all-endpoints`);
const allCategories = require("../db/data/test-data/categories");

beforeEach(() => {
  return seed(testData);
});

afterAll(() => {
  return db.end();
});

describe(`GET /api`, () => {
  it(`responds with status: 200 and a JSON describing all the endpoints in the API`, () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then((response) => {
        expect(response.body.endpoints).toEqual(endpoints);
      });
  });
});

describe(`GET /api/categories`, () => {
  it("should return status: 200, and an array of all category objects", () => {
    return request(app)
      .get("/api/categories")
      .expect(200)
      .then((response) => {
        expect(response.body.categories).toEqual(allCategories);
      });
  });
});
