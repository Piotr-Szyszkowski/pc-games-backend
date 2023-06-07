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

describe("GET /api/reviews", () => {
  it("should respond with status:200, and should respond with an array review objects each of which should have following properties:review_id, title, release_date, category, review_intro, review_body", () => {
    return request(app)
      .get("/api/reviews")
      .expect(200)
      .then((response) => {
        const returnedAllReviewArray = response.body.reviews;
        expect(returnedAllReviewArray).toBeInstanceOf(Array);
        expect(returnedAllReviewArray).toHaveLength(6);
        returnedAllReviewArray.forEach((review) => {
          const dateRegex = /^(\d{4}-\d{2}-\d{2})$/;
          expect(review).toEqual(
            expect.objectContaining({
              review_id: expect.any(Number),
              title: expect.any(String),
              release_date: expect.stringMatching(dateRegex),
              category: expect.any(String),
              review_intro: expect.any(String),
              review_body: expect.any(String),
            })
          );
        });
      });
  });
  it('should respond with array by default sorted by "release_date" descending - newest first', () => {
    return request(app)
      .get("/api/reviews")
      .expect(200)
      .then((response) => {
        const returnedAllReviewArray = response.body.reviews;
        expect(returnedAllReviewArray).toBeSortedBy("release_date", {
          descending: true,
        });
      });
  });
  it('should accept an "order" query, determining ascending or descending sorting', () => {
    return request(app)
      .get("/api/reviews?order=asc")
      .expect(200)
      .then((response) => {
        const returnedAllReviewArray = response.body.reviews;
        expect(returnedAllReviewArray).toBeSortedBy("release_date", {
          descending: false,
        });
      });
  });
});

/*********** ERROR HANDLERS ************/

describe(`ERRORS: Non-existent routes`, () => {
  it(`Test 1 - GET /lukeskywalker ---> status 404 and appropriate message`, () => {
    return request(app)
      .get(`/lukeskywalker`)
      .expect(404)
      .then((response) => {
        expect(response.body.message).toBe(
          `This is not the page you are looking for`
        );
      });
  });
});

describe(`ERRORS: GET /api/reviews`, () => {
  it(`Status: 400 and custom message if passed invalid order query`, () => {
    const invOrder = `neworder`;
    return request(app)
      .get(`/api/reviews?order=${invOrder}`)
      .expect(400)
      .then((response) => {
        expect(response.body.message).toBe(
          `Invalid <order> format. Please enter <asc> for ascending, or <desc> for descending.`
        );
      });
  });
});
