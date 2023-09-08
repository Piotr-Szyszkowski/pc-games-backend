const db = require(`../db/connection.js`);
const app = require("../app.js");
const request = require("supertest");
const testData = require("../db/data/test-data/index");
const seed = require("../db/seeds/seed");
const endpoints = require(`../all-endpoints`);
const allCategories = require("../db/data/test-data/categories");
const dateAndTimeRegEx = /^(\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2})$/;

beforeEach(() => {
  return seed(testData);
});

afterAll(() => {
  return db.end();
});

describe(`API - GET /api`, () => {
  it(`responds with status: 200 and a JSON describing all the endpoints in the API`, () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then((response) => {
        expect(response.body.endpoints).toEqual(endpoints);
      });
  });
});

describe(`CATEGORIES - GET /api/categories`, () => {
  it("should return status: 200, and an array of all category objects", () => {
    return request(app)
      .get("/api/categories")
      .expect(200)
      .then((response) => {
        expect(response.body.categories).toEqual(allCategories);
      });
  });
});

describe("REVIEWS - GET /api/reviews", () => {
  it("should respond with status:200, and should respond with an array review objects each of which should have following properties:review_id, title, release_date, category, review_intro, review_body", () => {
    return request(app)
      .get("/api/reviews")
      .expect(200)
      .then((response) => {
        const returnedAllReviewArray = response.body.reviews;
        expect(returnedAllReviewArray).toBeInstanceOf(Array);
        expect(returnedAllReviewArray).toHaveLength(7);
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
              comment_count: expect.any(Number),
            })
          );
        });
      });
  });

  it(`each review objects should have comment count property, which would represent up-to-date number of comments for given title`, () => {
    return request(app)
      .get("/api/reviews")
      .expect(200)
      .then((response) => {
        const reviewForMassEffect1 = response.body.reviews[2];
        expect(reviewForMassEffect1.comment_count).toBe(3);
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
                  rating_count === 0 ? 1.0 : rating_sum / rating_count
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
          // console.log(`Rating sum type is: ${typeof review.rating_sum}`);
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
  it(`"Category" query - Should accept a "category" query that would only display games of given category`, () => {
    return request(app)
      .get(`/api/reviews?category=RPG`)
      .expect(200)
      .then((response) => {
        const returnedAllReviewArray = response.body.reviews;
        returnedAllReviewArray.forEach((review) => {
          expect(review.category).toBe("RPG");
        });
      });
  });
  it(`Should accept joint "category", "sort_by" and "order" queries`, () => {
    return request(app)
      .get(`/api/reviews?category=FPS&sort_by=rating&order=asc`)
      .expect(200)
      .then((response) => {
        const returnedAllReviewArray = response.body.reviews;
        returnedAllReviewArray.forEach((review) => {
          expect(review.category).toBe("FPS");
        });
        expect(returnedAllReviewArray).toBeSortedBy("rating", {
          descending: false,
        });
      });
  });
});

describe(`REVIEW - GET /api/reviews/:review_id`, () => {
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
          comment_count: 3,
        });
      });
  });
});

