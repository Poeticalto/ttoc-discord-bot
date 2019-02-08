// register command adds user to the tournamentusers db

exports.run = async (client, message, args, level) => {
    // return if not enough arguments were provided
    if (!args || args.length < 4) return message.reply("\nSorry, you didn't provide enough arguments.\nTry this: !register [Position] [Mic] [Ping] [tagproName]\nEx: !register Both Yes 20 TToC_BOT");
    // split arguments into corresponding vars
    let [positionProcess, micProcess, pingProcess, ...tagproName] = args.splice(0);
    // concatenate tagproName
    tagproName = tagproName.join(" ");
    // check if user is already registered in the tournamentusers db
    let registerPlayer = client.tournaments.getTournamentUser.get(message.author.id);
    let lowerPlayer = client.tournaments.getLowerUser.get(tagproName.toLowerCase());
    if (!!lowerPlayer) {
        return message.channel.send("Sorry, someone else has that tagpro username, try another name!");
    }
    // if user is not defined
    if (!registerPlayer) {
        // registerCheck defines how many checks have passed
        let registerCheck = 0;
        // warning concatenates all arguments which failed
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
        // if arguments passed all checks, register the user
        if (registerCheck == 3) {
            // create object to pass into db
            registerPlayer = {
                id: message.author.id,
                tagproname: tagproName,
                position: positionProcess,
                mic: micProcess,
                ping: pingProcess,
                pstatus: 0,
                lowername: tagproName.toLowerCase(),
                alertstatus: 0
            };
            // write user information to db
            client.tournaments.setTournamentUser.run(registerPlayer);
            return message.reply("Your information has been added! You can now use the !signup command to sign up for tournaments!");
        }
        else {
            // tell user which arguments where incorrect
            return message.reply(warning + "\nPlease use the following format: !register [position] [mic] [ping] [tagproName]\nEx: !register Both Yes 20 TToC_BOT");
        }
    }
    else {
        // tell user their information is already saved
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