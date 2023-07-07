const formatDate = require("../db/utilities/format-date");
const formatRating = require("../db/utilities/format-rating");
const {
  createRefObjectForReview,
} = require("../db/utilities/reviewCommentFormatting");
const reviewsInsertedBySeed = require("./reviewsInsertedBySeed");

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
    const expectedRefObject = {
      "Doom (1993)": 1,
      "Max Payne": 2,
      "Mass Effect": 3,
      "Duke Nukem 3D": 4,
      Control: 5,
      "Deliver Us the Moon": 6,
      "The Elder Scrolls III: Morrowind": 7,
    };
    expect(createRefObjectForReview(testInputArray)).toEqual(expectedRefObject);
  });
});
