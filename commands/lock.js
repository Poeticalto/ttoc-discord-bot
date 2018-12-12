exports.run = async (client, message, args, level) => {
    if (message.channel.parent !== null && message.channel.parent.name === "General Lounges" && message.channel.name.split("")[1]==="-") {
        if (message.channel.permissionsFor(message.member).has("MANAGE_MESSAGES", true) === true) {
            const loungeName = message.channel.topic;
            processPermissions(message.guild.defaultRole, message, loungeName);
        }
        else {
            message.channel.send("Sorry, you don't have permission to do that.");
        }
    }
    else {
        message.channel.send("Sorry, you can't use that command here.");
    }
};

exports.conf = {
    enabled: true,
    guildOnly: true,
    aliases: [],
    permLevel: "User"
};

exports.help = {
    name: "lock",
    category: "Lounges",
    description: "locks/unlocks a voice lounge",
    usage: "lock"
};

function processPermissions(memberEdit, message, loungeName) {
    if (message.guild.channels.find(channel => channel.name === loungeName).permissionsFor(memberEdit).has("CONNECT", true) === true) {
        message.guild.channels.find(channel => channel.name === loungeName).overwritePermissions(memberEdit, {
            "CONNECT": false
        });
        message.channel.send("Lounge successfully locked.");
    }
    else {
        message.guild.channels.find(channel => channel.name === loungeName).overwritePermissions(memberEdit, {
            "CONNECT": true
        });
        message.channel.send("Lounge successfully unlocked.");
    }
}