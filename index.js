const { 
  Client, 
  GatewayIntentBits, 
  PermissionsBitField 
} = require("discord.js");

const config = require("./config");

const { isSpam } = require("./utils/spam");
const { isScam } = require("./utils/links");
const { generateCaptcha, checkCaptcha } = require("./utils/captcha");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers
  ]
});

// Store users who need captcha
const waitingCaptcha = new Set();

client.on("guildMemberAdd", async (member) => {
  const captcha = generateCaptcha(member.id);
  waitingCaptcha.add(member.id);

  try {
    await member.send(
      `👋 Welcome to ${member.guild.name}\nSolve this captcha:\n${captcha}`
    );
  } catch {
    console.log("Cannot DM user");
  }
});

client.on("messageCreate", async (message) => {
  if (message.author.bot) return;

  const userId = message.author.id;

  // 🤖 CAPTCHA CHECK
  if (waitingCaptcha.has(userId)) {
    if (checkCaptcha(userId, message.content)) {
      waitingCaptcha.delete(userId);
      return message.reply("✅ Verified!");
    }
  }

  // 🛡️ Anti-spam
  if (isSpam(userId, config)) {
    await message.delete().catch(() => {});
    return;
  }

  // 🔗 Scam detection
  if (isScam(message.content)) {
    await message.delete().catch(() => {});

    if (message.member.permissions.has(PermissionsBitField.Flags.KickMembers)) return;

    await message.member.kick().catch(() => {});
    message.channel.send("🚫 Scam detected, user kicked.");
  }
});

client.login(config.TOKEN);
console.log("🤖 Discord bot running...");
