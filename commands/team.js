const fs = require("fs");
const path = require('path');
const pathToTeamRoles = path.join(__dirname, '../teamRoles.json');
const teamRoles = require(pathToTeamRoles);

exports.run = async (client, message, args, level) => {
	client.logger.log(`(${message.member.id}) ${message.member.displayName} used command team with args ${args}`);
    if (!args || args.length < 2) return message.channel.send("\nSorry, you didn't provide enough arguments.\nTry this: !team [abbr] @player");
    let [abbrProcess] = args.splice(0);
    let memberEdit = message.mentions.members.first();
    const permList = teamRoles.permList;
    const teamList = teamRoles.teamList;
    const leagueCheck = abbrProcess.split('')[0].toUpperCase();
    switch(leagueCheck) {
        case "M":
        case "A":
        case "T":
        case "E":
        case "O":
            if (teamList[leagueCheck].indexOf(abbrProcess.toUpperCase()) > -1 && message.member.roles.some(r => permList[leagueCheck].includes(r.name))) {
                processRole(abbrProcess.toUpperCase(), memberEdit, message);
            }
            else {
                return message.channel.send("Sorry, you don't have permission to assign this team name.");
            }
            break;
        default:
            return message.channel.send("Sorry, I didn't recognize that team name.");
            break;
    }
};

exports.conf = {
    enabled: true,
    guildOnly: true,
    aliases: [],
    permLevel: "Moderator"
};

exports.help = {
    name: "team",
    category: "Competitive",
    description: "Allows for captains to set team roles",
    usage: "team [abbr] @player"
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