require("dotenv").config();
const { Client, GatewayIntentBits } = require("discord.js");

if (!process.env.DISCORD_TOKEN) {
  console.error("❌ Missing DISCORD_TOKEN in .env file");
  process.exit(1);
}

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildModeration,
    GatewayIntentBits.GuildMessageReactions
  ]
});

client.once("ready", () => {
  console.log(`✅ Guard is online as ${client.user.tag}`);
});

client.login(process.env.DISCORD_TOKEN);
