const Discord = require("discord.js");
exports.run = async (client, message, args, level) => {
	client.logger.log(`(${message.member.id}) ${message.member.displayName} used command scrimlist with args ${args}`);
	const scrimListRaw = client.getScrimList.all();
    let exampleEmbed = new Discord.RichEmbed()
    .setAuthor('Available Players/Teams','', '') 
    .setColor('DARK_GOLD')
    .setTimestamp();
	if (scrimListRaw.length === 0) {
		exampleEmbed.addField("None", "No teams/players available", false);
	}
	else {
		let scrimList = {};
		for (x in scrimListRaw)
		{
			const currentPlayer = scrimListRaw[x];
			if (!(currentPlayer.nametype in scrimList)){
				scrimList[currentPlayer.nametype] = [];
			};
			scrimList[currentPlayer.nametype].push(currentPlayer.name);
		}
		for (y in scrimList)
		{
			const currentLeague = scrimList[y];
			let teamConcat = "";
			for (let i = 0; i < currentLeague.length; i++) {
				if (i < (currentLeague.length -1)) {
					teamConcat += currentLeague[i] + ", ";
				}
				else {
					teamConcat += currentLeague[i];
				}
			}
			exampleEmbed.addField(y, teamConcat, false);
		}
	}
    message.channel.send(exampleEmbed);
};

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