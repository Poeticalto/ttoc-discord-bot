const Discord = require('discord.js');
const fs = require("fs");
const path = require('path');
const pathToCatLinks = path.join(__dirname, '../cats.json');
const cats = require(pathToCatLinks);

exports.run = async (client, message, args, level) => { // eslint-disable-line no-unused-vars
    let randomCat;
    if (!args || args.length < 1){
        randomCat = Math.floor(Math.random() * Math.floor(Object.keys(cats).length-1));
    }
    else {
        let [numProcess] = args.splice(0);
        if (isNaN(numProcess) === false) {
            numProcess = Math.floor(numProcess);
            if (numProcess <= Object.keys(cats).length-1 && numProcess >= 0) {
                randomCat = numProcess;
            }
            else {
                randomCat = Math.floor(Math.random() * Math.floor(Object.keys(cats).length-1));
            }
        }
        else {
            randomCat = Math.floor(Math.random() * Math.floor(Object.keys(cats).length-1));
        }
    }
    const exampleEmbed = new Discord.RichEmbed()
    .setColor('RANDOM')
    .setImage(cats[randomCat]["Link"])
    .setTimestamp()
    .setFooter('Submitted by ' + cats[randomCat]["Author"] + ' [ID: ' + randomCat + ']');
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