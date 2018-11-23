const fs = require("fs");
const path = require('path');
var pathToUserGroups = path.join(__dirname, '../usergroups.json');
var userGroups = require(pathToUserGroups);

exports.run = async (client, message, args, level) => {
    if (!args || args.length < 1) return message.reply("\nSorry, you didn't provide enough arguments.\nTry this: !setmic [mic]");
    var [micProcess] = args.splice(0);
    var author = message.author.tag;
    var tournamentUsersList = Object.keys(userGroups.tournamentUsers);
    if (tournamentUsersList.indexOf(author) > -1)
    {
        var registerCheck = 0;
        var warning = "";
        // check the mic
        micProcess = micProcess.toLowerCase();
        if (micProcess == "yes" || micProcess == "y")
        {
            micProcess = "Yes";
            registerCheck++;
        }
        else if (micProcess == "no" || micProcess == "n")
        {
            micProcess = "No";
            registerCheck++;
        }
        else
        {
            warning += "\nYour mic status was not detected. Please use Yes if you have a mic or No if you do not.";
        }
        if (registerCheck == 1)
        {
            userGroups.tournamentUsers[author].mic = micProcess;
            fs.writeFile(pathToUserGroups, JSON.stringify(userGroups, null, 4), 'utf8');
            return message.reply("Your mic status has been changed to " + micProcess + "!");
        }
        else
        {
            return message.reply(warning + "\nPlease use the following format: !setmic [mic]");
        }
    }
    else
    {
        return message.reply("Sorry, your information was not found! Please use the !register command to set it!");
    }
};

exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: [],
    permLevel: "User"
};

exports.help = {
    name: "setmic",
    category: "Tournaments",
    description: "Sets the user's mic status for tournaments.",
    usage: "setmic [mic]"
};