const config = {
    // Bot Owner, level 10 by default. A User ID. Should never be anything else than the bot owner's ID.
    "ownerID": "BOT OWNER DISCORD ID",

    // Bot Admins, level 9 by default. Array of user ID strings.
    "admins": ["ADMIN DISCORD ID"],

    // Bot Support, level 8 by default. Array of user ID strings
    "support": ["SUPPORT DISCORD ID"],

    // Your Bot's Token. Available at https://discordapp.com/developers/applications/me
    "discordToken": "BOT DISCORD TOKEN",

    // Default per-server settings. New guilds have these settings.

    // DO NOT LEAVE ANY OF THESE BLANK, AS YOU WILL NOT BE ABLE TO UPDATE THEM
    // VIA COMMANDS IN THE GUILD.

    "defaultSettings" : {
        "prefix": "!",
        "modRole": "Moderator",
        "adminRole": "Admin"
    },

    // Your Bot's Twitch Token. Available at https://dev.twitch.tv/docs/authentication/#registration
    "twitchToken": "BOT TWITCH TOKEN",

    // Settings for Rainbow roles, make sure the bot role is above the rainbow role on the server.
    "rainbowColorsNum": 24,
    "rainbowColorsSpeed": 1000, // Do not use a number higher than 1000

    // Settings for bad words that are checked by the bot. Add or delete as needed.
    "addBadWords": ["creo"],
    "removeBadWords": ["god"],

    // spreadsheetId is the Google Sheet to communicate with for tournament running.
    "spreadsheetId": "SPREADSHEET ID",

    // The following are the parts of the form builder used to submit responses for tournament running.
    // Form link is the first part, replace ID
    "tournamentFormLink": "https://docs.google.com/forms/d/e/FORM_ID_HERE/formResponse?",
    // The rest are the IDs for each question asked on the form. They should follow the format entry.1234567890
    // Name is the name of the player
    "tournamentFormName": "entry.NUMBER",
    // Pos is the position of the player
    "tournamentFormPos": "entry.NUMBER",
    // Mic is whether or not the player has a mic to use
    "tournamentFormMic": "entry.NUMBER",
    // Ping is what ping the player has to the server
    "tournamentFormPing": "entry.NUMBER",
    // Cap is whether or not the player is signing up as a captain
    "tournamentFormCap": "entry.NUMBER",
    // form type is whether the player being submmitted is being added, edited, or removed
    "tournamentFormType": "entry.NUMBER",

    // permList is used to define roles which can assign team abbreviations starting with a certain letter.
    "permList": {
        "M": ["MLTP Captain"],
        "A": ["NLTP Captain"],
        "T": ["NFTL Captain"],
        "E": ["ELTP Captain"],
        "O": ["OLTP Captain"],
    },
    // teamList defines the team roles which each role above can assign.
    "teamList": {
        "M": ["MGGB"],
        "A": ["AICP"],
        "T": ["TRSP"],
        "E": [],
        "O": []
    },
    // leagueList defines the league roles which can be added
    "leagueList": ["MLTP", "NLTP", "ELTP", "OLTP", "NFTL"],
    // trashChannel is the channel where deleted messages are sent.
    "trashChannel": "name of trash channel",
    "welcomeChannel": "name of welcome channel",

    // PERMISSION LEVEL DEFINITIONS.

    permLevels: [
        // This is the lowest permisison level, this is for non-roled users.
        { level: 0,
         name: "User",
         // Don't bother checking, just return true which allows them to execute any command their
         // level allows them to.
         check: () => true
        },

        // This is your permission level, the staff levels should always be above the rest of the roles.
        { level: 2,
         // This is the name of the role.
         name: "Moderator",
         // The following lines check the guild the message came from for the roles.
         // Then it checks if the member that authored the message has the role.
         // If they do return true, which will allow them to execute the command in question.
         // If they don't then return false, which will prevent them from executing the command.
         check: (message) => {
             try {
                 // Moderator is given if the member has any of the following roles
                 if (message.member.roles.some(r=>["MLTP Captain", "NLTP Captain", "NFTL Captain", "Moderator"].includes(r.name))) return true;
                 else return false;
             } catch (e) {
                 return false;
             }
         }
        },

        { level: 3,
         name: "Administrator",
         check: (message) => {
             try {
                 // member is given administrator if they have any of the following roles
                 if (message.member.roles.some(r=>["Admin", "MLTP CRC", "NLTP CRC"].includes(r.name))) return true;
                 else return false;
             } catch (e) {
                 return false;
             }
         }
        },
        // This is the server owner.
        { level: 4,
         name: "Server Owner",
         // Simple check, if the guild owner id matches the message author's ID, then it will return true.
         // Otherwise it will return false.
         check: (message) => message.channel.type === "text" ? (message.guild.ownerID === message.author.id ? true : false) : false
        },

        // Bot Support is a special inbetween level that has the equivalent of server owner access
        // to any server they joins, in order to help troubleshoot the bot on behalf of owners.
        { level: 8,
         name: "Bot Support",
         // The check is by reading if an ID is part of this array. Yes, this means you need to
         // change this and reboot the bot to add a support user. Make it better yourself!
         check: (message) => config.support.includes(message.author.id)
        },

        // Bot Admin has some limited access like rebooting the bot or reloading commands.
        { level: 9,
         name: "Bot Admin",
         check: (message) => config.admins.includes(message.author.id)
        },

        // This is the bot owner, this should be the highest permission level available.
        // The reason this should be the highest level is because of dangerous commands such as eval
        // or exec (if the owner has that).
        { level: 10,
         name: "Bot Owner",
         // Another simple check, compares the message author id to the one stored in the config file.
         check: (message) => message.client.config.ownerID === message.author.id
        }
    ]
};

module.exports = config;