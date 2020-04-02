/**
* The map command returns stats about a tagpro map
* @param {string} name/id - the name/id of a map to look up
*/

const Discord = require('discord.js');
const axios = require('axios');

exports.run = async (client, message, args, level) => {
     // return if no arguments were provided
    if (!args || args.length < 1) {
        return await message.reply("\nSorry, you didn't provide enough arguments.\nTry this: !map [name]").catch(console.error);
    }
    let mapStats = JSON.parse(client.botText.getTextStatus.get("tagproMapStatistics").status);
    let productionKey = Object.keys(mapStats).find(key => key.toLowerCase() === args.join(" ").toLowerCase());
    if (productionKey) {
        let currentMap = mapStats[productionKey];
        const mapEmbed = new Discord.RichEmbed()
                .setTitle(`Statistics for ${productionKey} [${currentMap.category}]`)
                .setDescription(`Author(s): ${currentMap.author}`)
                .addField("Average Rating",currentMap.averageRating,false)
                .addField("Total Plays",currentMap.totalPlays,true)
                .addField("Total Users",currentMap.totalUsers,true)
                .addField("Total Ratings",currentMap.totalRatings,true)
                .addField("Total Likes",currentMap.totalLikes,true)
                .addField("Total Indifferents",currentMap.totalIndifferents,true)
                .addField("Total Dislikes",currentMap.totalDislikes,true)
                .addField("Average Likes",currentMap.averageLikes,true)
                .addField("Average Indifferents",currentMap.averageIndifferents,true)
                .addField("Average Dislikes",currentMap.averageDislikes,true)
                .setImage(`https://static.koalabeast.com/images/maps/${encodeURIComponent(currentMap.key)}.png`)
                .setFooter(`Last Update: ${mapStats["TToC_lastUpdate"]}`)
                .setColor('DARK_GOLD');
            return await message.channel.send(mapEmbed).catch(console.error);
    }
    return await message.channel.send("Sorry, that map doesn't have any statistics available.").catch(console.error);
};

exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: [],
    permLevel: "User"
};

exports.help = {
    name: "mapstats",
    category: "tagpro",
    description: "get detailed data for production maps",
    usage: "mapstats [map]"
};