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
