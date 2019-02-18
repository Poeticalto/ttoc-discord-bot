// team command allows for moderators of the server to assign team roles to multiple members

exports.run = async (client, message, args, level) => {
    client.logger.log(`(${message.member.id}) ${message.member.displayName} used command team with args ${args}`);
    // return if user didn't provide enough arguments
    if (!args || args.length < 2) return message.channel.send("\nSorry, you didn't provide enough arguments.\nTry this: !team [abbr] @player");
    // get the team role to assign
    let [abbrProcess] = args.splice(0);
    abbrProcess = abbrProcess.replace(/\+/g," ");
    let memberData = client.teamPerms.getTeamPerms.get(message.member.id);
    if (!memberData && level <= 2) {
        return message.channel.send("Sorry, you don't have permission to assign this team name.");
    }
    else {
        let teamArr = [];
        if (memberData) {
            teamArr = memberData.teamlist.split(" ");
        }
        if ((teamArr.indexOf(abbrProcess.toUpperCase()) > -1 || level > 2) && message.mentions.members.keyArray().length > 0) {
            let resultsArr = message.mentions.members.map((member, index, members) => {return processRole(abbrProcess.toLowerCase(), member, message)});
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
    const roleToCheck = message.guild.roles.find(role => role.name.toLowerCase() === abbrProcess);
    const someBallCheck = message.guild.roles.find(role => role.name === "Some Ball");
    abbrProcess = roleToCheck.name;
    // remove role if member has role
    if (roleToCheck !== null && memberEdit.roles.has(roleToCheck.id)) {
        memberEdit.removeRole(roleToCheck).catch(console.error);
        return `removed ${abbrProcess} role for ${memberEdit.displayName}`;
    }
    else {
        if (roleToCheck !== null) {
            if (someBallCheck !== null && memberEdit.roles.has(someBallCheck.id)) {
                memberEdit.removeRole(someBallCheck).catch(console.error);
            }
            // add role if member doesn't have role
            memberEdit.addRole(roleToCheck).catch(console.error);
            return `added ${abbrProcess} role for ${memberEdit.displayName}`;
        }
        else {
            return `${abbrProcess} role doesn't exist!`;
        }
    }
}