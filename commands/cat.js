const Discord = require('discord.js');
const fs = require("fs");
path = require('path')
var pathToCatLinks = path.join(__dirname, '../cats.json');
var cats = require(pathToCatLinks);

exports.run = async (client, message, args, level) => { // eslint-disable-line no-unused-vars
	var randomCat = Math.floor(Math.random() * Math.floor(Object.keys(cats).length-1));
	console.log(randomCat);
	console.log(cats[randomCat]["Link"]);
	const exampleEmbed = new Discord.RichEmbed()
		.setColor('RANDOM')
		.setImage(cats[randomCat]["Link"])
		.setTimestamp()
		.setFooter('Cat submitted by ' + cats[randomCat]["Author"]);
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
  category: "Miscelaneous",
  description: "Sends a cat!",
  usage: "cat"
};