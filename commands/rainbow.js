exports.run = async (client, message, args, level) => {
	const roleToCheck = message.guild.roles.find(role => role.name === "Rainbow");
    if (message.member.roles.has(roleToCheck.id))
    {
        await message.member.removeRole(roleToCheck).catch(console.error);
        message.channel.send("Rainbow role successfully removed!");
    }
    else
    {
        await message.member.addRole(roleToCheck).catch(console.error);
        message.channel.send("Rainbow role successfully added!");
    }
};

exports.conf = {
    enabled: true,
    guildOnly: true,
    aliases: [],
    permLevel: "User"
};

exports.help = {
    name: "rainbow",
    category: "Miscellaneous",
    description: "Allows users to get the rainbow role",
    usage: "rainbow"
};