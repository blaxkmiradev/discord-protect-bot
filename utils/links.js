const scamKeywords = [
  "free nitro",
  "discord.gift",
  "bit.ly",
  "tinyurl",
  "crypto giveaway"
];

function isScam(text) {
  if (!text) return false;

  const lower = text.toLowerCase();
  return scamKeywords.some((k) => lower.includes(k));
}

module.exports = { isScam };
