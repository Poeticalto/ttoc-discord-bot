const fs = require("fs");
const path = require('path');
var pathToUserGroups = path.join(__dirname, '../usergroups.json');
var userGroups = require(pathToUserGroups);

exports.run = async (client, message, args, level) => {
    if (!args || args.length < 1) return message.reply("\nSorry, you didn't provide enough arguments.\nTry this: !register [position]");
    var [positionProcess] = args.splice(0);
    var author = message.author.tag;
    var tournamentUsersList = Object.keys(userGroups.tournamentUsers);
    if (tournamentUsersList.indexOf(author) > -1)
    {
        var registerCheck = 0;
        var warning = "";
        positionProcess = positionProcess.toLowerCase();
        // check the position
        if (positionProcess == "o" || positionProcess == "offense")
        {
            positionProcess = "O";
            registerCheck++;
        }
        else if (positionProcess == "o/d" || positionProcess == "offense/defense")
        {
            positionProcess = "O/D";
            registerCheck++;
        }
        else if (positionProcess == "b" || positionProcess == "both")
        {
            positionProcess = "Both";
            registerCheck++;
        }
        else if (positionProcess == "d/o" || positionProcess == "defense/offense")
        {
            positionProcess = "D/O";
            registerCheck++;
        }
        else if (positionProcess == "d" || positionProcess == "defense")
        {
            positionProcess = "D";
            registerCheck++;
        }
        else
        {
            warning += "\nYour position was not detected. Please use one of the following: O, O/D, Both, D/O, D.";
        }
        if (registerCheck == 1)
        {
            userGroups.tournamentUsers[author].position = positionProcess;
            fs.writeFile(pathToUserGroups, JSON.stringify(userGroups, null, 4), 'utf8');
            return message.reply("Your position has been changed to " + positionProcess + "!");
        }
        else
        {
            return message.reply(warning + "\nPlease use the following format: !setposition [position]");
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
    name: "setposition",
    category: "Tournaments",
    description: "Sets the user's position for tournaments.",
    usage: "setposition [position]"
};