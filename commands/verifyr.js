/**
* Adds, updates, or removes a user's tagpro profile from the users database.
* 
* @param {string} id/@user - user's tagpro profile ID or profile link OR user mention
*/

exports.run = async (client, message, args, level) => {
    if (message.mentions.users.keyArray().length >= 1) {
        let deadUser = client.usersDB.getUserByDiscord.get(message.mentions.users.first().id);
        if (deadUser) {
            let oldID = deadUser.tagproid;
            deadUser.vstatus = 0;
            deadUser.tagproid = "WRIG is the coolest guy ever";
            client.usersDB.setUser.run(deadUser);
            return await message.channel.send(`Successfully removed profile ${oldID} from ${message.mentions.users.first()}`).catch(console.error);
        }
        return await message.channel.send(`${message.mentions.users.first()} does not have an associated TagPro profile.`).catch(console.error);
    }
    // check if the proper number of arguments have been made
    if (!args || args.length == 0 || args.length > 1) {
        return await message.author.send("Invalid number of arguments detected. Please do `!verifyr ID`, where ID is replaced with one of the following:\nraw ID (example: `!verify 53bdf282c9bab5f82768e4ad`)\nprofile link (example: `!verify https://tagpro.koalabeast.com/profile/53bdf282c9bab5f82768e4ad`)\nPlease use <https://tagpro.koalabeast.com> to retrive your profile link.").catch(console.error);
    }
    // assign a var to manipulate down to the raw ID
    let tempID = args[0];
    // ID should be 24 characters long, so further changes are needed if the value is not 24 characters long
    if (tempID.length !== 24) {
        // ID cannot be less than 24 characters, so return as invalid
        if (tempID.length < 24) {
            return await message.author.send("The ID you provided was too short. Please ensure your ID is correct and do `!verifyr ID`, where ID is replaced with one of the following:\nraw ID (example: `!verify 53bdf282c9bab5f82768e4ad`)\nprofile link (example: `!verify https://tagpro.koalabeast.com/profile/53bdf282c9bab5f82768e4ad`)\nPlease use <https://tagpro.koalabeast.com> to retrive your profile link.").catch(console.error);
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
        return await message.author.send("The ID you provided was invalid. Please ensure your ID is correct and do `!verifyr ID`, where ID is replaced with one of the following:\nraw ID (example: `!verify 53bdf282c9bab5f82768e4ad`)\nprofile link (example: `!verify https://tagpro.koalabeast.com/profile/53bdf282c9bab5f82768e4ad`)\nPlease use <https://tagpro.koalabeast.com> to retrive your profile link.").catch(console.error);
    }
    let userCheck = client.usersDB.getUserByTagPro.get(tempID);
    if (userCheck && userCheck.tagproid && userCheck.tagproid == tempID ) {
        userCheck.vstatus = 0;
        userCheck.tagproid = "WRIG is the coolest guy ever";
        client.usersDB.setUser.run(userCheck);
        return await message.channel.send(`Successfully removed profile ${tempID} from ${message.guild.members.get(userCheck.discordid)}`).catch(console.error);
    }
    return await message.channel.send(`TagPro profile ${tempID} is not associated with a user.`).catch(console.error);
};

exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: [],
    permLevel: "Administrator"
};

exports.help = {
    name: "verifyr",
    category: "Miscellaneous",
    description: "Removes a TagPro Profile from the users database",
    usage: "verifyr ID/@user"
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