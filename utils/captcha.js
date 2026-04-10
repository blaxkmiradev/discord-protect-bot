const pending = new Map();

function generateCaptcha(userId) {
  const a = Math.floor(Math.random() * 10);
  const b = Math.floor(Math.random() * 10);

  const answer = a + b;
  pending.set(userId, answer);

  return `${a} + ${b} = ?`;
}

function checkCaptcha(userId, input) {
  const correct = pending.get(userId);

  if (parseInt(input) === correct) {
    pending.delete(userId);
    return true;
  }

  return false;
}

module.exports = { generateCaptcha, checkCaptcha };
