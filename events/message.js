/**
* The MESSAGE event runs anytime a message is received
* @param {client} client - client object for the bot
* @param {snowflake} message - message object for the message being processed
*/

const fs = require('fs');

module.exports = async (client, message) => {
    // Grab the settings for this server from Enmap.
    // If there is no guild, get default conf (DMs)
    let settings;
    if (message.guild) {
        settings = message.settings = client.getSettings(message.guild.id);
        if (message.channel.name === client.config.highlightsChannel && !message.author.bot) {            
            if (client.config.whitelistHighlightLinks.some(url => message.content.includes(url))) {
                await message.react("⭐");
                await message.react("👍");
                return await message.react("👎");
            }
            else {
                await message.delete();
                return message.author.send(`Sorry ${message.author.username}, your message was deleted from the highlights channel because a whitelisted link was not detected. Please use one of these sites or use the general chat for highlight discussion or to use bot commands:\n<https://www.gfycat.com/>\n<https://www.imgur.com/>\n<https://www.streamable.com/>\n<https://clips.twitch.tv/>\n\nIn case you need it, here are the contents of your deleted message: ${message.cleanContent}`);
            }
        }
        else if (message.channel.name.substring(0,2) === "l-") {
            let data = `${getTimeFromSnowflake(message.id)} ${message.member.displayName} (${message.author.id}) sent message: ${message.cleanContent}\n`;
            let fileName = `${message.channel.name}.txt`;
            fs.appendFile("./logs/lounges/"+fileName,data,'utf8',
                function(err) {
                    if (err) throw err;
                });
        }
    }
    else {
        settings = message.settings = client.config.defaultSettings;
    }
    
    // It's good practice to ignore other bots. This also makes your bot ignore itself
    // and not get into a spam loop (we call that "botception").
    if (message.author.bot) return;
    
    // profanity checker for message
    if (client.checkProfanity(message.cleanContent) === true) {
        if (message.member) {
            client.logger.log(`(${message.author.id}) ${message.member.displayName} triggered profanity check: ${message.cleanContent}`);
        }
        else {
            client.logger.log(`(${message.author.id}) ${message.author.username} triggered profanity check: ${message.cleanContent}`);
        }
    }
    // Checks if the bot was mentioned, with no message after it, returns the prefix.
    const prefixMention = new RegExp(`^<@!?${client.user.id}>( |)$`);
    if (message.content.match(prefixMention)) {
        return message.reply(`My prefix on this guild is \`${settings.prefix}\``);
    }

    // Also good practice to ignore any message that does not start with our prefix,
    // which is set in the configuration file.
    if (message.content.indexOf(settings.prefix) !== 0) return;

    // Here we separate our "command" name, and our "arguments" for the command.
    // e.g. if we have the message "+say Is this the real life?" , we'll get the following:
    // command = say
    // args = ["Is", "this", "the", "real", "life?"]
    const args = message.content.slice(settings.prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();

    // If the member on a guild is invisible or not cached, fetch them.
    if (message.guild && !message.member) await message.guild.fetchMember(message.author);

    // Get the user or member's permission level from the elevation
    const level = client.permlevel(message);

    // Check whether the command, or alias, exist in the collections defined
    // in app.js.
    const cmd = client.commands.get(command) || client.commands.get(client.aliases.get(command));
    // using this const varName = thing OR otherthign; is a pretty efficient
    // and clean way to grab one of 2 values!
    if (!cmd) return;

    // Some commands may not be useable in DMs. This check prevents those commands from running
    // and return a friendly error message.
    if (cmd && !message.guild && cmd.conf.guildOnly)
        return message.channel.send("This command is unavailable via private message. Please run this command in a guild.");

    if (level < client.levelCache[cmd.conf.permLevel]) {
        if (settings.systemNotice === "true") {
            return message.channel.send(`You do not have permission to use this command.
Your permission level is ${level} (${client.config.permLevels.find(l => l.level === level).name})
This command requires level ${client.levelCache[cmd.conf.permLevel]} (${cmd.conf.permLevel})`);
        } else {
            return;
        }
    }
    
    // Check if the user is on the blacklist
    let blacklistCheck = client.blacklist.getUser.get(message.author.id);
    // If user is on the blacklist, return
    if (blacklistCheck) return;

    // To simplify message arguments, the author's level is now put on level (not member so it is supported in DMs)
    // The "level" command module argument will be deprecated in the future.
    message.author.permLevel = level;
    message.flags = [];
    while (args[0] && args[0][0] === "-") {
        message.flags.push(args.shift().slice(1));
    }
    // If the command exists, **AND** the user has permission, run it.
    client.logger.cmd(`[CMD] ${client.config.permLevels.find(l => l.level === level).name} ${message.author.username} (${message.author.id}) ran command ${cmd.help.name} with args ${args}`);
    cmd.run(client, message, args, level);
};

function getTimeFromSnowflake(id) {
    let a = new Date((parseInt(id) / 4194304) +  1420070400000);
    let months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    let year = a.getFullYear();
    let month = months[a.getMonth()];
    let date = a.getDate();
    let hour = a.getHours();
    let min = a.getMinutes();
    let sec = a.getSeconds();
    let time = `${month}/${date}/${year} ${hour}:${min}:${sec}`;
    return time;
}