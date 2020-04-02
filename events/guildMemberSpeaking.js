/**
* The guildMemberSpeaking event runs if the bot is connected to a voice channel and checks if a member has started or stopped speaking
* @param {client} client - client object for the bot
* @param {snowflake} member - member object for user whose speaking status has changed
* @param {boolean} speaking - whether or not member started (true) or stopped (false) speaking
*/

const fs = require('fs');

module.exports = async (client, member, speaking) => {
    // get time for timestamp
    let a = new Date();
    let months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    let year = a.getFullYear();
    let month = months[a.getMonth()];
    let date = a.getDate();
    let hour = a.getHours();
    let min = a.getMinutes();
    let sec = a.getSeconds();
    let time = `${month}/${date}/${year} ${hour}:${min}:${sec}`;
    // get event for logging
    let data = `${time} ${member.displayName} (${member.id}) has ${speaking ? "started" : "stopped"} speaking.\n`;
    // log event into lounge file
    let fileName = `${member.voiceChannel.name.replace(/ /g,"_").toLowerCase()}.txt`;
    fs.appendFile("./logs/lounges/"+fileName,data,'utf8',
        function(err) {
            if (err) {
                console.log(`error adding to log file for ${fileName}`);
            };
        });
};