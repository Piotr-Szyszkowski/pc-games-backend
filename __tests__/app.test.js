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
  it(`each review objects should have "upvotes" and "downvotes" property which would be a number`, () => {
    return request(app)
      .get("/api/reviews")
      .expect(200)
      .then((response) => {
        const returnedAllReviewArray = response.body.reviews;
        returnedAllReviewArray.forEach((review) => {
          expect(review).toEqual(
            expect.objectContaining({
              upvotes: expect.any(Number),
              downvotes: expect.any(Number),
            })
          );
        });
      });
  });
  it(`Rating - Test 1 - Review objects should have a "rating" property, which would be a number, but default at "1.0" value (Number), between "1.0" and "10" inclusive`, () => {
    return request(app)
      .get("/api/reviews")
      .expect(200)
      .then((response) => {
        const returnedAllReviewArray = response.body.reviews;
        returnedAllReviewArray.forEach((review) => {
          expect(typeof review.rating).toEqual("number");
          expect(review.rating).toBeGreaterThanOrEqual(1.0);
          expect(review.rating).toBeLessThanOrEqual(10);
        });
      });
  });

  it(`Rating - Test 1.1 - rating should represent correctly calculated and formatted number - rating_sum divided by rating_count and displayed as single decimal float. Minimum rating should be 1.0.`, () => {
    return request(app)
      .get("/api/reviews")
      .expect(200)
      .then((response) => {
        const returnedAllReviewArray = response.body.reviews;
        returnedAllReviewArray.forEach((review) => {
          const { rating_count, rating_sum, rating } = review;
          const expectedRating = Number(
            rating_sum === 0
              ? 1.0
              : Number(
                  rating_count === 0 ? 0 : rating_sum / rating_count
                ).toFixed(1)
          );
          expect(rating).toEqual(expectedRating);
        });
      });
  });

  it(`Rating - Test 2 - Review objects should have a "rating_count" property, which would be a number, but default at "0" value (Number), between "0" and infinity`, () => {
    return request(app)
      .get("/api/reviews")
      .expect(200)
      .then((response) => {
        const returnedAllReviewArray = response.body.reviews;
        returnedAllReviewArray.forEach((review) => {
          expect(review.rating_count).toEqual(expect.any(Number));
          expect(review.rating_count).toBeGreaterThanOrEqual(0);
        });
      });
  });
  it(`Rating - Test 2.1 - Rating_count should display correct amount of ratings given`, () => {
    return request(app)
      .get("/api/reviews")
      .expect(200)
      .then((response) => {
        const doomReviewObject = response.body.reviews.filter((review) => {
          if (review.title === `Doom (1993)`) {
            return review;
          }
        })[0];
        expect(doomReviewObject.rating_count).toEqual(6666);
      });
  });
  it(`Rating - Test 3 - Review object should have "rating_sum" property, which would be a number between 0 (inclusive) and infinity`, () => {
    return request(app)
      .get("/api/reviews")
      .expect(200)
      .then((response) => {
        const returnedAllReviewArray = response.body.reviews;
        returnedAllReviewArray.forEach((review) => {
          expect(review.rating_sum).toEqual(expect.any(Number));
          expect(review.rating_sum).toBeGreaterThanOrEqual(0);
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
  it(`Sort by - Test 1 - should accept a "sort by" query, ie. "sort by title", default sort order descending`, () => {
    return request(app)
      .get(`/api/reviews?sort_by=title`)
      .expect(200)
      .then((response) => {
        const returnedAllReviewArray = response.body.reviews;
        expect(returnedAllReviewArray).toBeSortedBy("title", {
          descending: true,
        });
      });
  });
  it(`Sort by - Test 1.1 - should accept a "sort by" query, ie. "sort by title", default sort order descending and be able to order as "ascending" too`, () => {
    return request(app)
      .get(`/api/reviews?sort_by=title&order=asc`)
      .expect(200)
      .then((response) => {
        const returnedAllReviewArray = response.body.reviews;
        expect(returnedAllReviewArray).toBeSortedBy("title");
      });
  });
  it(`Sort by - Test 2 - should accept a "sort by" query, ie. "upvotes", default sort order descending`, () => {
    return request(app)
      .get(`/api/reviews?sort_by=upvotes`)
      .expect(200)
      .then((response) => {
        const returnedAllReviewArray = response.body.reviews;
        expect(returnedAllReviewArray).toBeSortedBy("upvotes", {
          descending: true,
        });
      });
  });
  it(`Sort by - Test 2.1 - should accept a "sort by" query, ie. "upvotes", default sort order descending`, () => {
    return request(app)
      .get(`/api/reviews?sort_by=upvotes&order=asc`)
      .expect(200)
      .then((response) => {
        const returnedAllReviewArray = response.body.reviews;
        expect(returnedAllReviewArray).toBeSortedBy("upvotes");
      });
  });
});

describe(`GET /api/reviews/:review_id`, () => {
  it(`Status: 200 - should return a single review object with matching review_id`, () => {
    return request(app)
      .get(`/api/reviews/3`)
      .expect(200)
      .then((response) => {
        expect(response.body).toEqual({
          review_id: 3,
          title: "Mass Effect",
          cover_img: "https://cdn.gracza.pl/galeria/gry13/grupy/2049.jpg",
          release_date: "2008-05-28",
          category: "RPG",
          review_intro:
            "An action RPG set in the convention of science fiction, developed by the BioWare studio team - authors of such cult titles as Baldur's Gate and Neverwinter Nights.",
          review_body:
            "Mass Effect is an extensive RPG production with numerous elements of an action game, prepared by employees of BioWare studio (creators of the popular and recognized series Baldur's Gate, Neverwinter Nights and Star Wars: Knights of the Old Republic). It is also the first part of a trilogy of games. The action of the game takes place in the year 2183, when humanity spread throughout the galaxy and was forced to cooperate and fight with alien civilizations for its place in the universe. Players assume the role of Commander Shepard, the first human Specter - sworn defender of peace. His main task is to stop the attacking armies of the former agent Saren, who opposed the established order and wants to take revenge on the human race. Together with the entire team under command, players will travel through a series of unknown worlds. During the expedition, they discover that the real threat is much more serious than previously thought...",
          upvotes: 80,
          downvotes: 34,
          rating_count: 4,
          rating_sum: 15,
          rating: 3.8,
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
  it(`Status: 400 and custom message if passed invalid sort_by query`, () => {
    invSortBy = `sortItOut`;
    return request(app)
      .get(`/api/reviews?sort_by=${invSortBy}`)
      .expect(400)
      .then((response) => {
        expect(response.body.message).toBe(
          `You canot sort reviews by ${invSortBy}. Please enter a valid sort_by parameter.`
        );
      });
  });
});
