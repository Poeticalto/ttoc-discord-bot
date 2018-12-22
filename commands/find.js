exports.run = async (client, message, args, level) => { // eslint-disable-line no-unused-vars
	client.logger.log(`(${message.member.id}) ${message.member.displayName} used command find with args ${args}`);
    const member = message.mentions.members.first();
    if (!member) {
		if (!args) return message.channel.send('Need to @mention a user/bot to find.');
		else {
			const testMember = message.guild.members.find(member => member.displayName.toLowerCase() === args.join(" ").toLowerCase());
			if (!testMember) return message.channel.send(`${args.splice(0)} not found. Make sure the name or mention is correct.`);
			if (!testMember.voiceChannel) return message.channel.send(`${testMember.displayName} is not connected to a voice channel.`);
			return message.channel.send(`${testMember.displayName} is currently in ${testMember.voiceChannel}.`);
		}
	}
    if (!member.voiceChannel) return message.channel.send(`${member.displayName} is not connected to a voice channel.`);
    message.channel.send(`${member.displayName} is currently in ${member.voiceChannel}.`);
};

exports.conf = {
    enabled: true,
    guildOnly: true,
    aliases: [],
    permLevel: "User"
};

exports.help = {
    name: "find",
    category: "Miscellaneous",
    description: "Finds what voice channel a member is in",
    usage: "find [name or mention]"
};