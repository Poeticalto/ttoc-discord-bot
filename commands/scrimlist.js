const Discord = require('discord.js');
const fs = require('fs');
const path = require('path');
const pathToScrimList = path.join(__dirname, '../scrimList.json');
let scrimList = require(pathToScrimList);

exports.run = async (client, message, args, level) => {
    //let mltpList = concatTeams("MLTP", scrimList);
    //let nltpList = concatTeams("NLTP", scrimList);
    let nftlList = concatTeams("NFTL", scrimList);
    //let uscList = concatTeams("USC", scrimList);
    let playerList = concatTeams("Players", scrimList);	
    const exampleEmbed = new Discord.RichEmbed()
    .setAuthor('Available Players/Teams','', '') 
    .setColor('DARK_GOLD')
    //.addField('MLTP:', mltpList, false)
    //.addField('NLTP:', nltpList, false)
    .addField('NFTL:', nftlList, false)
    //.addField('USC:', uscList, false)
    .addField('Players:', playerList, false)
    .setTimestamp()
    message.channel.send(exampleEmbed);
};

function concatTeams(league, scrimList) {
    let concatString = "";
    for (let i = 0; i < scrimList[league].length; i++) {
        if (i < (scrimList[league].length -1)) {
            concatString += scrimList[league][i] + ", ";
        }
        else {
            concatString += scrimList[league][i];
        }
    }
    if (concatString === "") {
        concatString += "None";
    }
    return concatString;
}

exports.conf = {
    enabled: true,
    guildOnly: true,
    aliases: ["sl"],
    permLevel: "User"
};

exports.help = {
    name: "scrimlist",
    category: "Competitive",
    description: "Gets the list of teams and players available for scrims",
    usage: "scrimlist"
};