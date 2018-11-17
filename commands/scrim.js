const fs = require('fs');
const path = require('path');
var pathToScrimList = path.join(__dirname, '../scrimList.json');
var scrimList = require(pathToScrimList);

exports.run = async (client, message, args, level) => {
	var leagueList = Object.keys(scrimList);
	if (leagueList.indexOf(message.channel.parent.name) > -1)
	{
		var channelName = message.channel.name.split("-");
		if (channelName[1] === "voice")
		{
			var teamIndex = scrimList[message.channel.parent.name].indexOf(channelName[0]);
			if (teamIndex > -1)
			{
				message.channel.send(channelName[0] + " removed from scrim list!");
				scrimList[message.channel.parent.name].splice(teamIndex, 1);
				fs.writeFile(pathToScrimList, JSON.stringify(scrimList, null, 4), 'utf8');
			}
			else
			{
				scrimList[message.channel.parent.name].push(channelName[0]);
				fs.writeFile(pathToScrimList, JSON.stringify(scrimList, null, 4), 'utf8');
				message.channel.send(channelName[0] + " added to scrim list!");
			}
		}
		else
		{
			checkPlayer(message.author.username, scrimList, message);
		}
	}
	else
	{
		checkPlayer(message.author.username, scrimList, message);
	}
};

function checkPlayer(username, scrimList, message)
{
	console.log("enter player check");
	var playerIndex = scrimList["Players"].indexOf(username);
	if (playerIndex > -1)
	{
		scrimList["Players"].splice(playerIndex, 1);
		fs.writeFile(pathToScrimList, JSON.stringify(scrimList, null, 4), 'utf8');
		message.channel.send(username + " removed from scrim list!");
	}
	else
	{
		scrimList["Players"].push(username);
		fs.writeFile(pathToScrimList, JSON.stringify(scrimList, null, 4), 'utf8');
		message.channel.send(username + " added to scrim list!");
	}
}

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: ["s"],
  permLevel: "User"
};

exports.help = {
  name: "scrim",
  category: "Competitive",
  description: "Adds a team or a player to the scrim list depending on the channel",
  usage: "scrim"
};