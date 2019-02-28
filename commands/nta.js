// The alert command gives or removes alert status for a tournament user

exports.run = (client, message, args, level) => {
    let memberEdit = message.member;
    const roleToCheck = message.guild.roles.find(role => role.name === "NTA");
    if (memberEdit.roles.has(roleToCheck.id)) {
        memberEdit.removeRole(roleToCheck).catch(console.error);
        message.channel.send("NTA role successfully removed!");
    }
    else {
        memberEdit.addRole(roleToCheck).catch(console.error);
        message.channel.send("NTA role successfully added!");
    }
};

exports.conf = {
    enabled: true,
    guildOnly: true,
    aliases: ["na","nalerts"],
    permLevel: "User"
};

exports.help = {
    name: "nta",
    category: "Tournaments",
    description: "Prevent tournament alerts while you are online",
    usage: "nta"
};