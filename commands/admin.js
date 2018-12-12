exports.run = async (client, message, args, level) => {
    if (!args || args.length < 1) return await message.channel.send("\nSorry, you didn't provide enough arguments.\nTry this: !admin [@player/@role]");
    if (message.mentions.roles.keyArray().length === 0 && message.mentions.members.keyArray().length === 0) {
        message.channel.send("Sorry, a player or role was not detected.\nTry this: !admin [@player/@role]");
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
                await message.channel.send("Sorry, you don't have permission to do that.");
            }
        }
        else {
            await message.channel.send("Sorry, you can't use that command here.");
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
    name: "admin",
    category: "Lounges",
    description: "adds/removes a player or role as a Lounge admin",
    usage: "admin [@player/@role]"
};

function processPermissions(memberEdit, message, loungeName) {
    if (message.channel.permissionsFor(memberEdit).has("MANAGE_MESSAGES", true) === true) {
        message.channel.overwritePermissions(memberEdit,{
            "MANAGE_MESSAGES": false
        });
        message.guild.channels.find(channel => channel.name === loungeName).overwritePermissions(memberEdit, {
            "MUTE_MEMBERS": false,
            "DEAFEN_MEMBERS": false,
            "MOVE_MEMBERS": false
        });
        message.channel.send("Lounge Admin privileges successfully removed.");
    }
    else {
        message.channel.overwritePermissions(memberEdit,{
            "MANAGE_MESSAGES": true
        });
        message.guild.channels.find(channel => channel.name === loungeName).overwritePermissions(memberEdit, {
            "MUTE_MEMBERS": true,
            "DEAFEN_MEMBERS": true,
            "MOVE_MEMBERS": true
        });
        message.channel.send("Lounge Admin privileges successfully added.");
    }
}