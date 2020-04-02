/**
* The cat command returns a picture of a cat inside a rich embed.
*/

const Discord = require('discord.js');
const axios = require('axios');

exports.run = async (client, message, args, level) => { // eslint-disable-line no-unused-vars
    axios.create({
      baseURL: 'https://api.thecatapi.com/v1/images/search',
      timeout: 1000,
      headers: {'x-api-key': client.config.catApiToken}
    }).get().then(async function (response) {
        // create an embed to send the cat
        const exampleEmbed = new Discord.RichEmbed()
        .setTitle('A random cat appeared!')
        .setColor('RANDOM')
        .setImage(response.data[0].url)
        .setFooter('Retrieved using TheCatAPI');
        // send the cat
        await message.channel.send(exampleEmbed).catch(console.error);
    })
        .catch(async function (error) {
        await message.channel.send("Sorry, there was an error getting your cat.").catch(console.error);
        console.log(error);
    });
};

exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: [],
    permLevel: "User"
};

exports.help = {
    name: "cat",
    category: "Miscellaneous",
    description: "Sends a cat!",
    usage: "cat"
};