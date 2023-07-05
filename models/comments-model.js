const selectComments = async (review_id) => {
  return [
    {
      body: "Brings back memories. Best FPS of all times. Loads of action and fantastic atmosphere",
      belongs_to: "Doom (1993)",
      created_by: "Graveman82",
      created_at: 1688464743243,
    },
    {
      body: `First FPS I've ever played. That's what got me into competitive gaming career later in my life. Thank you ID Software!`,
      belongs_to: "Doom (1993)",
      created_by: "ToryTiller",
      created_at: 1688559916332,
    },
  ];
};

module.exports = { selectComments };
