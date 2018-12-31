// league command allows for a member to define their own leagues roles in the server

exports.run = async (client, message, args, level) => {
    // return if no arguments were provided
    if (!args || args.length < 1) return message.reply("\nSorry, you didn't provide enough arguments.\nTry this: !league [league]");
    // get league name
    let [abbrProcess] = args.splice(0);
    // get member from message
    let author = message.member;
    // get leagueList from config
    let leagueList = client.config.leagueList;
    // if league is in the league list, then process role
    if (leagueList.indexOf(abbrProcess.toUpperCase()) > -1) {
        processRole(abbrProcess.toUpperCase(), author, message);
    }
    else {
        // otherwise notify user to use an actual league
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
    // get role represented by abbrProcess
    const roleToCheck = message.guild.roles.find(role => role.name === abbrProcess);
    // check if member has the role
    if (memberEdit.roles.has(roleToCheck.id)) {
        // if member has role, remove it
        memberEdit.removeRole(roleToCheck).catch(console.error);
        message.channel.send(abbrProcess+" role successfully removed!");
    }
    else {
        // if member doesn't have role, add it
        memberEdit.addRole(roleToCheck).catch(console.error);
        message.channel.send(abbrProcess+" role successfully added!");
    }
}