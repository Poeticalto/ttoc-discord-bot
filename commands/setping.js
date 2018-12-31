// setping command allows user to change their ping value in the tournamentusers db

exports.run = async (client, message, args, level) => {
    // log command
    client.logger.log(`(${message.member.id}) ${message.member.displayName} used command setping with args ${args}`);
    // return if user didn't provide enough arguments
    if (!args || args.length < 1) return message.reply("\nSorry, you didn't provide enough arguments.\nTry this: !setping [ping]");
    // get ping from argumentes
    let [pingProcess] = args.splice(0);
    // get user from tournamentusers db
    let currentUser = client.tournaments.getTournamentUser.get(message.author.id);
    // return if user is not defined in the db
    if (!currentUser) {
        return message.reply("Sorry, your information was not found! Please use the !register command to set it!");   
    }
    else {
        // otherwise, check if ping is an integer greater than 0 and less than 300
        let registerCheck = 0;
        let warning = "";
        // check if ping is integer
        if (isNaN(pingProcess) === false) {
            // round ping down to remove decimals
            pingProcess = Math.floor(pingProcess);
            // check if ping is greater than 0 and less than or equal to 300
            if (pingProcess > 0 && pingProcess <= 300) {
                // if true, pass
                registerCheck++;
            }
            else {
                // otherwise add warning
                warning += "\nYour ping seems to be slightly exaggerated. Please use a number between 1 and 300.";
            }
        }
        else {
            // user did not enter an integer
            warning += "\nYour ping was not detected. Please use an integer between 1 and 300.";
        }
        if (registerCheck == 1) {
            // if ping is germane, edit ping value
            currentUser.ping = pingProcess;
            // write changes to tournamentusers db
            client.tournaments.setTournamentUser.run(currentUser);
            // if user is signed up for a tournament, send an update
            if (currentUser.pstatus > 0) {
                client.tournaments.updateSignup(client, currentUser, "Edit");
            }
            return message.reply("Your ping has been changed to " + pingProcess + "!");
        }
        else {
            // return error to user
            return message.reply(warning + "\nPlease use the following format: !setping [ping]");
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
    name: "setping",
    category: "Tournaments",
    description: "Sets the user's ping for tournaments.",
    usage: "setping [ping]"
};