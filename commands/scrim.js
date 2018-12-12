const fs = require('fs');
const path = require('path');
const pathToScrimList = path.join(__dirname, '../scrimList.json');
let scrimList = require(pathToScrimList);

exports.run = async (client, message, args, level) => {
    let leagueList = Object.keys(scrimList);
    const channelName = message.channel.name;
    if (leagueList.indexOf(message.channel.parent.name) > -1 && channelName.indexOf("general") === -1) {
        const teamName = channelName.split('_').map((s) => s.charAt(0).toUpperCase() + s.substring(1)).join(' ');
        const teamIndex = scrimList[message.channel.parent.name].indexOf(teamName);
        if (teamIndex > -1) {
            message.channel.send(teamName + " removed from scrim list!");
            scrimList[message.channel.parent.name].splice(teamIndex, 1);
            fs.writeFile(pathToScrimList, JSON.stringify(scrimList, null, 4), 'utf8');
            updateScrimList(scrimList, message.guild);
        }
        else {
            scrimList[message.channel.parent.name].push(teamName);
            fs.writeFile(pathToScrimList, JSON.stringify(scrimList, null, 4), 'utf8');
            message.channel.send(teamName + " added to scrim list!");
            updateScrimList(scrimList, message.guild);
        }
    }
    else {
        checkPlayer(message.author.username, scrimList, message);
        updateScrimList(scrimList, message.guild);
    }
};

function checkPlayer(username, scrimList, message) {
    const playerIndex = scrimList["Players"].indexOf(username);
    if (playerIndex > -1) {
        scrimList["Players"].splice(playerIndex, 1);
        fs.writeFile(pathToScrimList, JSON.stringify(scrimList, null, 4), 'utf8');
        message.channel.send(username + " removed from scrim list!");
    }
    else {
        scrimList["Players"].push(username);
        fs.writeFile(pathToScrimList, JSON.stringify(scrimList, null, 4), 'utf8');
        message.channel.send(username + " added to scrim list!");
    }
}

function updateScrimList(scrimList, guild) {
    const scrimChannel = guild.channels.find(channel => channel.name === "looking-for-scrim");
    //let mltpList = concatTeams("MLTP", scrimList);
    //let nltpList = concatTeams("NLTP", scrimList);
    let nftlList = concatTeams("NFTL", scrimList);
    //let uscList = concatTeams("USC", scrimList);
    let playerList = concatTeams("Players", scrimList);
    scrimChannel.setTopic("Available Players/Teams\nNFTL: " + nftlList + "\nPlayers: " + playerList);
}

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
    aliases: ["s"],
    permLevel: "User"
};

exports.help = {
    name: "scrim",
    category: "Competitive",
    description: "Adds a team or a player to the scrim list depending on the channel",
    usage: "scrim"
};