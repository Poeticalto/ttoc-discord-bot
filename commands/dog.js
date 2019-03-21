// The dog command returns a picture of a dog inside a rich embed.
const Discord = require('discord.js');
const axios = require('axios');

exports.run = async (client, message, args, level) => { // eslint-disable-line no-unused-vars
    axios.create({
      baseURL: 'https://api.thedogapi.com/v1/images/search',
      timeout: 1000,
      headers: {'x-api-key': client.config.dogApiToken}
    }).get().then(function (response) {
        // title is used to describe the dog if the info is available.
        let title;
        if (response.data[0].breeds[0]) {
            // temperament key describes the dog in the image and is a string of traits like "cool, happy, fun"
            // so split into an array and use random() to grab a random index
            // note that random() is defined in functions.js in the modules folder
            title = response.data[0].breeds[0].temperament.split(", ").random().toLowerCase();
            // vowel regex checks if a or an should be used
            let vowelRegex = '^[aeiou].*';
            if (title.match(vowelRegex)) {
                title = `An ${title} ${response.data[0].breeds[0].name} appeared!`;
            }
            else {
                title = `A ${title} ${response.data[0].breeds[0].name} appeared!`;
            }
        }
        else {
            // if no breed data was sent, send a default message instead
            title = "A random dog appeared!";
        }
        // create an embed to send the dog
        const exampleEmbed = new Discord.RichEmbed()
        .setTitle(title)
        .setColor('RANDOM')
        .setImage(response.data[0].url)
        .setFooter('Retrieved using TheDogAPI');
        // send the dog
        message.channel.send(exampleEmbed);
    })
        .catch(function (error) {
        message.channel.send("Sorry, there was an error getting your dog.");
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
    name: "dog",
    category: "Miscellaneous",
    description: "Sends a dog!",
    usage: "dog"
};