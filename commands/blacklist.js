// The blacklist command prevents the given member from using the bot

exports.run = (client, message, args, level) => {
    if (!args) return message.channel.send("Need to tag a user.");
    if (message.mentions.members.keyArray().length > 0) {
        let member = message.mentions.members.first();
        let blacklistCheck = client.blacklist.getUser.get(member.id);
        if (!blacklistCheck) {
            blacklistCheck = {"id": member.id};
            client.blacklist.setUser.run(blacklistCheck);
            message.channel.send(`${member.displayName} was added to the blacklist!`);
        }
        else {
            client.blacklist.deleteUser.run(member.id);
            message.channel.send(`${member.displayName} was removed from the blacklist!`);
        }
    }
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