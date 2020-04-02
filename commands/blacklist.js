/**
* The blacklist command prevents the given member from using the bot
* @param {snowflake} member - Tagged user to add to the bot blacklist
*/

exports.run = async (client, message, args, level) => {
    if (!args) return await message.channel.send("Need to tag a user.").catch(console.error);
    if (message.mentions.members.keyArray().length > 0) {
        let member = message.mentions.members.first();
        let blacklistCheck = client.blacklist.getUser.get(member.id);
        if (!blacklistCheck) {
            blacklistCheck = {"id": member.id};
            client.blacklist.setUser.run(blacklistCheck);
            return await message.channel.send(`${member.displayName} was added to the blacklist!`).catch(console.error);
        }
        client.blacklist.deleteUser.run(member.id);
        return await message.channel.send(`${member.displayName} was removed from the blacklist!`).catch(console.error);
    }
    return await message.channel.send("Need to tag a user for the blacklist").catch(console.error);
};

exports.conf = {
    enabled: true,
    guildOnly: true,
    aliases: ["bl"],
    permLevel: "Bot Owner"
};

exports.help = {
    name: "blacklist",
    category: "System",
    description: "adds/removes a user from the bot blacklist",
    usage: "blacklist @User"
};