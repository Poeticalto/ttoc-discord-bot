/**
* The vkick command forcibly disconnects a user connected to a voice channel
* Note that this command is now deprecated since Discord now natively supports it
* @param {string} id/@user - user's tagpro profile ID or profile link OR user mention
*/

exports.run = async (client, message, args, level) => {
    // get the mentioned member
    const member = message.mentions.members.first();
    // return if no member was mentioned
    if (!member) { 
        return await message.reply('Need to @mention a user/bot to voice kick.').catch(console.error);
    }
    // return if the member is not connected to a voice channel
    if (!member.voiceChannel) {
        return await message.reply('That user/bot isn\'t in a voice channel.').catch(console.error);
    }
    // create a temp channel to move the user into
    const temp_channel = await message.guild.createChannel(member.id, 'voice', [
        {id: message.guild.id, // prevent everyone from viewing the channel
         denied: ['VIEW_CHANNEL', 'CONNECT', 'SPEAK'] },
        {id: client.user.id, // make sure the bot can see the channel
         allowed: ['VIEW_CHANNEL', 'CONNECT', 'SPEAK'] },
        {id: member.id, // prevent the member from doing anything while in the channel
         denied: ['VIEW_CHANNEL', 'CONNECT', 'SPEAK'] }
    ]).catch(console.error);
    // move the user to the new voice channel
    await member.setVoiceChannel(temp_channel).catch(console.error);
    // delete the new voice channel
    await temp_channel.delete().catch(console.error);
    // delete the command message
    await message.delete().catch(console.error);
};

exports.conf = {
    enabled: true,
    guildOnly: true,
    aliases: ["vk"],
    permLevel: "Administrator"
};

exports.help = {
    name: "vkick",
    category: "System",
    description: "kicks a player from a voice channel",
    usage: "vkick [@user]"
};