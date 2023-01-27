const formatDate = require("../db/utilities/format-date");

describe(`formatDate()`, () => {
  it("should take date string with time in long format and return just the date string", () => {
    const testDate1 = "1998-05-10T00:10:00.000Z";
    const testDate2 = "1993-11-10T00:00:00.000Z";
    const testDate3 = "2003-12-23T13:00:55.000Z";
    expect(formatDate(testDate1)).toEqual("1998-05-10");
    expect(formatDate(testDate2)).toEqual("1993-11-10");
    expect(formatDate(testDate3)).toEqual("2003-12-23");
  });
});
