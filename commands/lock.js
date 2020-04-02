/**
* lock command locks a voice lounge and prevents the everyone role from connecting
*/

exports.run = async (client, message, args, level) => {
    // check that message was sent in a voice lounge
    if (message.channel.parent !== null && (message.channel.parent.name === "General Lounges" || message.channel.parent.name === "MLTP" || message.channel.parent.name === "NLTP") && message.channel.name.split("")[1]==="-") {
        // check that member is a lounge admin
        if (message.channel.permissionsFor(message.member).has("MANAGE_MESSAGES", true) === true) {
            // get lounge name
            const loungeName = message.channel.topic;
            // process permissions
            processPermissions(message.guild.defaultRole, message, loungeName);
        }
        else {
            // tell user they do not have permission
            return await message.channel.send("Sorry, you don't have permission to do that.").catch(console.error);
        }
    }
    else {
        // tell user they are in the wrong channel
        return await message.channel.send("Sorry, you can't use that command here.").catch(console.error);
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

async function processPermissions(memberEdit, message, loungeName) {
    // check if voice lounge is locked or not
    if (message.guild.channels.find(channel => channel.name === loungeName).permissionsFor(memberEdit).has("CONNECT", true) === true) {
        // if channel is not locked, lock the channel
        await message.guild.channels.find(channel => channel.name === loungeName).overwritePermissions(memberEdit, {
            "CONNECT": false
        }).catch(console.error);
        return await message.channel.send("Lounge successfully locked.").catch(console.error);
    }
    // if channel is locked, unlock the channel
    await message.guild.channels.find(channel => channel.name === loungeName).overwritePermissions(memberEdit, {
        "CONNECT": true
    }).catch(console.error);
    return await message.channel.send("Lounge successfully unlocked.").catch(console.error);
}