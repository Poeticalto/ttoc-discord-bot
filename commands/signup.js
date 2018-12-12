const axios = require('axios');

exports.run = async (client, message, args, level) => {
    let currentUser = client.getTournamentUser.get(message.author.id);
    if (!currentUser)
    {// user doesn't exist
        return message.reply("Sorry, your information isn't currently saved! Use !register to add your information!");
    }
    else if (currentUser.pstatus >= 1)
    {// remove signup
        currentUser.pstatus = 0;
        client.setTournamentUser.run(currentUser);
        return message.reply("Your signup has been removed!");
    }
    else
    {// add signup
        currentUser.pstatus = 1;
        client.setTournamentUser.run(currentUser);
        return message.reply("Your signup has been added!");
    }
};

exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: [],
    permLevel: "Bot Admin"
};

exports.help = {
    name: "signup",
    category: "Tournaments",
    description: "Signs user up for a tournament as a player",
    usage: "signup"
};