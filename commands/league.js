const fs = require("fs");
const path = require('path');
const pathToTeamRoles = path.join(__dirname, '../teamRoles.json');
const teamRoles = require(pathToTeamRoles);

exports.run = async (client, message, args, level) => {
	client.logger.log(`(${message.member.id}) ${message.member.displayName} used command league with args ${args}`);
    if (!args || args.length < 1) return message.reply("\nSorry, you didn't provide enough arguments.\nTry this: !league [league]");
    let [abbrProcess] = args.splice(0);
    let author = message.member;
    let leagueList = teamRoles.leagueList;
    if (leagueList.indexOf(abbrProcess.toUpperCase()) > -1) {
        processRole(abbrProcess.toUpperCase(), author, message);
    }
    else {
        return message.reply("\nSorry, the league name was not recognized.\nUse !league [league] and use one of these leagues: \n"+leagueList.toString());
    }
};

exports.conf = {
    enabled: true,
    guildOnly: true,
    aliases: [],
    permLevel: "User"
};

exports.help = {
    name: "league",
    category: "Competitive",
    description: "Allows for players to get league roles",
    usage: "league [league]"
};

function processRole(abbrProcess, memberEdit, message) {
    const roleToCheck = message.guild.roles.find(role => role.name === abbrProcess);
    if (memberEdit.roles.has(roleToCheck.id)) {
        memberEdit.removeRole(roleToCheck).catch(console.error);
        message.channel.send(abbrProcess+" role successfully removed!");
    }
    else {
        memberEdit.addRole(roleToCheck).catch(console.error);
        message.channel.send(abbrProcess+" role successfully added!");
    }
}