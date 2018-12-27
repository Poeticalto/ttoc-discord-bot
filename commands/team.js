exports.run = async (client, message, args, level) => {
	client.logger.log(`(${message.member.id}) ${message.member.displayName} used command team with args ${args}`);
    if (!args || args.length < 2) return message.channel.send("\nSorry, you didn't provide enough arguments.\nTry this: !team [abbr] @player");
    let [abbrProcess] = args.splice(0);
    const permList = client.config.permList;
    const teamList = client.config.teamList;
    const leagueCheck = abbrProcess.split('')[0].toUpperCase();
	if (teamList[leagueCheck].indexOf(abbrProcess.toUpperCase()) > -1 && (message.member.roles.some(r => permList[leagueCheck].includes(r.name)) || level > 2) && message.mentions.members.keyArray().length > 0) {
		let resultsArr = message.mentions.members.map((member, index, members) => {return processRole(abbrProcess.toUpperCase(), member, message)});
		return message.channel.send("Successfully processed:\n"+resultsArr.join("\n"));
	}
	else if (message.mentions.members.keyArray().length === 0) {
		return message.channel.send("Sorry, I couldn't find a mentioned player. Remember to mention each player instead of typing names!");
	}
	else {
		return message.channel.send("Sorry, you don't have permission to assign this team name.");
	}
};

exports.conf = {
    enabled: true,
    guildOnly: true,
    aliases: [],
    permLevel: "Moderator"
};

exports.help = {
    name: "team",
    category: "Competitive",
    description: "Set team roles for guild members",
    usage: "team [abbr] @player"
};

function processRole(abbrProcess, memberEdit, message) {
    const roleToCheck = message.guild.roles.find(role => role.name === abbrProcess);
    if (memberEdit.roles.has(roleToCheck.id)) {
        memberEdit.removeRole(roleToCheck).catch(console.error);
        return `removed ${abbrProcess} role for ${memberEdit.displayName}`;
    }
    else {
        memberEdit.addRole(roleToCheck).catch(console.error);
        return `added ${abbrProcess} role for ${memberEdit.displayName}`;
    }
}