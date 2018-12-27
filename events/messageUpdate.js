// The MESSAGEUPDATE event runs every time a message gets edited in a channel the bot can read
// However, this will ignore messages that are edited by bots
// Note that due to the binding of client to every event, every event
// goes `client, other, args` when this function is run.
const Discord = require('discord.js');

module.exports = async function(client, oldMessage, newMessage) {
	// ignore if message was edited in the trash channel or if a bot wrote the original message
	if (oldMessage.channel.name === client.config.trashChannel || oldMessage.author.bot) return;
	// get the trash channel
	const logs = oldMessage.guild.channels.find(channel => channel.name === client.config.trashChannel);
	// if the trash channel does not exist, note it
	if (!logs) {
		console.log("Trash channel not found!");
	}
	else {
		// if the trash channel exists, send the message information
		let newEmbed = new Discord.RichEmbed()
			.setTitle(`Message edited by ${oldMessage.author.username} (${oldMessage.author.id})`)
			.addField("Old Message", oldMessage.cleanContent, false)
			.addField("New Message", newMessage.cleanContent, false)
			.setColor('RED')
			.setFooter(`Message edited in ${oldMessage.channel.name}`);
		logs.send(newEmbed);
	}
}