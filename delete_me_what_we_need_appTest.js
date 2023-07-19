const db = require(`../db/connection`);
const app = require("../app.js");
const request = require("supertest");
const testData = require("../db/data/test-data/index");
const seed = require("../db/seeds/seed");
const endpoints = require(`../all-endpoints`);
beforeEach(() => {
  return seed(testData);
});

afterAll(() => {
  return db.end();
});

// describe(`GET /api`, () => {
//   it(`responds with status:200 and a JSON object describing all endpoints within API`, () => {
//     return request(app)
//       .get("/api")
//       .expect(200)
//       .then((response) => {
//         expect(response.body.endpoints).toEqual(endpoints);
//       });
//   });
// });

// describe(`GET /api/categories`, () => {
//   it(`returns status: 200, responds with a 'categories' array of all categories objects`, () => {
//     return request(app)
//       .get("/api/categories")
//       .expect(200)
//       .then((response) => {
//         expect(response.body.categories).toBeInstanceOf(Array);
//         expect(response.body.categories).toHaveLength(4);
//       });
//   });
//   it(`responds with an array of objects displaying required properties`, () => {
//     return request(app)
//       .get("/api/categories")
//       .expect(200)
//       .then((response) => {
//         const categoriesArray = response.body.categories;
//         categoriesArray.forEach((category) => {
//           expect(category).toEqual(
//             expect.objectContaining({
//               slug: expect.any(String),
//               description: expect.any(String),
//             })
//           );
//         });
//       });
//   });
//   it(`responds with an array of correct objects`, () => {
//     return request(app)
//       .get("/api/categories")
//       .expect(200)
//       .then((response) => {
//         expect(response.body.categories[2]).toEqual({
//           slug: "dexterity",
//           description: "Games involving physical skill",
//         });
//       });
//   });
// });
describe(`GET /api/reviews`, () => {
  it(`status:200, responds with arrray of review object, each which should have
      the following properties: owner which is the username from the users table, 
      title, review_id, review_body, designer, review_img_url, category, created_at,
      votes`, () => {
    return request(app)
      .get(`/api/reviews`)
      .expect(200)
      .then((response) => {
        const returnedAllReviewArray = response.body.reviews;
        expect(returnedAllReviewArray).toBeInstanceOf(Array);
        expect(returnedAllReviewArray).toHaveLength(13);
        returnedAllReviewArray.forEach((review) => {
          expect(review).toEqual(
            expect.objectContaining({
              owner: expect.any(String),
              title: expect.any(String),
              review_id: expect.any(Number),
              designer: expect.any(String),
              category: expect.any(String),
              created_at: expect.any(String),
              votes: expect.any(Number),
            })
          );
        });
      });
  });
  it(`status:200, responds with arrray of review object, each which should have
      comment_count property`, () => {
    return request(app)
      .get(`/api/reviews`)
      .expect(200)
      .then((response) => {
        const returnedAllReviewArray = response.body.reviews;
        returnedAllReviewArray.forEach((review) => {
          expect(review).toHaveProperty(`comment_count`);
          expect(review.comment_count).not.toBe(undefined);
        });

        expect(returnedAllReviewArray[4].comment_count).toBe(`3`);
      });
  });
  it(`response array by default is sorted descending by date - "created_at"`, () => {
    return request(app)
      .get(`/api/reviews`)
      .expect(200)
      .then((response) => {
        const returnedAllReviewArray = response.body.reviews;
        expect(returnedAllReviewArray).toBeSortedBy(`created_at`, {
          descending: true,
        });
      });
  });
  it(`test 1 - should accept a "sort_by" query`, () => {
    return request(app)
      .get(`/api/reviews?sort_by=designer`)
      .expect(200)
      .then((response) => {
        const returnedAllReviewArray = response.body.reviews;
        expect(returnedAllReviewArray).toBeSortedBy(`designer`, {
          descending: true,
        });
      });
  });
  it(`test 2 - should accept a "sort_by" query`, () => {
    return request(app)
      .get(`/api/reviews?sort_by=votes`)
      .expect(200)
      .then((response) => {
        const returnedAllReviewArray = response.body.reviews;
        expect(returnedAllReviewArray).toBeSortedBy(`votes`, {
          descending: true,
        });
      });
  });
  it(`should accept an "order" query, determining ascending
      or descending sorting`, () => {
    return request(app)
      .get(`/api/reviews?order=asc`)
      .expect(200)
      .then((response) => {
        const returnedAllReviewArray = response.body.reviews;
        expect(returnedAllReviewArray).toBeSortedBy(`created_at`, {
          descending: false,
        });
      });
  });
  it(`should accept combined "sort_by" and "order" queries`, () => {
    return request(app)
      .get(`/api/reviews?sort_by=designer&order=asc`)
      .expect(200)
      .then((response) => {
        const returnedAllReviewArray = response.body.reviews;
        expect(returnedAllReviewArray).toBeSortedBy(`designer`, {
          descending: false,
        });
      });
  });
  it(`should accept category query, that would only allow display of given
      game category`, () => {
    return request(app)
      .get(`/api/reviews?category=social deduction`)
      .expect(200)
      .then((response) => {
        const returnedAllReviewArray = response.body.reviews;
        expect(returnedAllReviewArray).toHaveLength(11);
        returnedAllReviewArray.forEach((review) => {
          expect(review.category).toBe(`social deduction`);
        });
      });
  });
  it(`should accept combined "category", "sort_by" and "order" queries`, () => {
    return request(app)
      .get(`/api/reviews?category=social deduction&sort_by=designer&order=asc`)
      .expect(200)
      .then((response) => {
        const returnedAllReviewArray = response.body.reviews;
        expect(returnedAllReviewArray).toHaveLength(11);
        returnedAllReviewArray.forEach((review) => {
          expect(review.category).toBe(`social deduction`);
          expect(returnedAllReviewArray).toBeSortedBy(`designer`, {
            descending: false,
          });
        });
      });
  });
});

