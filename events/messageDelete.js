// The MESSAGEDELETE event runs every time a message gets deleted from a channel the bot can read
// However, this will ignore messages that are made by or deleted by bots
// Note that due to the binding of client to every event, every event
// goes `client, other, args` when this function is run.

const Discord = require('discord.js');

module.exports = async function(client, message) {
    // ignore if message was deleted in the trash channel or if a bot wrote the original message
    if (message.channel.name === client.config.trashChannel || message.author.bot) return;
    // get the trash channel
    const logs = message.guild.channels.find(channel => channel.name === client.config.trashChannel);
    // check the audit log for the deleted message
    const entry = await message.guild.fetchAuditLogs({type: 'MESSAGE_DELETE'}).then(audit => audit.entries.first());
    let user = "";
    if (entry.extra.channel.id === message.channel.id
        && (entry.target.id === message.author.id)
        && (entry.createdTimestamp > (Date.now() - 5000))
        && (entry.extra.count >= 1)) {
        // if the deleted message is in the audit log, then set the executor
        user = entry.executor;
    }
    else {
        // if the deleted message is not in the audit log, then the author deleted the message
        user = message.author;
    }
    // ignore if a bot deleted the message
    if (user.bot) return;
    // if the trash channel does not exist, note it
    if (!logs) {
        console.log("Trash channel not found!");
    }
    else {
        // if the trash channel exists, send the message information
        let newEmbed = new Discord.RichEmbed()
        .setTitle(`Original Author: ${message.author.username} (${message.author.id})`)
        .setAuthor(`Message deleted by ${user.username} (${user.id})`,'', '')
        .setDescription(`Original message: ${message.cleanContent}`)
        .setColor('BLUE')
        .setFooter(`Message deleted in ${message.channel.name}`);
        logs.send(newEmbed);
    }
}