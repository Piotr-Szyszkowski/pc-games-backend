const createRefObjectForReview = (reviewsArray) => {
  const refObject = {};
  // passedObject = reviewsArray[0];
  reviewsArray.forEach((reviewObj) => {
    refObject[reviewObj.title] = reviewObj.review_id;
  });
  // refObject[reviewObj.title] = reviewObj.review_id;
  return refObject;
};

module.exports = { createRefObjectForReview };
