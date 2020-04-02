/**
* pinfo command gets information about a user/ID
* @param {string/snowflake} ID/user - the ID/user to get information about
*/

exports.run = async (client, message, args, level) => { // eslint-disable-line no-unused-vars
    let userData;
    if (message.mentions.members.keyArray().length > 0) {
        userData = client.usersDB.getUserByDiscord.get(message.mentions.members.keyArray()[0]);
        if (!userData) {
            return await message.channel.send("Discord user does not have a verified profile.").catch(console.error); 
        }
    }
    else if (message.mentions.roles.keyArray().length > 0) {
        return await message.channel.send("OH NO BABY! WHAT IS YOU DOING??? (Give me a tagged member or a tagpro name please c:)").catch(console.error);
    }
    else {
        userData = client.usersDB.getUserByTagProName.get(args.join(" "));
        if (!userData) {
            return await message.channel.send("TagPro user does not have an associated Discord profile.").catch(console.error);
        }
    }
    await message.channel.send(`Information for ${message.guild.members.get(userData.discordid)}:\nAge: ${getAge(userData.discordid)}\nTagPro Name: ${userData.tagproname}\nTagPro Profile: <https://tagpro.koalabeast.com/profile/${userData.tagproid}>`).catch(console.error);
};

exports.conf = {
    enabled: true,
    guildOnly: true,
    aliases: [],
    permLevel: "Moderator"
};

exports.help = {
    name: "pinfo",
    category: "System",
    description: "Get information about a member",
    usage: "pinfo tagpro name / @member"
};

function getAge(id) {
    let currentTime = new Date().getTime();
    let dateCreated = (parseInt(id) / 4194304) +  1420070400000;
    let differenceTime = currentTime - dateCreated;
    let convertedDifference = "";
    if (differenceTime < 60000) {
        convertedDifference = (differenceTime / 1000) + " seconds";
    }
    else if (differenceTime < 3600000) {
        convertedDifference = (differenceTime / 60000) + " minutes";
    }    
    else if (differenceTime < 86400000) {
        convertedDifference = (differenceTime / 3600000) + " hours";
    }
    else {
        convertedDifference = (differenceTime / 86400000) + " days";
    }
    return convertedDifference;
}