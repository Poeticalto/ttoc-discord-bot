/**
* Adds, updates, or removes a user's tagpro profile from the users database.
* 
* @param {string} id - user's tagpro profile ID or profile link
*/

exports.run = async (client, message, args, level) => {
    if (message.guild) {
        await message.delete().catch(console.error);
    }
    // check if user has already verified on this account
    let user = client.usersDB.getUserByDiscord.get(message.author.id);
    if (user && user.vstatus && user.vstatus >= 2) {
        let optionsMenu = await message.author.send(`Howdy ${user.tagproname}, you have already been verified with this profile: <https://tagpro.koalabeast.com/profile/${user.tagproid}>.\n\nPlease select an option below:\nReact 🇦 if you need to update the name associated with your current account.\nReact 🇧 if you need to change the profile currently associated with your account.`).catch(console.error);
        await optionsMenu.react("🇦").catch(console.error);
        await optionsMenu.react("🇧").catch(console.error);
        const optionsfilter = (reaction, user) => {
            return ['🇦', '🇧'].includes(reaction.emoji.name) && user.id === message.author.id;
        };
        await optionsMenu.awaitReactions(optionsfilter, { max: 1, time: 300000, errors: ['time'] })
        .then(async function(collected) {
            const reaction = collected.first();
            if (reaction.emoji.name === '🇦') {
                user.vstatus = 226078;
                await message.author.send("Your profile has been queued for a name update. I'll send you a message once it has been successfully updated!").catch(console.error);
            }
            else if (reaction.emoji.name === '🇧') {
                // temp remove until tweaks to removing system can be made
                /*user.vstatus = 0;
                user.tagproid = "WRIG is the coolest guy ever";
                await message.author.send("Your verification data has been reset. Please type `!verify ID` here with your new profile to run verification on it.").catch(console.error);*/
                await message.author.send("Please contact an admin to assist you with removing your current profile and verifying a new profile.").catch(console.error);
            }
            client.usersDB.setUser.run(user);
        })
        .catch(async (collected) => {
            await message.author.send("Sorry, I did not detect a response and you have timed out. Whenever you are ready, please do `!verify` again.").catch(console.error);
        });
        return;
    }
    // check if the proper number of arguments have been made
    if (!args || args.length == 0 || args.length > 1) {
        return await message.author.send("Invalid number of arguments detected. Please do `!verify ID`, where ID is replaced with one of the following:\nraw ID (example: `!verify 53bdf282c9bab5f82768e4ad`)\nprofile link (example: `!verify https://tagpro.koalabeast.com/profile/53bdf282c9bab5f82768e4ad`)\nPlease use <https://tagpro.koalabeast.com> to retrive your profile link. If you need assistance with finding your profile link, contact an admin.").catch(console.error);
    }
    // assign a var to manipulate down to the raw ID
    let tempID = args[0];
    // ID should be 24 characters long, so further changes are needed if the value is not 24 characters long
    if (tempID.length !== 24) {
        // ID cannot be less than 24 characters, so return as invalid
        if (tempID.length < 24) {
            return await message.author.send("The ID you provided was too short. Please ensure your ID is correct and do `!verify ID`, where ID is replaced with one of the following:\nraw ID (example: `!verify 53bdf282c9bab5f82768e4ad`)\nprofile link (example: `!verify https://tagpro.koalabeast.com/profile/53bdf282c9bab5f82768e4ad`)\nPlease use <https://tagpro.koalabeast.com> to retrive your profile link. If you need assistance with finding your profile link, contact an admin.").catch(console.error);
        }
        // get the last 25 characters in case the user or proxy has added / to the end
        tempID = tempID.slice(-25);
        // check and slice the proper 24 characters accordingly based on if there is a / at the end
        if (tempID.charAt(24) == "/") {
            tempID = tempID.slice(0,24);
        }
        else {
            tempID = tempID.slice(1);
        }
    }
    // IDs must be alphanumeric
    if (isAlphaNumeric(tempID) === false) {
        return await message.author.send("The ID you provided was invalid. Please ensure your ID is correct and do `!verify ID`, where ID is replaced with one of the following:\nraw ID (example: `!verify 53bdf282c9bab5f82768e4ad`)\nprofile link (example: `!verify https://tagpro.koalabeast.com/profile/53bdf282c9bab5f82768e4ad`)\nPlease use <https://tagpro.koalabeast.com> to retrive your profile link. If you need assistance with finding your profile link, contact an admin.").catch(console.error);
    }
    let userCheck = client.usersDB.getUserByTagPro.get(tempID);
    if (userCheck && userCheck.tagproid && userCheck.tagproid == tempID ) {
        return await message.author.send("The ID you provided is already registered to another Discord account. Please ensure you are on the correct account. If this is an alternate account, message an admin for more help.").catch(console.error);
    }
    user = {
        discordid: message.author.id,
        tagproid: tempID,
        tagproname: "WRIGISTHEBEST",
        oldroles: "",
        verifyname: "I<3WRIG",
        vstatus: 1,
        vcount: 0
    };
    client.usersDB.setUser.run(user);
    return await message.author.send("Your ID has been successfully saved as: `" + tempID + "`. If this is an error, please use `!verify` again with your correct ID. You have been added to the queue for verification with the TagPro server. This process is purposefully rate limited to ensure I don't get blocked, so please be patient. c: I'll send a message soon about what to do next!").catch(console.error);
};

exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: [],
    permLevel: "User"
};

exports.help = {
    name: "verify",
    category: "Miscellaneous",
    description: "Stores tagpro profile in the bot db",
    usage: "verify [ID]"
};

function isAlphaNumeric(str) {
  var code, i, len;

  for (i = 0, len = str.length; i < len; i++) {
    code = str.charCodeAt(i);
    if (!(code > 47 && code < 58) && // numeric (0-9)
        !(code > 64 && code < 91) && // upper alpha (A-Z)
        !(code > 96 && code < 123)) { // lower alpha (a-z)
      return false;
    }
  }
  return true;
};