// The alert command gives or removes alert status for a tournament user

exports.run = (client, message, args, level) => {
    let currentUser = client.tournaments.getTournamentUser.get(message.author.id);
    if (!currentUser) {
        return message.channel.send("Sorry, your information was not found in the bot. Save your information using !register in order to use this command to get tournament alerts!");
    }
    else {
        if (currentUser.alertstatus === 1) {
            currentUser.alertstatus = 0;
            client.tournaments.setTournamentUser.run(currentUser);
            return message.channel.send("Success! You will no longer receive messages whenever a tournament occurs!");
        }
        else {
            currentUser.alertstatus = 1;
            client.tournaments.setTournamentUser.run(currentUser);
            return message.channel.send("Success! You will now receive messages whenever a tournament occurs!");            
        }
    }
};

exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: ["alerts"],
    permLevel: "User"
};

exports.help = {
    name: "alert",
    category: "Tournaments",
    description: "adds a player to get tournament notifications",
    usage: "alert"
};