describe(`GET /api/reviews/:review_id`, () => {
  it(`status: 200, responds with a review object with requested ID and he following properties: owner which is 
      the username from the users table, title, review_id, review_body, designer, review_img_url, 
      category, created_at, votes, comment_count which is the total count of all the comments with 
      this review_id`, () => {
    return request(app)
      .get(`/api/reviews/2`)
      .expect(200)
      .then((response) => {
        expect(response.body).toEqual({
          review: {
            review_id: 2,
            title: "Jenga",
            designer: "Leslie Scott",
            owner: "philippaclaire9",
            review_body: "Fiddly fun for all the family",
            category: "dexterity",
            created_at: `2021-01-18T10:01:41.251Z`,
            votes: 5,
            review_img_url:
              "https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png",
            comment_count: "3",
          },
        });
      });
  });
});

describe(`PATCH /api/reviews/:review_id`, () => {
  it(`status:200, accepts an object in the form { inc_votes: newVote }, newVote indicates
      how much the votes property in the database should be updated by, responds with complete 
      review object (updated) inclusive of comment count`, () => {
    return request(app)
      .patch(`/api/reviews/13`)
      .send({ inc_votes: 5 })
      .expect(200)
      .then((response) => {
        expect(response.body.review).toEqual({
          review_id: 13,
          title: "Settlers of Catan: Don't Settle For Less",
          designer: "Klaus Teuber",
          owner: "mallionaire",
          review_body:
            "You have stumbled across an uncharted island rich in natural resources, but you are not alone; other adventurers have come ashore too, and the race to settle the island of Catan has begun! Whether you exert military force, build a road to rival the Great Wall, trade goods with ships from the outside world, or some combination of all three, the aim is the same: to dominate the island. Will you prevail? Proceed strategically, trade wisely, and may the odds be in favour.",
          category: "social deduction",
          created_at: "1970-01-10T02:08:38.400Z",
          votes: 21,
          comment_count: "0",
          review_img_url: `https://images.pexels.com/photos/163064/play-stone-network-networked-interactive-163064.jpeg`,
        });
      });
  });
});

describe(`GET /api/reviews/:review_id/comments`, () => {
  it(`test 1 - status:200, responds with an array of comments for the given review_id of which each comment should have 
      the following properties: comment_id, votes, created_at, author - which is the username from the users 
      table, and body`, () => {
    return request(app)
      .get(`/api/reviews/2/comments`)
      .expect(200)
      .then((response) => {
        const commentArray = response.body.comments;
        expect(commentArray).toHaveLength(3);
        commentArray.forEach((commentObj) => {
          expect(commentObj).toEqual(
            expect.objectContaining({
              comment_id: expect.any(Number),
              votes: expect.any(Number),
              created_at: expect.any(String),
              author: expect.any(String),
              body: expect.any(String),
            })
          );
        });
      });
  });
  it(`test 2 - status:200, responds with an array of comments for the given review_id(...)`, () => {
    return request(app)
      .get(`/api/reviews/3/comments`)
      .expect(200)
      .then((response) => {
        const commentArray = response.body.comments;
        const secondComment = commentArray[1];
        expect(secondComment.comment_id).toBe(3);
        expect(secondComment.votes).toBe(10);
        expect(secondComment.author).toBe(`philippaclaire9`);
        expect(secondComment.body).toBe(`I didn't know dogs could play games`);
      });
  });
});

