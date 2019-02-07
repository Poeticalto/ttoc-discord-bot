// map command returns information about a tagpro map

const Discord = require('discord.js');

exports.run = async (client, message, args, level) => {
     // return if no arguments were provided
    if (!args || args.length < 1) return message.reply("\nSorry, you didn't provide enough arguments.\nTry this: !map [name]");
    // get map name
    let mapName = args.join(" ");
    let mapData = client.maps.getMap.get(mapName.toLowerCase());
    if (!mapData) {
        return message.channel.send("Sorry, that map doesn't exist. Try a different name!");
    }
    else {
        const exampleEmbed = new Discord.RichEmbed()
            .setTitle(mapData.standardid)
            .setDescription('By: '+mapData.author)
            .setImage(mapData.image)
            .setColor('DARK_GOLD');
        return message.channel.send(exampleEmbed);
    }    
};

exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: [],
    permLevel: "User"
};

exports.help = {
    name: "map",
    category: "tagpro",
    description: "Gets a tagpro group on the specified server",
    usage: "group [server]"
};