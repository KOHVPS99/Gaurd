require("dotenv").config();
const fs = require("node:fs");
const path = require("node:path");
const { Client, GatewayIntentBits, Collection } = require("discord.js");

if (!process.env.DISCORD_TOKEN) {
  console.error("❌ Missing DISCORD_TOKEN in .env file");
  process.exit(1);
}

const PREFIX = process.env.PREFIX || "g!";

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

client.prefixCommands = new Collection();

//
// LOAD PREFIX COMMANDS
//
const prefixPath = path.join(__dirname, "commands/prefix");
if (fs.existsSync(prefixPath)) {
  const files = fs.readdirSync(prefixPath).filter(file => file.endsWith(".js"));
  for (const file of files) {
    const command = require(path.join(prefixPath, file));
    client.prefixCommands.set(command.name, command);
  }
}

//
// PREFIX HANDLER
//
client.on("messageCreate", async (message) => {
  if (!message.content.startsWith(PREFIX) || message.author.bot) return;

  const args = message.content.slice(PREFIX.length).trim().split(/ +/);
  const commandName = args.shift().toLowerCase();

  const command = client.prefixCommands.get(commandName);
  if (!command) return;

  try {
    await command.execute(client, message, args);
  } catch (error) {
    console.error(error);
    message.reply("❌ Error running command.");
  }
});

client.once("ready", () => {
  console.log(`✅ Guard is online as ${client.user.tag}`);
});

client.login(process.env.DISCORD_TOKEN);
