// setmic allows a user to set their mic status in the tournamentusers db

exports.run = async (client, message, args, level) => {
    // log command
    client.logger.log(`(${message.member.id}) ${message.member.displayName} used command setmic with args ${args}`);
    // return if user didn't provide enough arguments
    if (!args || args.length < 1) return message.reply("\nSorry, you didn't provide enough arguments.\nTry this: !setmic [mic]");
    // extract mic status from args
    let [micProcess] = args.splice(0);
    // get the user from the tournamentusers db
    let currentUser = client.tournaments.getTournamentUser.get(message.author.id);
    // return if user is not defined in the tournamentusers db
    if (!currentUser) {
        return message.reply("Sorry, your information was not found! Please use the !register command to set it!");
    }
    else {
        // otherwise, check to see if mic value is correct
        let registerCheck = 0;
        let warning = "";
        // check the mic
        micProcess = micProcess.toLowerCase();
        if (micProcess == "yes" || micProcess == "y") {
            micProcess = "Yes";
            registerCheck++;
        }
        else if (micProcess == "no" || micProcess == "n") {
            micProcess = "No";
            registerCheck++;
        }
        else {
            warning += "\nYour mic status was not detected. Please use Yes if you have a mic or No if you do not.";
        }
        if (registerCheck == 1) {
            // if mic value is germane, set mic status
            currentUser.mic = micProcess;
            // write changes to db
            client.tournaments.setTournamentUser.run(currentUser);
            // if user is currently signed up for a tournament, send a signup update
            if (currentUser.pstatus > 0) {
                client.tournaments.updateSignup(client, currentUser, "Edit");
            }
            return message.reply("Your mic status has been changed to " + micProcess + "!");
        }
        else {
            //tell user that mic status was not accepted
            return message.reply(warning + "\nPlease use the following format: !setmic [mic]");
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
    name: "setmic",
    category: "Tournaments",
    description: "Sets the user's mic status for tournaments.",
    usage: "setmic [mic]"
};