/**
* The scrimlist command returns an embed containing all teams/players who are available to scrim
*/

const Discord = require("discord.js");

exports.run = async (client, message, args, level) => {
    // get the entire scrimlist
    const scrimListRaw = client.scrimList.getScrimList.all();
    // create an embed to fill in with teams
    let exampleEmbed = new Discord.RichEmbed()
    .setAuthor('Available Players/Teams','', '') 
    .setColor('DARK_GOLD')
    .setTimestamp();
    // check how many leagues are in the scrimlist
    if (scrimListRaw.length === 0) {
        // if there are no leagues, then no one is available
        // so, add a field saying no one is available
        exampleEmbed.addField("None", "No teams/players available", false);
    }
    else {
        // otherwise, concatenate teams into an embed field for each league
        // define object to sort teams into by league
        let scrimList = {};
        for (x in scrimListRaw)
        {
            // current index
            const currentPlayer = scrimListRaw[x];
            // if league is not a property, add empty array
            if (!(currentPlayer.nametype in scrimList)){
                scrimList[currentPlayer.nametype] = [];
            };
            // add team to array of league
            scrimList[currentPlayer.nametype].push(currentPlayer.name);
        }
        // move teams into a field for each league
        for (y in scrimList)
        {
            // current index
            const currentLeague = scrimList[y];
            // define team concat string
            let teamConcat = "";
            // concat teams
            for (let i = 0; i < currentLeague.length; i++) {
                if (i < (currentLeague.length -1)) {
                    teamConcat += currentLeague[i] + ", ";
                }
                else {
                    teamConcat += currentLeague[i];
                }
            }
            // add field to embed using league name as the title and the teams as the value
            exampleEmbed.addField(y, teamConcat, false);
        }
    }
    // send the finished rich embed to the channel
    await message.channel.send(exampleEmbed).catch(console.error);
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