exports.run = async (client, message, args, level) => {
    let currentUser = client.tournaments.getTournamentUser.get(message.author.id);
    if (!currentUser)
    {// user doesn't exist
        return message.reply("Sorry, your information isn't currently saved! Use !register to add your information!");
    }
    else if (currentUser.pstatus === 2)
    {// demote to player
        processRole(message, "TToC Captain");
        currentUser.pstatus = 1;
        client.tournaments.updateSignup(client, currentUser, "Edit");
        return message.reply("Your signup has been removed!");
    }
    else
    {// add signup
        if (currentUser.pstatus === 1) {
            processRole(message, "TToC Captain");
        }
        else {
            processRole(message, "TToC Captain");
            processRole(message, "TToC Player");
        }
        currentUser.pstatus = 2;
        client.tournaments.setTournamentUser.run(currentUser);
        client.tournaments.updateSignup(client, currentUser, "Edit");
        return message.reply("Your signup has been changed to player!");
    }
};

exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: [],
    permLevel: "User"
};

exports.help = {
    name: "captain",
    category: "Tournaments",
    description: "Signs user up for a tournament as a captain",
    usage: "captain"
};

function processRole(message, roleName) {
     const roleToCheck = message.guild.roles.find(role => role.name === roleName);
    // check whether to add or remove role
    if (message.member.roles.has(roleToCheck.id)) {
        // remove role from member
        message.member.removeRole(roleToCheck).catch(console.error);
    }
    else {
        // add role to member
        message.member.addRole(roleToCheck).catch(console.error);
    }
}