/**
* The bypass command allows a lounge admin to designate certain members or roles who can bypass a locked lounge
* @param {snowflake} user/role - the user/role to add/remove bypass permissions for
*/

exports.run = async (client, message, args, level) => {
    // return if no args were provided
    if (!args || args.length < 1) return await message.channel.send("\nSorry, you didn't provide enough arguments.\nTry this: !bypass [@player/@role]").catch(console.error);
    // return if no member or role was mentioned
    if (message.mentions.roles.keyArray().length === 0 && message.mentions.members.keyArray().length === 0) {
        return await message.channel.send("Sorry, a player or role was not detected.\nTry this: !bypass [@player/@role]").catch(console.error);
    }
    // check that channel is a voice lounge
    if (message.channel.parent !== null && (message.channel.parent.name === "General Lounges" || message.channel.parent.name === "MLTP" || message.channel.parent.name === "NLTP") && message.channel.name.split("")[1]==="-") {
        // check if the member is a lounge admin
        if (message.channel.permissionsFor(message.member).has("MANAGE_MESSAGES", true) === true) {
            // get the lounge name
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
        // notify member that they don't have permission
        return await message.channel.send("Sorry, you don't have permission to do that.").catch(console.error);
    }
    // notify user that they are in the wrong channel
    return await message.channel.send("Sorry, you can't use that command here.").catch(console.error);
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

async function processPermissions(memberEdit, message, loungeName) {
    // check whether to add or remove permissions
    if (message.guild.channels.find(channel => channel.name === loungeName).permissionsFor(memberEdit).has("CONNECT", true) === true) {
        // If user currently has permissions, remove
        await message.guild.channels.find(channel => channel.name === loungeName).overwritePermissions(memberEdit, {
            "CONNECT": null
        }).catch(console.error);
        // return string noting results
        if (memberEdit.displayName) {
            // memberEdit was a guildMember
            return "Lounge Bypass privileges successfully removed for "+memberEdit.displayName;
        }
        // memberEdit was a role
        return "Lounge Bypass privileges successfully removed for "+memberEdit.name;
    }
    // If user does not have permissions, add
    await message.guild.channels.find(channel => channel.name === loungeName).overwritePermissions(memberEdit, {
        "CONNECT": true
    }).catch(console.error);
    // return string noting results
    if (memberEdit.displayName) {
        // memberEdit was a guildMember
        return "Lounge Bypass privileges successfully added for "+memberEdit.displayName;
    }
    // memberEdit was a role
    return "Lounge Bypass privileges successfully added for "+memberEdit.name;
}