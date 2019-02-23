// The preparesignups command sets up a new tournament

exports.run = (client, message, args, level) => {
    let tournamentStatus = client.botStatus.getBotStatus.get("tournaments");
    if (tournamentStatus.status === 0) {
        message.channel.send("Setting up a new tournament!");
        // call gApp function FormSetup()
        client.gApps.callAppsScript("FormSetup",client,client.gApps.oAuth2Client);
    }
    else {
        message.channel.send("Incorrect tournament state.");   
    }    
};

exports.conf = {
    enabled: true,
    guildOnly: true,
    aliases: [],
    permLevel: "Bot Owner"
};

exports.help = {
    name: "ps",
    category: "Tournaments",
    description: "Prepare tournament signups",
    usage: "ps"
};