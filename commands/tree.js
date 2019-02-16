// tree command starts tournament signups and trees tournament information to a channel and everyone with an alert

const Discord = require('discord.js');

exports.run = async (client, message, args, level) => { // eslint-disable-line no-unused-vars
    if (!args || args.length < 1) {
        return message.channel.send("Need a map!");
    }
    let botStatus = {id: "tournaments", status: 1};
    client.tournaments.resetSignups.run();
    client.botStatus.setBotStatus.run(botStatus);
    message.delete();
    let currentSheet = client.botText.getTextStatus.get("FormSetup");
    let map = client.maps.getMap.get(args.join(" ").toLowerCase());
    if (currentSheet && currentSheet.status && map && map.image) {
        let info = JSON.parse(currentSheet.status);
        const exampleEmbed = new Discord.RichEmbed()
        .setAuthor('Sign up for Season '+info[0]+' of the TagPro Tournament of Champions!','', '')
        .setColor('DARK_GOLD')
        .setTitle('Click here for the spreadsheet!')
        .setURL(info[1])
        .setImage(map.image)
        .addField('Server:', 'Dallas', true)
        .addField('Map:', map.standardid, true)
        .addField('To sign up as:', 'Player: Message !signup to TToC_BOT\nCaptain: Message !captain to TToC_BOT', false)
        .addField('Sign up for Tournament notifications!', 'Message !alert to TToC_BOT', false)
        .setFooter('Draft starts at 10:00 PM CST!');
        message.channel.send(exampleEmbed);
        let alertUsers = client.tournaments.getAlertUsers.all();
        for (let i = 0; i < alertUsers.length; i++) {
            console.log(i);
            let currentAlert = message.guild.members.get(alertUsers[i].id);
            if (!currentAlert) {
                alertUsers[i].alertstatus = 2;
                client.tournaments.setTournamentUser.run(alertUsers[i]);
            }
            else {
                await currentAlert.send(exampleEmbed);
            }
        }
    }
    else {
        message.channel.send("Sorry, there was an error getting the spreadsheet.");
    }
};

exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: [],
    permLevel: "Bot Admin"
};

exports.help = {
    name: "tree",
    category: "Tournaments",
    description: "trees tournament information to a specific channel and everyone who has alerts",
    usage: "tree [Map]"
};