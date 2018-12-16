exports.run = async (client, message, args, level) => {
	client.logger.log(`(${message.member.id}) ${message.member.displayName} used command setmic with args ${args}`);
    if (!args || args.length < 1) return message.reply("\nSorry, you didn't provide enough arguments.\nTry this: !setmic [mic]");
    let [micProcess] = args.splice(0);
    let currentUser = client.getTournamentUser.get(message.author.id);
    if (!currentUser) {
        return message.reply("Sorry, your information was not found! Please use the !register command to set it!");
    }
    else {
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
            currentUser.mic = micProcess;
            client.setTournamentUser.run(currentUser);
            return message.reply("Your mic status has been changed to " + micProcess + "!");
        }
        else {
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