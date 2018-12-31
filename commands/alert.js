// The alert command gives or removes the "TToC Alerts" role from the member

exports.run = (client, message, args, level) => {
    // get role from guild
    const roleToCheck = message.guild.roles.find(role => role.name === "TToC Alerts");
    // check whether to add or remove role
    if (message.member.roles.has(roleToCheck.id)) {
        // remove role from member
        message.member.removeRole(roleToCheck).catch(console.error);
        message.channel.send("TToC Alerts role successfully removed!");
    }
    else {
        // add role to member
        message.member.addRole(roleToCheck).catch(console.error);
        message.channel.send("TToC Alerts role successfully added!");
    }
};

exports.conf = {
    enabled: true,
    guildOnly: true,
    aliases: [],
    permLevel: "User"
};

exports.help = {
    name: "alert",
    category: "Tournaments",
    description: "adds a player to get tournament notifications",
    usage: "alert"
};