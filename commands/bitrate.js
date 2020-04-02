/**
* Allows a lounge admin to change the bitrate of the voice channel
* @param {integer} bitrate - integer value to set bitrate of channel to [8-128]
*/

exports.run = async (client, message, args, level) => {
    // return if no argument was provided
    if (!args || args.length < 1) return await message.channel.send("\nSorry, you didn't provide enough arguments.\nTry this: !bitrate [8-128]").catch(console.error);
    // return if no member or role was found
    if (isNaN(args[0]) || Math.floor(args[0]) < 8 || Math.floor(args[0]) > 128) {
        return await message.channel.send("Sorry, a number between 8 and 128 was not detected.\nTry this: !bitrate [8-128]").catch(console.error);
    }
    // otherwise, check if the command was done inside a lounge
    if (message.channel.parent !== null && (message.channel.parent.name === "General Lounges" || message.channel.parent.name === "MLTP" || message.channel.parent.name === "NLTP")&& message.channel.name.split("")[1]==="-") {
        // check if the member is a lounge admin
        if (message.channel.permissionsFor(message.member).has("MANAGE_MESSAGES", true) === true) {
            // get voice lounge name
            const loungeName = message.channel.topic;
            await message.guild.channels.find(channel => channel.name === loungeName).setBitrate(Math.floor(parseInt(args[0]))).catch(console.error);
            return await message.channel.send("Successfully set bitrate to "+Math.floor(parseInt(args[0]))+" kbps!").catch(console.error);
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
    name: "bitrate",
    category: "Lounges",
    description: "changes the bitrate of the voice channel",
    usage: "bitrate [8-128]"
};