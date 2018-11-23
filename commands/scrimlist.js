const Discord = require('discord.js');
const fs = require('fs');
const path = require('path');
var pathToScrimList = path.join(__dirname, '../scrimList.json');
var scrimList = require(pathToScrimList);

exports.run = async (client, message, args, level) => {
	//var mltpList = concatTeams("MLTP", scrimList);
	//var nltpList = concatTeams("NLTP", scrimList);
	var nftlList = concatTeams("NFTL", scrimList);
	//var uscList = concatTeams("USC", scrimList);
	var playerList = concatTeams("Players", scrimList);	
	const exampleEmbed = new Discord.RichEmbed()
	.setAuthor('Available Players/Teams','', '') 
    .setColor('DARK_GOLD')
    //.addField('MLTP:', mltpList, false)
	//.addField('NLTP:', nltpList, false)
    .addField('NFTL:', nftlList, false)
	//.addField('USC:', uscList, false)
	.addField('Players:', playerList, false)
	.setTimestamp()
    message.channel.send(exampleEmbed);
};

function concatTeams(league, scrimList)
{
	var concatString = "";
	for (var i = 0; i < scrimList[league].length; i++)
	{
		if (i < (scrimList[league].length -1))
		{
			concatString += scrimList[league][i] + ", ";
		}
		else
		{
			concatString += scrimList[league][i];
		}
	}
	if (concatString === "")
	{
		concatString += "None";
	}
	return concatString;
}

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: ["sl"],
  permLevel: "User"
};

exports.help = {
  name: "scrimlist",
  category: "Competitive",
  description: "Gets the list of teams and players available for scrims",
  usage: "scrimlist"
};