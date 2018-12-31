// rainbow command gives the member the rainbow role

exports.run = async (client, message, args, level) => {
    // get rainbow role
    const roleToCheck = message.guild.roles.find(role => role.name === "Rainbow");
    // if user has role, remove it
    if (message.member.roles.has(roleToCheck.id)) {
        await message.member.removeRole(roleToCheck).catch(console.error);
        message.channel.send("Rainbow role successfully removed!");
    }
    else {
        // otherwise add the rainbow role
        await message.member.addRole(roleToCheck).catch(console.error);
        message.channel.send("Rainbow role successfully added!");
    }
};

exports.conf = {
    enabled: true,
    guildOnly: true,
    aliases: [],
    permLevel: "Bot Admin"
};

exports.help = {
    name: "rainbow",
    category: "Miscellaneous",
    description: "Allows users to get the rainbow role",
    usage: "rainbow"
};