describe(`POST /api/reviews/:review_id/comments`, () => {
  it(`status:201, request body accepts username and comment body, responds with the posted comment`, () => {
    const scytheComment = {
      username: `dav3rid`,
      comment_body: `1920s, Eastern Europe and Mechs! What is there not to like!!`,
    };
    return request(app)
      .post(`/api/reviews/12/comments`)
      .send(scytheComment)
      .expect(201)
      .then((response) => {
        const addedComment = response.body.comment;
        expect(addedComment.comment_id).toBe(7);
        expect(addedComment.author).toBe(`dav3rid`);
        expect(addedComment.review_id).toBe(12);
        expect(addedComment.votes).toBe(0);
        expect(addedComment.body).toBe(
          `1920s, Eastern Europe and Mechs! What is there not to like!!`
        );
        expect(addedComment.created_at).not.toBe(undefined);
      });
  });
});

describe(`ERRORS: Non-existant routes`, () => {
  it(`Test 1 - GET /csi --> status 404 and message`, () => {
    return request(app)
      .get(`/csi`)
      .expect(404)
      .then((response) => {
        expect(response.body.message).toBe(
          "This is not the route you want to follow"
        );
      });
  });
  it(`Test 2 - GET /api/sthelse --> status 404 and message`, () => {
    return request(app)
      .get(`/api/sthelse`)
      .expect(404)
      .then((response) => {
        expect(response.body.message).toBe(
          "This is not the route you want to follow"
        );
      });
  });
});

describe(`ERRORS: GET /api/reviews`, () => {
  it(`status: 400 and message if passed an invalid sort_by query`, () => {
    const invSort = `horsepower`;
    return request(app)
      .get(`/api/reviews?sort_by=${invSort}`)
      .expect(400)
      .then((response) => {
        expect(response.body.message).toBe(
          `You cannot sort reviews by ${invSort}!!`
        );
      });
  });
  it(`status: 400 and message if passed an invalid order query`, () => {
    const invOrder = `ascending`;
    return request(app)
      .get(`/api/reviews?order=${invOrder}`)
      .expect(400)
      .then((response) => {
        expect(response.body.message).toBe(
          `Invalid <order> format. Please enter <asc> for ascending, or <desc> for descending.`
        );
      });
  });
  it(`status: 404 and message if passed category that does not exist in database`, () => {
    const nonexistantCategory = `VR Puzzle Simulation with Samurai Swords`;
    return request(app)
      .get(`/api/reviews?category=${nonexistantCategory}`)
      .expect(404)
      .then((response) => {
        expect(response.body.message).toBe(
          `Category ${nonexistantCategory} does not exist in our database. Please try another one.`
        );
      });
  });
  it(`status: 404 and message if passed category that exists but does not match any reviews`, () => {
    const noMatchCategory = `children's games`;
    return request(app)
      .get(`/api/reviews?category=${noMatchCategory}`)
      .expect(404)
      .then((response) => {
        expect(response.body.message).toBe(
          `Category ${noMatchCategory} does not match any reviews in our database. Please try another one.`
        );
      });
  });
});

describe(`ERRORS: GET /api/reviews/:review_id`, () => {
  it(`status:400 and message if passed with invalid id`, () => {
    const invalidId = `banana`;
    return request(app)
      .get(`/api/reviews/${invalidId}`)
      .expect(400)
      .then((response) => {
        expect(response.body.message).toBe(
          `Unfortunately ${invalidId} is not a valid ID, please use an integer.`
        );
      });
  });
  it(`status:404, responds with message, when passed with id of review that does not exist in database`, () => {
    const nonexistantId = `666`;
    return request(app)
      .get(`/api/reviews/${nonexistantId}`)
      .expect(404)
      .then((response) => {
        expect(response.body.message).toBe(
          `Review ID ${nonexistantId} does not exist in our database.`
        );
      });
  });
});

