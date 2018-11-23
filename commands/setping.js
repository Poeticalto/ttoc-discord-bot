const fs = require("fs");
path = require('path')
var pathToUserGroups = path.join(__dirname, '../usergroups.json');
var userGroups = require(pathToUserGroups);

exports.run = async (client, message, args, level) => {
	if (!args || args.length < 1) return message.reply("\nSorry, you didn't provide enough arguments.\nTry this: !setping [ping]");
	var [pingProcess] = args.splice(0);
	var author = message.author.tag;
	var tournamentUsersList = Object.keys(userGroups.tournamentUsers);
	if (tournamentUsersList.indexOf(author) > -1)
	{
		var registerCheck = 0;
		var warning = "";
		if (isNaN(pingProcess) === false)
		{
			pingProcess = Math.floor(pingProcess);
			if (pingProcess > 0 && pingProcess <= 300)
			{
				registerCheck++;
			}
			else
			{
				warning += "\nYour ping seems to be slightly exaggerated. Please use a number between 1 and 300.";
			}
		}
		else
		{
			warning += "\nYour ping was not detected. Please use an integer between 1 and 300.";
		}
		if (registerCheck == 1)
		{
			userGroups.tournamentUsers[author].ping = pingProcess;
			fs.writeFile(pathToUserGroups, JSON.stringify(userGroups, null, 4), 'utf8');
			return message.reply("Your ping has been changed to " + pingProcess + "!");
		}
		else
		{
			return message.reply(warning + "\nPlease use the following format: !setping [ping]");
		}
	}
	else
	{
		return message.reply("Sorry, your information was not found! Please use the !register command to set it!");
	}
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: "User"
};

exports.help = {
  name: "setping",
  category: "Tournaments",
  description: "Sets the user's ping for tournaments.",
  usage: "setping [ping]"
};