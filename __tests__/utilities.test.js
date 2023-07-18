const formatDate = require("../db/utilities/format-date");
const formatRating = require("../db/utilities/format-rating");
const {
  createRefObjectForReview,
  swapTitleWithId,
} = require("../db/utilities/reviewCommentFormatting");
const reviewsInsertedBySeed = require("../additional_test_data/reviewsInsertedBySeed");

const expectedRefObject = {
  "Doom (1993)": 1,
  "Max Payne": 2,
  "Mass Effect": 3,
  "Duke Nukem 3D": 4,
  Control: 5,
  "Deliver Us the Moon": 6,
  "The Elder Scrolls III: Morrowind": 7,
};

describe(`formatDate()`, () => {
  it("should take date string with time in long format and return just the date string", () => {
    const testDate1 = new Date("1998-05-10T00:10:00.000Z");
    const testDate2 = new Date("1993-11-10T00:00:00.000Z");
    const testDate3 = new Date("1993-12-10T00:00:00.000Z");

    expect(formatDate(testDate1)).toEqual("1998-05-10");
    expect(formatDate(testDate2)).toEqual("1993-11-10");
    expect(formatDate(testDate3)).toEqual("1993-12-10");
  });
});

describe(`formatRating()`, () => {
  it(`should take rating string and return a decimal number`, () => {
    const testRating1 = "1.0";
    const testRating2 = "3.5";
    const testRating3 = "10.0";
    expect(typeof formatRating(testRating1)).toEqual("number");
    expect(typeof formatRating(testRating2)).toEqual("number");
    expect(typeof formatRating(testRating3)).toEqual("number");
    expect(formatRating(testRating1)).toEqual(1.0);
    expect(formatRating(testRating2)).toEqual(3.5);
    expect(formatRating(testRating3)).toEqual(10.0);
  });
});

describe(`createRefObjectForReview()`, () => {
  it(`Will take an array of (review) objects and return an object`, () => {
    expect(typeof createRefObjectForReview(reviewsInsertedBySeed)).toBe(
      "object"
    );
  });
  it(`When passed an array of single object, it should return an object with single key-value pair: "Title"(string): review_id(number)`, () => {
    const testArrayOneObj = [
      {
        review_id: 3,
        title: "Mass Effect",
        cover_img: "https://cdn.gracza.pl/galeria/gry13/grupy/2049.jpg",

        category: "RPG",
        review_intro:
          "An action RPG set in the convention of science fiction, developed by the BioWare studio team - authors of such cult titles as Baldur's Gate and Neverwinter Nights.",
        review_body:
          "Mass Effect is an extensive RPG production with numerous elements of an action game, prepared by employees of BioWare studio (creators of the popular and recognized series Baldur's Gate, Neverwinter Nights and Star Wars: Knights of the Old Republic). It is also the first part of a trilogy of games. The action of the game takes place in the year 2183, when humanity spread throughout the galaxy and was forced to cooperate and fight with alien civilizations for its place in the universe. Players assume the role of Commander Shepard, the first human Specter - sworn defender of peace. His main task is to stop the attacking armies of the former agent Saren, who opposed the established order and wants to take revenge on the human race. Together with the entire team under command, players will travel through a series of unknown worlds. During the expedition, they discover that the real threat is much more serious than previously thought...",
        upvotes: 80,
        downvotes: 34,
        rating_count: 4,
        rating_sum: "15",
        rating: "3.8",
      },
    ];
    expect(createRefObjectForReview(testArrayOneObj)).toEqual({
      "Mass Effect": 3,
    });
  });
  it(`When passed an array of multiple review objects, it should return an object with multiple, respective key-value pairs: "Title"(string): review_id(number)`, () => {
    const testInputArray = [...reviewsInsertedBySeed];
    expect(createRefObjectForReview(testInputArray)).toEqual(expectedRefObject);
  });
});

describe(`swapTitleWithId(refObject, rawCommentArray)`, () => {
  const testInputArray = [
    {
      body: "Brings back memories. Best FPS of all times. Loads of action and fantastic atmosphere",
      belongs_to: "Mass Effect",
      created_by: "Witcheroo",
      created_at: 1685747799000,
    },
    {
      body: `First FPS I've ever played. That's what got me into competitive gaming career later in my life. Thank you ID Software!`,
      belongs_to: "Duke Nukem 3D",
      created_by: "DarkFather",
      created_at: 1685747799000,
    },
  ];
  const outputArray = swapTitleWithId(expectedRefObject, testInputArray);
  it(`Test 1.0 - Takes a reference object, and an array of comment objects as the two arguments. Should return an array of comment objects with belongs_to replaced by review_id, that should correspond to the game title on the ref. object`, () => {
    expect(outputArray[0].review_id).toEqual(3);
    expect(outputArray[1].review_id).toEqual(4);
  });
  it(`Test 1.1 - returned comment objects should have all the previous properties, apart from id swapped and a correctly formatted date`, () => {
    // const outputArray = swapTitleWithId(expectedRefObject);
    const expectedFormattedArray = [
      {
        body: "Brings back memories. Best FPS of all times. Loads of action and fantastic atmosphere",
        review_id: 3,
        created_by: "Witcheroo",
        created_at: new Date(1685747799000).toISOString(),
      },
      {
        body: `First FPS I've ever played. That's what got me into competitive gaming career later in my life. Thank you ID Software!`,
        review_id: 4,
        created_by: "DarkFather",
        created_at: new Date(1685747799000).toISOString(),
      },
    ];
    expect(outputArray).toEqual(expectedFormattedArray);
  });
});
