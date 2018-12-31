// scrim command adds either a user or a team to the scrimlist

exports.run = async (client, message, args, level) => {
    // scrimCheck checks if user/team is already on the scrim list
    let scrimCheck;
    // leagueList gets the sections where a team should be defined instead of a user
    const leagueList = client.config.leagueList;
    // channelName gets the name of the channel
    const channelName = message.channel.name;
    // if channel is inside a league section and it is not a general text channel, then process as team
    if (leagueList.indexOf(message.channel.parent.name) > -1 && channelName.indexOf("general") === -1) {
        // use proper capitalization to coerce as team name
        const teamName = channelName.split('-').map((s) => s.charAt(0).toUpperCase() + s.substring(1)).join(' ');
        // check if team is on the scrimlist
        scrimCheck = client.scrimList.getScrimPlayer.get(message.channel.id);
        if (!scrimCheck) {
            // if team isn't on scrimlist, add team
            scrimCheck = {
                "id": message.channel.id,
                "name": teamName,
                "nametype": message.channel.parent.name
            };
            // write team data to db
            client.scrimList.run(scrimCheck);
            await message.channel.send(teamName + " added to scrim list!");
        }
        else {
            // otherwise, remove the team from the scrimlist db
            client.scrimList.deleteScrimPlayer.run(message.channel.id);
            await message.channel.send(teamName + " removed from scrim list!");
        }
        // update the scrimlist in the #looking-for-scrim channel
        updateScrimList(client, message.guild);
    }
    else {
        // otherwise, add the user to the scrimlist
        // check if user is on the scrim list
        scrimCheck = client.scrimList.getScrimPlayer.get(message.member.id);
        if (!scrimCheck) {
            // if user is not on the scrim list, add user
            scrimCheck = {
                "id": message.member.id,
                "name": message.member.displayName,
                "nametype": "Players"
            };
            // write user data to db
            client.scrimList.setScrimPlayer.run(scrimCheck);
            await message.channel.send(message.member.displayName + " added to scrim list!");
        }
        else {
            // otherwise, remove the user from the scrimlist db
            client.scrimList.deleteScrimPlayer.run(message.member.id);
            await message.channel.send(message.member.displayName + " removed from scrim list!");
        }
        // update the scrimlist in the #looking-for-scrim channel
        updateScrimList(client, message.guild);
    }
};

function updateScrimList(client, guild) {
    // this function updates the scrim list in the #looking-for-scrim channel
    // get the full scrimlist
    const scrimListRaw = client.scrimList.getScrimList.all();
    // define the string to concat teams into
    let leagueConcat = "";
    // define an object to sort db entries into
    let scrimList = {};
    for (x in scrimListRaw)
    {
        // pass teams into the array matching the league
        const currentPlayer = scrimListRaw[x];
        if (!(currentPlayer.nametype in scrimList)){
            scrimList[currentPlayer.nametype] = [];
        };
        scrimList[currentPlayer.nametype].push(currentPlayer.name);
    }
    for (y in scrimList)
    {
        // for each league, concatenate teams into a single string
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
        // add league string to the leagueConcat string
        leagueConcat += "\n" + teamConcat;
    }
    // get the #looking-for-scrim channel
    const scrimChannel = guild.channels.find(channel => channel.name === "looking-for-scrim");
    // change topic to the concatenated list
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