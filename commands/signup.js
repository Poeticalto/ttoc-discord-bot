// signup command allows a user to sign up for a bot tournament

const axios = require('axios');

exports.run = async (client, message, args, level) => {
    // log command
    client.logger.log(`(${message.member.id}) ${message.member.displayName} used command signup with args ${args}`);
    // get user data from the tournamentusers db
    let currentUser = client.tournaments.getTournamentUser.get(message.author.id);
    if (!currentUser) {
        // return if user doesn't exist in the db
        return message.reply("Sorry, your information isn't currently saved! Use !register to add your information!");
    }
    else if (currentUser.pstatus >= 1) {
        // if user is already signed up, remove the user from the tournament
        currentUser.pstatus = 0;
        client.tournaments.setTournamentUser.run(currentUser);
        client.tournaments.updateSignup(client, currentUser, "Remove");
        message.reply("Your signup has been removed!");
    }
    else {
        // check tournament status
        let tournamentStatus = client.botStatus.getBotStatus.get("tournaments");
        if (tournamentStatus.status === 0) {
            // If a tournament is not running, prevent signup
            message.channel.send("Sorry, signups are currently closed for TToC.");
        }
        else {
            // otherwise, sign user up for the tournament
            currentUser.pstatus = 1;
            client.tournaments.setTournamentUser.run(currentUser);
            client.tournaments.updateSignup(client, currentUser, "Add");
            message.reply("Your signup has been added!");
        }
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