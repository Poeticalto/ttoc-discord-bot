/**
* Stores tagpro profile in the users db
* 
* @param {string} id - user's tagpro profile ID or profile link
* @param {string} user - discord mention of user to attach profile to
*/

exports.run = async (client, message, args, level) => {
    if (message.mentions.users.keyArray().length === 0) {
        return await message.channel.send("Sorry, a player was not detected.\nTry this: !verifya ID @user").catch(console.error);
    }
    // check if the proper number of arguments have been made
    if (!args || args.length == 0 || args.length > 2) {
        return await message.channel.send("Invalid number of arguments detected. Please do `!verifya ID @user`, where ID is replaced with one of the following:\nraw ID (example: `!verify 53bdf282c9bab5f82768e4ad`)\nprofile link (example: `!verify https://tagpro.koalabeast.com/profile/53bdf282c9bab5f82768e4ad`)").catch(console.error);
    }
    // assign a var to manipulate down to the raw ID
    let tempID = args[0];
    // ID should be 24 characters long, so further changes are needed if the value is not 24 characters long
    if (tempID.length !== 24) {
        // ID cannot be less than 24 characters, so return as invalid
        if (tempID.length < 24) {
            return await message.channel.send("The ID you provided was too short. Please ensure the ID is correct and do `!verifya ID @user`, where ID is replaced with one of the following:\nraw ID (example: `!verify 53bdf282c9bab5f82768e4ad`)\nprofile link (example: `!verify https://tagpro.koalabeast.com/profile/53bdf282c9bab5f82768e4ad`)\nPlease use <https://tagpro.koalabeast.com> to retrive your profile link. If you need assistance with finding your profile link, contact an admin.").catch(console.error);
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
        return await message.channel.send("The ID you provided was invalid. Please ensure your ID is correct and do `!verifya ID @user`, where ID is replaced with one of the following:\nraw ID (example: `!verify 53bdf282c9bab5f82768e4ad`)\nprofile link (example: `!verify https://tagpro.koalabeast.com/profile/53bdf282c9bab5f82768e4ad`)\nPlease use <https://tagpro.koalabeast.com> to retrive your profile link.").catch(console.error);
    }
    let userCheck = client.usersDB.getUserByTagPro.get(tempID);
    if (userCheck && userCheck.tagproid && userCheck.tagproid == tempID ) {
        return await message.channel.send("The ID you provided is already registered to another Discord account. Please ensure you are on the correct account. Use !verifyr ID/@player to remove the ID first before attaching it to a new profile.").catch(console.error);
    }
    let user = {
        discordid: message.mentions.users.first().id,
        tagproid: tempID,
        tagproname: "WRIGISTHEBEST",
        verifyname: "I<3WRIG",
        vstatus: 226078,
        vcount: 0
    };
    client.usersDB.updateUser.run(user);
    return await message.channel.send(`Profile ${tempID} has been attached to ${message.mentions.users.first()} and is currently queued for a name update.`).catch(console.error);
};

exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: [],
    permLevel: "Administrator"
};

exports.help = {
    name: "verifya",
    category: "Miscellaneous",
    description: "Stores tagpro profile in the users db",
    usage: "verifya [ID] @user"
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