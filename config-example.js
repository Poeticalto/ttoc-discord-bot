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

    // API Token for TheCatAPI. Available at https://thecatapi.com/signup
    "catApiToken": "token_here",
    // API Token for TheDogAPI. Available at https://thedogapi.com/signup
    "dogApiToken": "token_here",
    // whitelisted websites used for the highlights channel on the server
    "whitelistHighlightLinks": ["gfycat.com","imgur.com","streamable.com","clips.twitch.tv"],
    // spreadsheet to get stuff from 
    "spreadsheetId": "id_here",
    // ID for Google Apps Script to run stuff from
    "appScriptToken": "token_here",
    // API Token for Tenor. Available at https://tenor.com/developer/keyregistration
    "tenorToken": "token_here",
    // Settings for bad words that are checked by the bot. Add or delete as needed.
    "addBadWords": ["creo"],
    "removeBadWords": ["god"],

    // leagueList defines the league roles which can be added
    "leagueList": ["MLTP", "NLTP", "ELTP", "OLTP", "NFTL", "Retired"],
    // trashChannel is the channel where deleted messages are sent.
    "trashChannel": "name of trash channel",
    // welcomeChannel is the welcome channel
    "welcomeChannel": "name of welcome channel",
    // highlightsChannel is the channel where highlights are posted
    "highlightsChannel": "name of highlights channel",
    // customLoungeSections allows for lounges outside of general lounges section
    "customLoungeSections": ["MLTP","NLTP"],
    // privateLoungeSections allows for private lounges to be created
    "privateLoungeSections": ["channel name"],
    // gAppKey is the key from google OAuth
    "gAppKey": {"installed":{"client_id":"client_id_here","project_id":"project_id_here","auth_uri":"https://accounts.google.com/o/oauth2/auth","token_uri":"https://oauth2.googleapis.com/token","auth_provider_x509_cert_url":"https://www.googleapis.com/oauth2/v1/certs","client_secret":"client_secret_here","redirect_uris":["http://localhost"]}},
    // gAppToken is the token from google OAuth
    "gAppToken": {"access_token":"access_token_here","refresh_token":"refresh_token_here","scope":"https://www.googleapis.com/auth/script.scriptapp https://www.googleapis.com/auth/script.container.ui https://www.googleapis.com/auth/forms https://www.googleapis.com/auth/spreadsheets https://www.googleapis.com/auth/script.external_request https://www.googleapis.com/auth/script.projects","token_type":"Bearer","expiry_date":0},

    // PERMISSION LEVEL DEFINITIONS.
    // check will check based on a message, while mcheck checks based on the user. Both of these are used for different purposes in the bot.
    permLevels: [
        // This is the lowest permisison level, this is for non-roled users.
        { level: 0,
         name: "User", 
         // Don't bother checking, just return true which allows them to execute any command their
         // level allows them to.
         check: () => true,
         mcheck: () => true
        },
        { level: 1,
        name: "Verified",
        check: (message) => {
             try {
                 if (message.member.roles.some(r=>["MLTP", "NLTP", "ELTP", "OLTP", "NFTL", "Retired", "None"].includes(r.name))) return true;
                 else return false;
             } catch (e) {
                 return false;
             }
         },
         mcheck: (member) => {
             try {
                 if (member.roles.some(r=>["MLTP", "NLTP", "ELTP", "OLTP", "NFTL", "Retired", "None"].includes(r.name))) return true;
                 else return false;
             }catch (e) {
                 return false;
             }
         }
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
                 if (message.member.roles.some(r=>["MLTP Captain", "Minors Captain", "NLTP Captain", "NFTL Captain","Tournament Runners"].includes(r.name))) return true;
                 else return false;
             } catch (e) {
                 return false;
             }
         },
         mcheck: (member) => {
             try {
                 if (member.roles.some(r=>["MLTP Captain", "Minors Captain", "NLTP Captain", "NFTL Captain","Tournament Runners"].includes(r.name))) return true;
                 else return false;
             }catch (e) {
                 return false;
             }
         }
        },

        { level: 3,
         name: "Administrator", 
         check: (message) => {
             try {
                 if (message.member.roles.some(r=>["Admin", "MLTP CRC", "NLTP CRC","Bots"].includes(r.name))) return true;
                 else return false;
             } catch (e) {
                 return false;
             }
         },
         mcheck: (member) => {
             try {
                 if (member.roles.some(r=>["Admin", "MLTP CRC", "NLTP CRC","Bots"].includes(r.name))) return true;
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
         check: (message) => message.channel.type === "text" ? (message.guild.ownerID === message.author.id ? true : false) : false,
         mcheck: (member) => member.guild.ownerID === member.user.id ? true : false
        },

        // Bot Support is a special inbetween level that has the equivalent of server owner access
        // to any server they joins, in order to help troubleshoot the bot on behalf of owners.
        { level: 8,
         name: "Bot Support",
         // The check is by reading if an ID is part of this array. Yes, this means you need to
         // change this and reboot the bot to add a support user. Make it better yourself!
         check: (message) => config.support.includes(message.author.id),
         mcheck: (member) => config.support.includes(member.user.id)
        },

        // Bot Admin has some limited access like rebooting the bot or reloading commands.
        { level: 9,
         name: "Bot Admin",
         check: (message) => config.admins.includes(message.author.id),
         mcheck: (member) => config.admins.includes(member.user.id)
        },

        // This is the bot owner, this should be the highest permission level available.
        // The reason this should be the highest level is because of dangerous commands such as eval
        // or exec (if the owner has that).
        { level: 10,
         name: "Bot Owner", 
         // Another simple check, compares the message author id to the one stored in the config file.
         check: (message) => message.client.config.ownerID === message.author.id,
         mcheck: () => false
        }
    ]
};

module.exports = config;