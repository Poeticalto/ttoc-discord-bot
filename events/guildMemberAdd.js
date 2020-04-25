/**
* The guildMemberAdd event runs anytime a user joins a guild and checks whether user is properly verified with the bot
* @param {client} client - client object for the bot
* @param {snowflake} member - member object for user that just joined the guild
*/

module.exports = async (client, member) => {
    // fetch member for processing
    await member.guild.fetchMember(member.user).catch(console.error);
    // get Some Ball role
    let someBallRole = member.guild.roles.find(role => role.name === "Some Ball");
    // get user from usersDB
    let userDBdata = client.usersDB.getUserByDiscord.get(member.user.id);
    // check if user has verified
    // user has not verified before
    if (!userDBdata || userDBdata.vstatus == 0 || userDBdata.vstatus == 1) {
        // add some ball role to user
        await member.addRole(someBallRole).catch(console.error);
        // get user's discord account age by using the snowflake
        let currentTime = new Date().getTime();
        let dateCreated = (parseInt(member.id) / 4194304) +  1420070400000;
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
        // send age of user to join-feed
        await member.guild.channels.find(channel => channel.name === "join-feed").send(`Age of ${member} is: ${convertedDifference}`).catch(console.error);
        // send message to the user about verification
        return await member.user.send("Welcome to the " + member.guild.name + " Discord, " + member + "!\nYou need to be verified before you are allowed to chat in general channels. Please do `!verify ID` here whenever you're ready, where ID is replaced with one of the following:\nraw ID (example: `!verify 53bdf282c9bab5f82768e4ad`)\nprofile link (example: `!verify https://tagpro.koalabeast.com/profile/53bdf282c9bab5f82768e4ad`)\nPlease use <https://tagpro.koalabeast.com> to retrive your profile link. If you need assistance with finding your profile link, contact an admin.").catch(console.error);
    }
    // user has verified, but did not meet admission standards
    if (userDBdata.vcount == 217253) {
        // add some ball role to user
        await member.addRole(someBallRole).catch(console.error);
        // resend notification that user requires manual verification
        await member.guild.channels.find(channel => channel.name === "join-feed").send(`${member} requires manual verification: <https://tagpro.koalabeast.com/profile/${userDBdata.tagproid}>`).catch(console.error);
        // remind user that they still need to be manually verified
        return await member.user.send("Welcome back to the " + member.guild.name + " Discord, " + member + "!\nYour profile was previously successfully verified but required manual approval due to not meeting certain age requirements for automatic admissision. Don't worry, an admin will contact you shortly to help with manual admission.").catch(console.error);
    }
    // user successfully verified before, so welcome the user again
    if (userDBdata.oldroles !== null && userDBdata.oldroles !== "") {
        let oldRolesParse = JSON.parse(userDBdata.oldroles);
        await member.addRoles(oldRolesParse).catch(console.error);
    }
    else {
        let noneRole = member.guild.roles.find(role => role.name === "None");
        await member.addRole(noneRole).catch(console.error);
    }
    return await member.user.send(`Howdy ${member}, welcome back to the ${member.guild.name} Discord!\nTo get my help, just type any of these commands in a server channel to start:\n\nCommand [Argument] :: Description\n!help                                  :: Gives all available commands\n!league [abbr]                 :: Gives a league role\n!lounge [name]               :: Creates a voice lounge in the General Lounges section\n\nBy default, you will only receive notifications on this server when you are mentioned. If you don't know how to set up notifications for channels on Discord, read the following:\n<https://support.discordapp.com/hc/en-us/articles/215253258-Notifications-Settings-101>`).catch(console.error);
};