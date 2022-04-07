require("dotenv").config();
const client = require("./client");
const utils = require("./util");
const tagRequest = require("./tagRequest");
//const whitelist = require("./whiteList.json");

const token = process.env.BOT_TOKEN; //Discord bot token

var prefix = "@"; // Prefix for commands
var debug = true; //If this is true it will log the tags of the sent gif
var allowProfanity = false; //If this is true it will allow innapropriate gifs

client.on("ready", async () => {
  //log the bot tag
  console.log(`Logged in as ${client.user.tag}!`);
  //set the bot status to listening to commands
  client.user.setActivity("gifs", { type: "LISTENING" });
});

client.on("messageCreate", (msg) => {
  setImmediate(async () => {
    //make sure message is in a guild else return
    if (!msg.guild) return;

    //make sure message is not from a bot
    if (msg.author.bot) return;

    //Get message content as a string
    let content = msg.content;
    //check if message is a gif link (must be a tenor gif)
    let isGifLink = utils.isAGifLink(content);
    if (isGifLink) {
      //Get gif tags
      let req = tagRequest(content);
      //message complement (debug)
      let complement = "";

      //wait for the tags to be returned
      await req
        .then((data) => {
          let shouldReturn = false;

          //check if any of the tags is innapropriate
          if (!allowProfanity) {
            for (let i = 0; i < data.length; i++) {
              if (utils.isProfane(data[i])) {
                shouldReturn = true;
              }
            }
          }

          //if the message is innapropriate warn the user who sent it and delete the message if possible
          if (shouldReturn) {

          }

          //if debug is on then list the tags
          if (debug) {
            complement += `**TAGS:** ${data.join(", ")}`;
          }

          //send the gif
          msg.channel.send(`${complement}\n<@${msg.author.id}>\n` + content);

          //Delete the original message if possible
          if (msg.deletable) {
            msg.delete();
          }
        })
        .catch((err) => {
          msg.channel.send(
            `**Error while trying to filter gif (contact an admnistrator for support)**\nERROR: ${err}`
          );
          return;
        });
    }
    else if (utils.validURL(content) || utils.hasLink(content)) {
      msg.channel.send(`<@${msg.author.id}> Links are not allowed!`);

      if (msg.deletable) {
        msg.delete();
      }

      return;
    }
    //Some simple commands for testing
    else if (content.startsWith(prefix) && utils.isOwner(msg)) {
      let args = content.substring(prefix.length).split(" ");

      let command = args.pop();

      switch (command) {
        case "ping":
          await msg.channel.send(`Pong! ${client.ws.ping}ms`);
          break;
        //Add more commands here
      }
    }
  });
});

client.login(token);
