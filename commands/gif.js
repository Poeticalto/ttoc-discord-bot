// The gif command embeds a gif for your friends of a given tag
// if no tag is given, a random gif is returned

const Discord = require('discord.js');
const axios = require('axios');

exports.run = (client, message, args, level) => {
    let tag;
    if (!args){
        tag = "";
    }
    else {
        tag = args.join("+");
        console.log(tag);
    }
    axios.defaults.baseURL = "http://api.giphy.com/v1/gifs/random?tag="+tag+"&api_key="+client.config.giphyToken+"&rating=g&limit=1";
    axios.get()
        .then(function (response) {
        if (!!response.data) {
            const exampleEmbed = new Discord.RichEmbed()
                .setImage(response.data.data.images.original.url)
                .setColor('RANDOM');
            message.channel.send(exampleEmbed);
        }
        })
        .catch(function (error) {
            message.channel.send("Sorry, I couldn't get a gif of that.");
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