exports.run = async (client, message, args, level) => {
	client.logger.log(`(${message.member.id}) ${message.member.displayName} used command scrim with args ${args}`);
	let scrimCheck;
    const leagueList = client.config.leagueList;
    const channelName = message.channel.name;
    if (leagueList.indexOf(message.channel.parent.name) > -1 && channelName.indexOf("general") === -1) {
        const teamName = channelName.split('-').map((s) => s.charAt(0).toUpperCase() + s.substring(1)).join(' ');
		scrimCheck = client.getScrimPlayer.get(message.channel.id);
        if (!scrimCheck) {
            scrimCheck = {
				"id": message.channel.id,
				"name": teamName,
				"nametype": message.channel.parent.name
			};
            client.setScrimPlayer.run(scrimCheck);
			await message.channel.send(teamName + " added to scrim list!");
        }
        else {
            client.deleteScrimPlayer.run(message.channel.id);
			await message.channel.send(teamName + " removed from scrim list!");
        }
		updateScrimList(client, message.guild);
    }
    else {
        scrimCheck = client.getScrimPlayer.get(message.member.id);
		if (!scrimCheck) {
			scrimCheck = {
				"id": message.member.id,
				"name": message.member.displayName,
				"nametype": "Players"
			};
			client.setScrimPlayer.run(scrimCheck);
			await message.channel.send(message.member.displayName + " added to scrim list!");
		}
		else {
			client.deleteScrimPlayer.run(message.member.id);
			await message.channel.send(message.member.displayName + " removed from scrim list!");
		}
        updateScrimList(client, message.guild);
    }
};

function updateScrimList(client, guild) {
	const scrimListRaw = client.getScrimList.all();
	let leagueConcat = "";
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
		let teamConcat = y + ": ";
		for (let i = 0; i < currentLeague.length; i++) {
			if (i < (currentLeague.length -1)) {
				teamConcat += currentLeague[i] + ", ";
			}
			else {
				teamConcat += currentLeague[i];
			}
		}
		leagueConcat += "\n" + teamConcat;
	}
    const scrimChannel = guild.channels.find(channel => channel.name === "looking-for-scrim");
	scrimChannel.setTopic("Available Players/Teams:" + leagueConcat);
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