// poll command creates a poll using given arguments

const Discord = require('discord.js');

exports.run = async (client, message, args, level) => {
    if (!args || args.length < 1) { 
        return message.channel.send("Sorry, I didn't detect any arguments.");
    }
    args = args.join(" ");
    args = args.split("|");
    if (args.length < 3) {
        return message.channel.send("Sorry, I didn't detect enough arguments.");
    }
    message.delete();
    const exampleEmbed = new Discord.RichEmbed()
        .setColor('DARK_GOLD')
        .setTitle("Poll: "+args[0])        
        .setFooter("Created by: "+message.member.displayName)
        .setTimestamp();
    let optionArr = ["A", "B", "C", "D", "E", "F", "G", "H", "I"];
    let reactArr = ["🇦", "🇧", "🇨", "🇩", "🇪", "🇫", "🇬", "🇭", "🇮"];
    let numOptions = 10;
    if (args.length < 10) {
        numOptions = args.length;
    }
    for (let i = 1; i < numOptions; i++) {
        exampleEmbed.addField("Option "+optionArr[i-1],args[i],false);
    }
    let sentPoll = await message.channel.send(exampleEmbed);
    for (let i = 1; i < numOptions; i++) {
        await sentPoll.react(reactArr[i-1]);
    }
};

exports.conf = {
    enabled: true,
    guildOnly: true,
    aliases: ["p"],
    permLevel: "User"
};

exports.help = {
    name: "poll",
    category: "Miscellaneous",
    description: "Create a poll! Separate each option with |",
    usage: "poll question | optionA | optionB | optionC"
};