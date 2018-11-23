exports.run = async (client, message, args, level) => {
	processRole("TToC Alerts", message.member, message);
};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: [],
  permLevel: "User"
};

exports.help = {
  name: "alert",
  category: "Tournaments",
  description: "adds a player to get tournament notifications",
  usage: "alert"
};

function processRole(abbrProcess, memberEdit, message)
{
	roleToCheck = message.guild.roles.find(role => role.name === abbrProcess);
	if (memberEdit.roles.has(roleToCheck.id))
	{
		memberEdit.removeRole(roleToCheck).catch(console.error);
		message.channel.send(abbrProcess+" role successfully removed!");
	}
	else
	{
		memberEdit.addRole(roleToCheck).catch(console.error);
		message.channel.send(abbrProcess+" role successfully added!");
	}
}