const formatDate = (date) => {
  const longString = new Date(`${date} GMT`).toISOString();
  const shortString = longString.slice(0, 10);
  return shortString;
};

module.exports = formatDate;
