exports.run = async (client, message, args, level) => {
    let currentUser = client.tournaments.getTournamentUser.get(message.author.id);
    if (!currentUser) {// user doesn't exist
        return message.reply("Sorry, your information isn't currently saved! Use !register to add your information!");
    }
    else if (currentUser.pstatus === 100) {// demote to player
        currentUser.pstatus = 1;
        client.tournaments.updateSignup(client, currentUser, "Edit");
        return message.reply("Your signup has been changed to player!");
    }
    else if (currentUser.pstats > 100) {
        return message.reply("Sorry, you can't revoke your captain status after the draft has started!");
    }
    else {// add signup
        currentUser.pstatus = 100;
        client.tournaments.setTournamentUser.run(currentUser);
        client.tournaments.updateSignup(client, currentUser, "Edit");
        return message.reply("Your signup has been changed to captain!");
    }
};

exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: [],
    permLevel: "User"
};

exports.help = {
    name: "captain",
    category: "Tournaments",
    description: "Signs user up for a tournament as a captain",
    usage: "captain"
};