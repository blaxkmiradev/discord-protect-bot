const users = {};

function isSpam(userId, config) {
  const now = Date.now();

  if (!users[userId]) users[userId] = [];

  users[userId].push(now);

  users[userId] = users[userId].filter(
    (t) => now - t < config.TIME_WINDOW
  );

  return users[userId].length > config.SPAM_LIMIT;
}

module.exports = { isSpam };
