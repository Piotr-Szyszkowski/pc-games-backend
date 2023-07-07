// const dateRegex = /^(\d{4}-\d{2}-\d{2})$/;

// console.log(dateRegex.test("2003-16-45"));
// const formatDate = (date) => {
//   const longString = new Date(`${date} GMT`).toISOString();
//   const shortString = longString.slice(0, 10);
//   return shortString;
// };
// const dOld = 1688464743243;
// const dn = Date.now();
// console.log(formatDate(dOld));

const rawDate = 1688296359000;
console.log(new Date(rawDate).toISOString());
