exports.run = async (client, message, args, level) => {
    if (!args || args.length < 1) return message.reply("\nSorry, you didn't provide enough arguments.\nTry this: !register [position]");
    let [positionProcess] = args.splice(0);
    let currentUser = client.getTournamentUser.get(message.author.id);
    if (!currentUser) {
        return message.reply("Sorry, your information was not found! Please use the !register command to set it!");
    }
    else {
        let registerCheck = 0;
        let warning = "";
        positionProcess = positionProcess.toLowerCase();
        // check the position
        if (positionProcess == "o" || positionProcess == "offense") {
            positionProcess = "O";
            registerCheck++;
        }
        else if (positionProcess == "o/d" || positionProcess == "offense/defense") {
            positionProcess = "O/D";
            registerCheck++;
        }
        else if (positionProcess == "b" || positionProcess == "both") {
            positionProcess = "Both";
            registerCheck++;
        }
        else if (positionProcess == "d/o" || positionProcess == "defense/offense") {
            positionProcess = "D/O";
            registerCheck++;
        }
        else if (positionProcess == "d" || positionProcess == "defense") {
            positionProcess = "D";
            registerCheck++;
        }
        else {
            warning += "\nYour position was not detected. Please use one of the following: O, O/D, Both, D/O, D.";
        }
        if (registerCheck == 1) {
            currentUser.position = positionProcess;
            client.setTournamentUser.run(currentUser);
            return message.reply("Your position has been changed to " + positionProcess + "!");
        }
        else {
            return message.reply(warning + "\nPlease use the following format: !setposition [position]");
        }
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