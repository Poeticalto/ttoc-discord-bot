// The preparesignups command sets up a new tournament

exports.run = (client, message, args, level) => {
    let tournamentStatus = client.botStatus.getBotStatus.get("tournaments");
    if (tournamentStatus.status === 1) {
        message.channel.send("Preparing tournament draft!");
        // call gApp function FormSetup()
        client.gApps.callAppsScript("DraftBoardSetup",client,client.gApps.oAuth2Client);
    }
    else {
        message.channel.send("Wrong state");
    }
};

exports.conf = {
    enabled: true,
    guildOnly: true,
    aliases: [],
    permLevel: "Bot Owner"
};

exports.help = {
    name: "pd",
    category: "Tournaments",
    description: "Prepare tournament draft",
    usage: "pd"
};