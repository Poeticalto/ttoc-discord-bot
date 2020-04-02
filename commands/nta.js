/**
* Add or remove the NTA role on the server
*/

exports.run = async (client, message, args, level) => {
    let memberEdit = message.member;
    const roleToCheck = message.guild.roles.find(role => role.name === "NTA");
    if (memberEdit.roles.has(roleToCheck.id)) {
        await memberEdit.removeRole(roleToCheck).catch(console.error);
        await message.channel.send("Success! You will receive push notifications for tournaments from this server when you're online!").catch(console.error);
    }
    else {
        await memberEdit.addRole(roleToCheck).catch(console.error);
        await message.channel.send("Success! You won't receive push notifications for tournaments from this server when you're online!").catch(console.error);
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