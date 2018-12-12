exports.run = (client, message, args, level) => {
    if (!args || args.length < 1) return message.channel.send("\nSorry, you didn't provide enough arguments.\nTry this: !bypass [@player/@role]");
    if (message.mentions.roles.keyArray().length === 0 && message.mentions.members.keyArray().length === 0) {
        message.channel.send("Sorry, a player or role was not detected.\nTry this: !bypass [@player/@role]");
    }
    else {
        if (message.channel.parent !== null && message.channel.parent.name === "General Lounges" && message.channel.name.split("")[1]==="-") {
            if (message.channel.permissionsFor(message.member).has("MANAGE_MESSAGES", true) === true) {
                const loungeName = message.channel.topic;
                if (message.mentions.members.keyArray().length > 0) {
                    let playerEdit = message.mentions.members.first();
                    processPermissions(playerEdit, message, loungeName);
                }
                else if (message.mentions.roles.keyArray().length > 0) {
                    let roleEdit = message.mentions.roles.first();
                    processPermissions(roleEdit, message, loungeName);
                }
            }
            else {
                message.channel.send("Sorry, you don't have permission to do that.");
            }
        }
        else {
            message.channel.send("Sorry, you can't use that command here.");
        }
    }
};

exports.conf = {
    enabled: true,
    guildOnly: true,
    aliases: [],
    permLevel: "User"
};

exports.help = {
    name: "bypass",
    category: "Lounges",
    description: "allow/reset a player/role to bypass a locked lounge",
    usage: "bypass [@player/@role]"
};

function processPermissions(memberEdit, message, loungeName) {
    if (message.guild.channels.find(channel => channel.name === loungeName).permissionsFor(memberEdit).has("CONNECT", true) === true) {
        message.guild.channels.find(channel => channel.name === loungeName).overwritePermissions(memberEdit, {
            "CONNECT": null
        });
        message.channel.send("Lounge bypass has been reset.");
    }
    else {
        message.guild.channels.find(channel => channel.name === loungeName).overwritePermissions(memberEdit, {
            "CONNECT": true
        });
        message.channel.send("Lounge bypass has been added.");
    }
}