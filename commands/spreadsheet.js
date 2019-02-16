// The spreadsheet command returns the current season's spreadsheet for the user

exports.run = (client, message, args, level) => {
    let tournamentStatus = client.botStatus.getBotStatus.get("tournaments");
    if (tournamentStatus.status === 0) {
        // If a tournament is not running, prevent message
        message.channel.send("Sorry, signups are currently closed for TToC.");
    }
    else {
        let currentSheet = client.botText.getTextStatus.get("FormSetup");
        if (currentSheet && currentSheet.status) {
            let info = JSON.parse(currentSheet.status);
            message.channel.send(`Here's the Season ${info[0]} spreadsheet: <${info[1]}>`);
        }
        else {
            message.channel.send("Sorry, there was an error getting the spreadsheet.");
        }
    }
};

exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: ["ss"],
    permLevel: "User"
};

exports.help = {
    name: "spreadsheet",
    category: "Tournaments",
    description: "Gives the current spreadsheet",
    usage: "spreadsheet"
};