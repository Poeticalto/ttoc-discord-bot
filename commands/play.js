/**
* Play command allows for arbitrary playing of resources
* @param {snowflake} user/role - the user/role to add/remove bypass permissions for
*/

exports.run = async (client, message, args, level) => {
    if (!args || args.length < 1) { 
        return await message.channel.send("Sorry, I didn't detect any arguments.").catch(console.error);
    }
    if (message.member && message.member.voiceChannel) {
        await message.member.voiceChannel.join()
        .then(connection => {
            const dispatcher = connection.playArbitraryInput(args[0]);
            dispatcher.on('end', () => {
                message.member.voiceChannel.leave();
            });
        })
        .catch(console.error);
    }
    else {
        return await message.channel.send("Failed to connect to voice channel.").catch(console.error);
    }
    
};

exports.conf = {
    enabled: true,
    guildOnly: true,
    aliases: [],
    permLevel: "Bot Owner"
};

exports.help = {
    name: "play",
    category: "Miscellaneous",
    description: "Play a file!",
    usage: "play url"
};