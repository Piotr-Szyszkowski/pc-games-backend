const formatDate = (date) => {
  const longString = new Date(`${date} GMT`).toISOString();
  const shortString = longString.slice(0, 10);
  return shortString;
};

const formatDateAndTime = (uglyDateStr) => {
  const date = uglyDateStr.slice(0, 10);
  const time = uglyDateStr.slice(11, 19);
  return `${date} ${time}`;
};

module.exports = { formatDate, formatDateAndTime };
