/*
messageDelete event sends a copy of the deleted message's contents and the author under the following conditions:
1. author is not a bot
2. author did not send a bot command
*/
module.exports = (client, message) => {
	const args = message.content.slice(client.getSettings(message.guild.id).prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();
	const cmd = client.commands.get(command) || client.commands.get(client.aliases.get(command));
	if (!cmd && message.author.bot === false && message.channel.name !== client.config.trashChannel) {
		message.guild.channels.find(channel => channel.name === client.config.trashChannel).send(`Message from ${message.member.displayName} (${message.member.id}) deleted:\n ${message.cleanContent}`).catch(client.logger.log("no trashChannel found"));
	}
}