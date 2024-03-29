const createRefObjectForReview = (reviewsArray) => {
  const refObject = {};
  // passedObject = reviewsArray[0];
  reviewsArray.forEach((reviewObj) => {
    refObject[reviewObj.title] = reviewObj.review_id;
  });
  // refObject[reviewObj.title] = reviewObj.review_id;
  return refObject;
};

const swapTitleWithId = (refObject, rawCommentArray) => {
  // console.log(refObject);
  // console.log(rawCommentArray);
  const swapSingleTitleWithId = (rawCommentObj) => {
    const { belongs_to, created_at, ...resoOfRawCommentObj } = rawCommentObj;
    const formattedCommentObj = {
      review_id: refObject[belongs_to],
      created_at: new Date(rawCommentObj.created_at).toISOString(),
      ...resoOfRawCommentObj,
    };
    return formattedCommentObj;
  };

  const formattedCommentArray = rawCommentArray.map(swapSingleTitleWithId);

  return formattedCommentArray;
};

module.exports = {
  createRefObjectForReview,
  swapTitleWithId,
};
