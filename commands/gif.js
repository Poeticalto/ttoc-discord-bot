/**
* The gif command embeds a gif for your friends of a given tag
* @param {string} tags - the tags to search for in a gif
*/

const Discord = require('discord.js');
const axios = require('axios');

exports.run = async (client, message, args, level) => {
    let tag;
    if (!args || args.length < 1){
        tag = "random";
    }
    else {
        tag = args.join("+");
    }
    axios.defaults.baseURL = `https://api.tenor.com/v1/random?key=${client.config.tenorToken}&q=${tag}&locale=en_US&contentfilter=medium&media_filter=minimal&ar_range=all&limit=1`;
    axios.get()
    .then(async function (response) {
        if (!!response.data) {
            const exampleEmbed = new Discord.RichEmbed()
                .setImage(response.data.results[0].media[0].gif.url)
                .setColor('RANDOM');
            return await message.channel.send(exampleEmbed).catch(console.error);
        }
        })
        .catch(async function (error) {
            return await message.channel.send("Sorry, I couldn't get a gif of that.").catch(console.error);
    });
};

exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: [],
    permLevel: "User"
};

exports.help = {
    name: "gif",
    category: "Miscellaneous",
    description: "gets a random gif, or optionally for a given tag",
    usage: "gif [tag]"
};