exports.run = async (client, message, args, level) => { // eslint-disable-line no-unused-vars
   const member = message.mentions.members.first();
    if (!member) return message.reply('Need to @mention a user/bot to voice kick.');
    if (!member.voiceChannel) return message.reply('That user/bot isn\'t in a voice channel.');

    const temp_channel = await message.guild.createChannel(member.id, 'voice', [
        {id: message.guild.id,
         deny: ['VIEW_CHANNEL', 'CONNECT', 'SPEAK'], },
        {id: member.id,
         deny: ['VIEW_CHANNEL', 'CONNECT', 'SPEAK'] }
    ]);
	await member.setVoiceChannel(temp_channel);
	console.log("here");
    await temp_channel.delete();
	console.log("test");
    message.reply('User successfully kicked!');
};

exports.conf = {
    enabled: true,
    guildOnly: true,
    aliases: [],
    permLevel: "Bot Admin"
};

exports.help = {
    name: "vkick",
    category: "Miscelaneous",
    description: "kicks a player from a voice channel",
    usage: "vkick [@user]"
};