describe(`REVIEW UPVOTE-DOWNVOTE-RATE - PATCH /api/reviews/:review_id`, () => {
  it(`Upvote - Test 1 - Status: 200, should accept an object in the form {upvote: true} and increase the number of upvotes for the review by one. Should respond with complete review object updated with new upvote. The returned object should include comment_count.`, () => {
    return request(app)
      .patch(`/api/reviews/4`)
      .send({ upvote: true })
      .expect(200)
      .then((response) => {
        expect(response.body.review).toEqual({
          review_id: 4,
          title: "Duke Nukem 3D",
          cover_img: "https://cdn.gracza.pl/galeria/gry13/grupy/1439.jpg",
          release_date: "1996-05-13",
          category: "FPS",
          review_intro:
            "One of the most famous first-person shooters and at the same time the third installment of the series about the adventures of an arrogant hero. The title focuses on dynamics and effectiveness, while also serving a lot of humor.",
          review_body:
            "Duke Nukem 3D is the third part of the series about an amazing prince fighting criminals, mafias and even terrifying aliens from outer space. Compared to the previous parts, made entirely in 2D, the game is a breakthrough, transferring the gameplay to a fully three-dimensional graphical environment and introducing the possibility of multiplayer games.",
          upvotes: 99,
          downvotes: 51,
          rating_count: 0,
          rating_sum: 0,
          rating: 1.0,
          comment_count: 1,
        });
      });
  });
  it(`Downvote - Test 1 - Status: 200, should accept an object in the form {downvote: true} and increase the number of downvotes for the review by one. Should respond with complete review object updated with new downvote. The returned object should include comment_count.`, () => {
    return request(app)
      .patch(`/api/reviews/2`)
      .send({ downvote: true })
      .expect(200)
      .then((response) => {
        expect(response.body.review).toEqual({
          review_id: 2,
          title: "Max Payne",
          cover_img: "https://cdn.gracza.pl/galeria/gry13/grupy/875.jpg",
          release_date: "2001-07-26",
          category: "Action",
          review_intro:
            "Max Payne is an action game with a third person perspective (TPP), created by the Finnish studio Remedy Entertainment.",
          review_body:
            "Max Payne for PC, PS4, etc. is a third-person action thriller game. Remedy Entertainment, a studio from Finland, previously known mainly for the arcade racing game Death Rally from 1996, is responsible for creating the title. The original version of the game debuted in 2001 on PCs and sixth-generation consoles, and two years later, thanks to Mobius Entertainment, it received a greatly simplified conversion to the portable Game Boy Advance console. Eleven years after the premiere of the original, Max Payne Mobile, developed by the War Drum studio team, hit popular mobile devices, offering refreshed graphics, upgraded to HD standards. In the same year, as part of the PS2 Classics service, a digital re-edition of the original game from 2001 was made available to users of PlayStation 3 consoles. In spring 2016, Max Payne also went to PlayStation 4 owners, enriched with trophy support and graphics scaled to 1080p.",
          upvotes: 7,
          downvotes: 63,
          rating_count: 2,
          rating_sum: 3,
          rating: 1.5,
          comment_count: 0,
        });
      });
  });
  it(`SubmitRating - Test 1 - Status: 200, should accept an object in the form like {givenRating: 7.5} and add it to the rating_sum and increment rating_count by 1, from which then rating is calculated. Should then return a review object with updated rating.`, () => {
    return request(app)
      .patch(`/api/reviews/3`)
      .send({ givenRating: 7.5 })
      .expect(200)
      .then((response) => {
        expect(response.body.review).toEqual({
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
          rating_count: 5,
          rating_sum: 22.5,
          rating: 4.5,
        });
      });
  });
});

describe(`COMMENTS - GET /api/reviews/:review_id/comments`, () => {
  it(`Test 1.0 - status: 200, should respond with an array of comments (objects) for the given review_id. Each comment should have the following key-value pairs: comment_id, review_id (game it belongs to), created_by, created_at and body.`, () => {
    return request(app)
      .get(`/api/reviews/1/comments`)
      .expect(200)
      .then((response) => {
        const { comments: commentsFromAPI } = response.body;

        expect(commentsFromAPI).toBeInstanceOf(Array);
        expect(commentsFromAPI).toHaveLength(2);
        commentsFromAPI.forEach((commentObject) => {
          expect(commentObject).toEqual(
            expect.objectContaining({
              comment_id: expect.any(Number),
              review_id: expect.any(Number),
              created_by: expect.any(String),
              body: expect.any(String),
              created_at: expect.stringMatching(dateAndTimeRegEx),
            })
          );
        });
      });
  });
});

describe(`COMMENTS - POST /api/reviews/:review_id/comments`, () => {
  it(`Test 1.0 - status 201, request body accepts new comment's username (author) and body, and responds with the posted comment`, () => {
    const newMaxPayneComment = {
      username: `ToryTiller`,
      comment_body: `Max Payne 1 was a fantastic game that captivated me with its gripping noir storyline and innovative bullet-time mechanics. The dark atmosphere and gritty narrative kept me engaged throughout the experience. However, playing it now, the outdated graphics and clunky controls remind me of its age. `,
    };
    return request(app)
      .post(`/api/reviews/2/comments`)
      .send(newMaxPayneComment)
      .expect(201)
      .then((response) => {
        // const addedComment = response.body.comment;
        const { comment_id, review_id, created_by, body, created_at } =
          response.body.comment;
        expect(comment_id).toBe(7);
        expect(review_id).toBe(2);
        expect(created_by).toBe(`ToryTiller`);
        expect(body).toEqual(newMaxPayneComment.comment_body);
        expect(created_at).toMatch(dateAndTimeRegEx);
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

  it(`Status: 404 and custom message when passed category does not exist in database`, async () => {
    const nonexistentCategory1 = "water-pinball";
    const nonexistentCategory2 = "bazookas";
    const response1 = await request(app).get(
      `/api/reviews?category=${nonexistentCategory1}`
    );
    const response2 = await request(app).get(
      `/api/reviews?category=${nonexistentCategory2}`
    );
    expect(response1.status).toBe(404);
    expect(response2.status).toBe(404);
    expect(response1.body.message).toBe(
      `The ${nonexistentCategory1} category does not exist in our database. Please try another one.`
    );
    expect(response2.body.message).toBe(
      `The ${nonexistentCategory2} category does not exist in our database. Please try another one.`
    );
  });

  it(`Status:404 and custom message when passed category does not match any reviews in the database`, async () => {});

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
