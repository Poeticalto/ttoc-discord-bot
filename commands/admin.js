// The admin command allows a lounge admin to give admin permission to other members for the voice lounge

exports.run = async (client, message, args, level) => {
    // return if no argument was provided
    if (!args || args.length < 1) return await message.channel.send("\nSorry, you didn't provide enough arguments.\nTry this: !admin [@player/@role]");
    // return if no member or role was found
    if (message.mentions.roles.keyArray().length === 0 && message.mentions.members.keyArray().length === 0) {
        return message.channel.send("Sorry, a player or role was not detected.\nTry this: !admin [@player/@role]");
    }
    else {
        // otherwise, check if the command was done inside a lounge
        if (message.channel.parent !== null && (message.channel.parent.name === "General Lounges" || message.channel.parent.name === "MLTP")&& message.channel.name.split("")[1]==="-") {
            // check if the member is a lounge admin
            if (message.channel.permissionsFor(message.member).has("MANAGE_MESSAGES", true) === true) {
                // get voice lounge name
                const loungeName = message.channel.topic;
                // process permissions for tagged users
                let resultsArr = "";
                if (message.mentions.members.keyArray().length > 0) {
                    resultsArr += message.mentions.members.map((member, index, members) => {return processPermissions(member, message, loungeName)}).join("\n");
                }
                // process permissions for tagged roles
                if (message.mentions.roles.keyArray().length > 0) {
                    resultsArr += message.mentions.roles.map((role, index, roles) => {return processPermissions(role, message, loungeName)}).join("\n");
                }
                // send results
                return message.channel.send("Successfully processed:\n"+resultsArr);
            }
            else {
                // tell user they do not have admin permissions in the lounge
                await message.channel.send("Sorry, you don't have permission to do that.");
            }
        }
        else {
            // tell user they cannot use this command here
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
    // check whether to add or remove admin permissions
    if (message.channel.permissionsFor(memberEdit).has("MANAGE_MESSAGES", true) === true) {
        // remove permissions for the voice lounge
        message.channel.overwritePermissions(memberEdit,{
            "MANAGE_MESSAGES": false
        });
        message.guild.channels.find(channel => channel.name === loungeName).overwritePermissions(memberEdit, {
            "MUTE_MEMBERS": false,
            "DEAFEN_MEMBERS": false,
            "MOVE_MEMBERS": false
        });
        if (memberEdit.displayName) {
            return "Lounge Admin privileges successfully removed for "+memberEdit.displayName;
        }
        else {
            return "Lounge Admin privileges successfully removed for "+memberEdit.name;
        }
    }
    else {
        // add permissions for the voice lounge
        message.channel.overwritePermissions(memberEdit,{
            "MANAGE_MESSAGES": true
        });
        message.guild.channels.find(channel => channel.name === loungeName).overwritePermissions(memberEdit, {
            "MUTE_MEMBERS": true,
            "DEAFEN_MEMBERS": true,
            "MOVE_MEMBERS": true
        });
        if (memberEdit.displayName) {
            return "Lounge Admin privileges successfully added for "+memberEdit.displayName;
        }
        else {
            return "Lounge Admin privileges successfully added for "+memberEdit.name;
        }
    }
}