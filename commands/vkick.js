exports.run = async (client, message, args, level) => { // eslint-disable-line no-unused-vars
	if (!message.guild.me.hasPermission(['MANAGE_CHANNELS', 'MOVE_MEMBERS'])) return message.reply('Sorry, missing permissions.');
	
	const member = message.mentions.members.first();
	if (!member) return message.reply('Need to @mention a user/bot to voice kick.');
	if (!member.voiceChannel) return message.reply('That user/bot isn\'t in a voice channel.');
	
	const temp_channel = await message.guild.createChannel(user.id, 'voice', [
		{id: guild.id,
		deny: ['VIEW_CHANNEL', 'CONNECT', 'SPEAK'], },
		{id: member.id,
		deny: ['VIEW_CHANNEL', 'CONNECT', 'SPEAK'] }
	]);
	await temp_channel.delete();
	
	message.reply('User successfully kicked!');
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: "Bot Admin"
};

exports.help = {
  name: "vkick",
  category: "Miscelaneous",
  description: "kicks a player from a voice channel",
  usage: "vkick [@user]"
};