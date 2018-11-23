const fs = require("fs");
const Discord = require('discord.js');
const client = new Discord.Client();
var request = require('request');
const readline = require('readline');
const {google} = require('googleapis');

const { promisify } = require("util");
const readdir = promisify(require("fs").readdir);
const Enmap = require("enmap");

client.config = require("./config.js"); // config file
require("./modules/functions.js")(client); // functions file
client.commands = new Enmap();
client.aliases = new Enmap();
client.settings = new Enmap({name: "settings"});
//client.logger = require("./modules/Logger");

const init = async () => {

    // Here we load **commands** into memory, as a collection, so they're accessible
    // here and everywhere else.
    const cmdFiles = await readdir("./commands/");
    //client.logger.log(`Loading a total of ${cmdFiles.length} commands.`);
    cmdFiles.forEach(f => {
        if (!f.endsWith(".js")) return;
        const response = client.loadCommand(f);
        if (response) console.log(response);
    });

    // Then we load events, which will include our message and ready event.
    const evtFiles = await readdir("./events/");
    //client.logger.log(`Loading a total of ${evtFiles.length} events.`);
    evtFiles.forEach(file => {
        const eventName = file.split(".")[0];
        //client.logger.log(`Loading Event: ${eventName}`);
        const event = require(`./events/${file}`);
        // Bind the client to any event, before the existing arguments
        // provided by the discord.js event.
        // This line is awesome by the way. Just sayin'.
        client.on(eventName, event.bind(null, client));
    });

    // Generate a cache of client permissions for pretty perm names in commands.
    client.levelCache = {};
    for (let i = 0; i < client.config.permLevels.length; i++) {
        const thisLevel = client.config.permLevels[i];
        client.levelCache[thisLevel.name] = thisLevel.level;
    }
    // Here we login the client.
    client.login(client.config.discordToken);
    // End top-level async/await function.
};

init();