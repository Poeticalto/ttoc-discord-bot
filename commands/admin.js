/**
* Allows a lounge admin to give admin permissions to other members for the voice lounge
* @param {snowflake} user/role - the user/role to add/remove admin permissions for
*/

exports.run = async (client, message, args, level) => {
    // return if no argument was provided
    if (!args || args.length < 1) {
        return await message.channel.send("\nSorry, you didn't provide enough arguments.\nTry this: !admin [@player/@role]").catch(console.error);
    }
    // return if no member or role was found
    if (message.mentions.roles.keyArray().length === 0 && message.mentions.members.keyArray().length === 0) {
        return await message.channel.send("Sorry, a player or role was not detected.\nTry this: !admin [@player/@role]").catch(console.error);
    }
    // otherwise, check if the command was done inside a lounge
    if (message.channel.parent !== null && (message.channel.parent.name === "General Lounges" || message.channel.parent.name === "MLTP" || message.channel.parent.name === "NLTP")&& message.channel.name.split("")[1]==="-") {
        // check if the member is a lounge admin
        if (message.channel.permissionsFor(message.member).has("MANAGE_MESSAGES", true) === true) {
            // get voice lounge name
            const loungeName = message.channel.topic;
            // process permissions for tagged users
            let resultsArr = "";
            if (message.mentions.members.keyArray().length > 0) {
                resultsArr += await message.mentions.members.map(async (member, index, members) => {return await processPermissions(member, message, loungeName)});
            }
            // process permissions for tagged roles
            if (message.mentions.roles.keyArray().length > 0) {
                resultsArr += await message.mentions.roles.map(async (role, index, roles) => {return await processPermissions(role, message, loungeName)});
            }
            // send results
            return await message.channel.send("Successfully processed:\n"+resultsArr).catch(console.error);
        }
        // tell user they do not have admin permissions in the lounge
        return await message.channel.send("Sorry, you don't have permission to do that.").catch(console.error);
    }
    // tell user they cannot use this command here
    return await message.channel.send("Sorry, you can't use that command here.").catch(console.error);
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

async function processPermissions(memberEdit, message, loungeName) {
    // check whether to add or remove admin permissions
    if (message.channel.permissionsFor(memberEdit).has("MANAGE_MESSAGES", true) === true) {
        // remove permissions for the voice lounge
        await message.channel.overwritePermissions(memberEdit,{
            "MANAGE_MESSAGES": false
        }).catch(console.error);
        await message.guild.channels.find(channel => channel.name === loungeName).overwritePermissions(memberEdit, {
            "MUTE_MEMBERS": false,
            "DEAFEN_MEMBERS": false,
            "MOVE_MEMBERS": false
        }).catch(console.error);
        if (memberEdit.displayName) {
            return "Lounge Admin privileges successfully removed for "+memberEdit.displayName;
        }
        return "Lounge Admin privileges successfully removed for "+memberEdit.name;
    }
    // add permissions for the voice lounge
    await message.channel.overwritePermissions(memberEdit,{
        "MANAGE_MESSAGES": true
    }).catch(console.error);
    await message.guild.channels.find(channel => channel.name === loungeName).overwritePermissions(memberEdit, {
        "MUTE_MEMBERS": true,
        "DEAFEN_MEMBERS": true,
        "MOVE_MEMBERS": true
    }).catch(console.error);
    if (memberEdit.displayName) {
        return "Lounge Admin privileges successfully added for "+memberEdit.displayName;
    }
    return "Lounge Admin privileges successfully added for "+memberEdit.name;
}