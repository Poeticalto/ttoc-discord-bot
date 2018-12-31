// setposition command allows user to edit their position in the tournamentusers db

exports.run = (client, message, args, level) => {
    // log command
    client.logger.log(`(${message.member.id}) ${message.member.displayName} used command setposition with args ${args}`);
    // return if not enough arguments were given
    if (!args || args.length < 1) return message.reply("\nSorry, you didn't provide enough arguments.\nTry this: !register [position]");
    // split arguments
    let [positionProcess] = args.splice(0);
    // get the user from the tournamentusers db
    let currentUser = client.tournaments.getTournamentUser.get(message.author.id);
    if (!currentUser) {
        // return if the user is not in the tournamentusers db
        return message.reply("Sorry, your information was not found! Please use the !register command to set it!");
    }
    else {
        //	otherwise check the position argument
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
        // check if argument passed
        if (registerCheck == 1) {
            // if argument is germane, write changes to tournamentusers db
            currentUser.position = positionProcess;
            client.tournaments.setTournamentUser.run(currentUser);
            // if user is signed up for a tournament, update signup
            if (currentUser.pstatus > 0) {
                client.tournaments.updateSignup(client, currentUser, "Edit");
            }
            return message.reply("Your position has been changed to " + positionProcess + "!");
        }
        else {
            // give user warning message
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