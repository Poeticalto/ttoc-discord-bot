// team command allows for moderators of the server to assign team roles to multiple members

exports.run = async (client, message, args, level) => {
    client.logger.log(`(${message.member.id}) ${message.member.displayName} used command team with args ${args}`);
    // return if user didn't provide enough arguments
    if (!args || args.length < 2) return message.channel.send("\nSorry, you didn't provide enough arguments.\nTry this: !team [abbr] @player");
    // get the team role to assign
    let [abbrProcess] = args.splice(0);
    // get list of roles who can assign team names
    const permList = client.config.permList;
    // get list of team roles
    const teamList = client.config.teamList;
    // get the league of the team role
    const leagueCheck = abbrProcess.split('')[0].toUpperCase();
    // if the team role exists and the member is able to assign the team role and a member was mentioned, process the role
    if (teamList[leagueCheck].indexOf(abbrProcess.toUpperCase()) > -1 && (message.member.roles.some(r => permList[leagueCheck].includes(r.name)) || level > 2) && message.mentions.members.keyArray().length > 0) {
        let resultsArr = message.mentions.members.map((member, index, members) => {return processRole(abbrProcess.toUpperCase(), member, message)});
        return message.channel.send("Successfully processed:\n"+resultsArr.join("\n"));
    }
    else if (message.mentions.members.keyArray().length === 0) {
        // tell user if member wasn't mentioned
        return message.channel.send("Sorry, I couldn't find a mentioned player. Remember to mention each player instead of typing names!");
    }
    else {
        // tell uesr if they don't have permission to use the command
        return message.channel.send("Sorry, you don't have permission to assign this team name.");
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
    description: "Set team roles for guild members",
    usage: "team [abbr] @player"
};

function processRole(abbrProcess, memberEdit, message) {
    // get the team role
    const roleToCheck = message.guild.roles.find(role => role.name === abbrProcess);
    // remove role if member has role
    if (memberEdit.roles.has(roleToCheck.id)) {
        memberEdit.removeRole(roleToCheck).catch(console.error);
        return `removed ${abbrProcess} role for ${memberEdit.displayName}`;
    }
    else {
        // add role if member doesn't have role
        memberEdit.addRole(roleToCheck).catch(console.error);
        return `added ${abbrProcess} role for ${memberEdit.displayName}`;
    }
}