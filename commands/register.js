exports.run = async (client, message, args, level) => {
    if (!args || args.length < 4) return message.reply("\nSorry, you didn't provide enough arguments.\nTry this: !register [Position] [Mic] [Ping] [tagproName]");
    let [positionProcess, micProcess, pingProcess, ...tagproName] = args.splice(0);
    tagproName = tagproName.join(" ");
    let registerPlayer = client.getTournamentUser.get(message.author.id);
    if (!registerPlayer) {
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
        // check the ping
        if (isNaN(pingProcess) === false) {
            pingProcess = Math.floor(pingProcess);
            if (pingProcess > 0 && pingProcess <= 300) {
                registerCheck++;
            }
            else {
                warning += "\nYour ping seems to be slightly exaggerated. Please use a number between 1 and 300.";
            }
        }
        else {
            warning += "\nYour ping was not detected. Please use an integer between 1 and 300.";
        }
        if (registerCheck == 3) {
            registerPlayer = {
                id: message.author.id,
                tagproname: tagproName,
                position: positionProcess,
                mic: micProcess,
                ping: pingProcess,
                pstatus: 0
            };
            client.setTournamentUser.run(registerPlayer);
            return message.reply("Your information has been added! You can now use the !signup command to sign up for tournaments!");
        }
        else {
            return message.reply(warning + "\nPlease use the following format: !register [position] [mic] [ping] [tagproName]");
        }
    }
    else {
        return message.reply("Sorry, your information is already saved! Use !signup to sign up for tournaments!");
    }
};

exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: [],
    permLevel: "User"
};

exports.help = {
    name: "register",
    category: "Tournaments",
    description: "Saves user information to the bot for tournaments! Remember to use !signup to sign up for the tournament!",
    usage: "register [Position] [Mic] [Ping] [tagproName]"
};