describe(`ERRORS: PATCH /api/reviews/:review_id`, () => {
  it(`Test 1 - status:400 and message if no "inc_votes" on request body`, () => {
    return request(app)
      .patch(`/api/reviews/6`)
      .expect(400)
      .then((response) => {
        expect(response.body.message).toBe(
          "Cannot update votes, as no votes provided!"
        );
      });
  });
  it(`Test 2 - status:400 and message if no "inc_votes" on request body`, () => {
    return request(app)
      .patch(`/api/reviews/6`)
      .send({})
      .expect(400)
      .then((response) => {
        expect(response.body.message).toBe(
          "Cannot update votes, as no votes provided!"
        );
      });
  });
  it(`Test 1 - status:400 and message if "inc_votes" is not an integer`, () => {
    const invalidVotes = "Hulk Hogan";
    return request(app)
      .patch(`/api/reviews/8`)
      .send({ inc_votes: invalidVotes })
      .expect(400)
      .then((response) => {
        expect(response.body.message).toBe(
          `Cannot update votes - ${invalidVotes} is not an integer.`
        );
      });
  });
  it(`Test 2 - status:400 and message if "inc_votes" is not an integer`, () => {
    const invalidVotes = 65.56;
    return request(app)
      .patch(`/api/reviews/5`)
      .send({ inc_votes: invalidVotes })
      .expect(400)
      .then((response) => {
        expect(response.body.message).toBe(
          `Cannot update votes - ${invalidVotes} is not an integer.`
        );
      });
  });
});

describe(`ERRORS: GET /api/reviews/:review_id/comments`, () => {
  it(`status:400 and message if passed with invalid id`, () => {
    const invalidId = `Darth Vader`;
    return request(app)
      .get(`/api/reviews/${invalidId}/comments`)
      .expect(400)
      .then((response) => {
        expect(response.body.message).toBe(
          `Unfortunately ${invalidId} is not a valid ID, please use an integer.`
        );
      });
  });
  it(`status:404, responds with message, when passed with id of review that does not exist in database`, () => {
    const nonexistantId = `386`;
    return request(app)
      .get(`/api/reviews/${nonexistantId}/comments`)
      .expect(404)
      .then((response) => {
        expect(response.body.message).toBe(
          `Review ID ${nonexistantId} does not exist in our database.`
        );
      });
  });
  it(`status:200, responds with message, when no comments are available for review ID`, () => {
    const idWithNoComments = `11`;
    return request(app)
      .get(`/api/reviews/${idWithNoComments}/comments`)
      .expect(200)
      .then((response) => {
        expect(response.body.message).toBe(
          `Review ID ${idWithNoComments} does not have any comments yet.`
        );
      });
  });
});

describe(`ERRORS: POST /api/reviews/:review_id/comments`, () => {
  it(`status:400 and message if passed with invalid id`, () => {
    const invalidId = `R2D2`;
    const scytheComment = {
      username: `dav3rid`,
      comment_body: `1920s, Eastern Europe and Mechs! What is there not to like!!`,
    };
    return request(app)
      .post(`/api/reviews/${invalidId}/comments`)
      .send(scytheComment)
      .expect(400)
      .then((response) => {
        expect(response.body.message).toBe(
          `Unfortunately ${invalidId} is not a valid ID, please use an integer.`
        );
      });
  });
  it(`status:404, responds with message, when passed with id of review that does not exist in database`, () => {
    const nonexistantId = `486`;
    const scytheComment = {
      username: `dav3rid`,
      comment_body: `1920s, Eastern Europe and Mechs! What is there not to like!!`,
    };
    return request(app)
      .post(`/api/reviews/${nonexistantId}/comments`)
      .send(scytheComment)
      .expect(404)
      .then((response) => {
        expect(response.body.message).toBe(
          `Review ID ${nonexistantId} does not exist in our database.`
        );
      });
  });
  it(`status:404, responds with message, when passed comment by user not in database`, () => {
    const nonExistantUser = `JCDenton82`;
    const scytheComment = {
      username: nonExistantUser,
      comment_body: `1920s, Eastern Europe and Mechs! What is there not to like!!`,
    };
    return request(app)
      .post(`/api/reviews/12/comments`)
      .send(scytheComment)
      .expect(404)
      .then((response) => {
        expect(response.body.message).toBe(
          `User ${nonExistantUser} does not exist in our database. Please register first.`
        );
      });
  });
  it(`status:400, responds with message when passed with no comment body`, () => {
    const noBodyComment = {
      username: `mallionaire`,
    };
    return request(app)
      .post(`/api/reviews/9/comments`)
      .send(noBodyComment)
      .expect(400)
      .then((response) => {
        expect(response.body.message).toBe(
          `Cannot post. No comment content entered.`
        );
      });
  });
});
