/**
* The MESSAGEUPDATE event runs every time a message gets edited in a channel the bot can read
* @param {client} client - client object for the bot
* @param {snowflake} message - message object for the message being processed
*/

const Discord = require('discord.js');
const fs = require('fs');

module.exports = async function(client, oldMessage, newMessage) {
    // ignore if message was edited in the trash channel or if a bot wrote the original message
    if (oldMessage.channel.name === client.config.trashChannel || oldMessage.author.bot) return;
    // Sometimes, the messageUpdate event will send when the server is
    // retrieving an image to cache, so ignore if the content is the same
    if (oldMessage.cleanContent === newMessage.cleanContent) return;
    // if message was in a voice lounge, record
    if (oldMessage.channel.name.substring(0,2) === "l-") {
        let data = `${customNewDate()} ${oldMessage.member.displayName} (${oldMessage.author.id}) updated message from ${getTimeFromSnowflake(oldMessage.id)}: ${newMessage.cleanContent}\n`;
        let fileName = `${oldMessage.channel.name}.txt`;
        fs.appendFile("./logs/lounges/"+fileName,data,'utf8',
            function(err) {
                if (err) throw err;
            });
    }
    // get the trash channel
    const logs = oldMessage.guild.channels.find(channel => channel.name === client.config.trashChannel);
    // if the trash channel does not exist, note it
    if (!logs) {
        console.log("ERROR: Trash channel not found!");
    }
    else {
        // if the trash channel exists, send the message information
        let newEmbed = new Discord.RichEmbed()
            .setTitle(`Message edited by ${oldMessage.author.username} (${oldMessage.author.id})`)
            .addField("Old Message", oldMessage.cleanContent, false)
            .addField("New Message", newMessage.cleanContent, false)
            .setColor('RED')
            .setFooter(`Message edited in ${oldMessage.channel.name}`);
        await logs.send(newEmbed).catch(console.error);
    }
}

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

function customNewDate() {
    let a = new Date();
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