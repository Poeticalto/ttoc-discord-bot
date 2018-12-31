// The cat command returns a picture of a cat inside a rich embed.
const Discord = require('discord.js');
const fs = require("fs");
const path = require('path');
const pathToCatLinks = path.join(__dirname, '../cats.json');
const cats = require(pathToCatLinks);
// cats.json holds a list containing links to cat pictures

exports.run = async (client, message, args, level) => { // eslint-disable-line no-unused-vars
    let randomCat;
    if (!args || args.length < 1){
        // if user didn't provide a cat, get a random number for picture
        randomCat = Math.floor(Math.random() * Math.floor(Object.keys(cats).length-1));
    }
    else {
        // if user did provide a number, check that number is actually a number
        let [numProcess] = args.splice(0);
        if (isNaN(numProcess) === false) {
            // user floor to coerce any decimals to an integer
            numProcess = Math.floor(numProcess);
            // check that the number provided can be accessed in cats.json
            if (numProcess <= Object.keys(cats).length-1 && numProcess >= 0) {
                // if number can be accessed, assign number
                randomCat = numProcess;
            }
            else {
                // otherwise, assign a random integer
                randomCat = Math.floor(Math.random() * Math.floor(Object.keys(cats).length-1));
            }
        }
        else {
            // if user did not provide a number, assign a random integer
            randomCat = Math.floor(Math.random() * Math.floor(Object.keys(cats).length-1));
        }
    }
    // create a rich embed to hold the cat picture
    const exampleEmbed = new Discord.RichEmbed()
    .setColor('RANDOM')
    .setImage(cats[randomCat]["Link"])
    .setTimestamp()
    .setFooter('Submitted by ' + cats[randomCat]["Author"] + ' [ID: ' + randomCat + ']');
    // send the cat picture to the channel
    message.channel.send(exampleEmbed);
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
    description: "Sends a cat! ID can be specified for a specific cat.",
    usage: "cat [ID]"
};