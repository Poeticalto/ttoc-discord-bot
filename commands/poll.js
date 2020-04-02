/**
* Poll command creates a poll using the given arguments
* @param {string} args - the arguments to add for the poll
*/

const Discord = require('discord.js');

exports.run = async (client, message, args, level) => {
    if (!args || args.length < 1) { 
        return await message.channel.send("Sorry, I didn't detect any arguments.").catch(console.error);
    }
    args = args.join(" ");
    args = args.split("|");
    if (args.length < 3) {
        return await message.channel.send("Sorry, I didn't detect enough arguments.").catch(console.error);
    }
    await message.delete().catch(console.error);
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
    let sentPoll = await message.channel.send(exampleEmbed).catch(console.error);
    for (let i = 1; i < numOptions; i++) {
        await sentPoll.react(reactArr[i-1]).catch(console.error);
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