/**
* The guildMemberUpdate event runs anytime a member object is changed
* @param {client} client - client object for the bot
* @param {snowflake} oldMember - member object for user before the update happened
* @param {snowflake} newMember - member object for user after the update happened
*/

module.exports = async (client, oldMember, newMember) => {
    // get some ball role
    let someBallRole = newMember.guild.roles.find(role => role.name === "Some Ball");
    // ignore if the member does not have the some ball role previously
    if (!oldMember.roles.has(someBallRole.id)) {
        // if the member didn't have the Some Ball role, we don't care
        return;
    }
    // check if the some ball role was removed from the user
    if ((oldMember.roles.has(someBallRole.id)) && (!newMember.roles.has(someBallRole.id))) {
        // get default role for users
        const blankRole = newMember.guild.roles.find(role => role.name === "None");
        // add default role
        await newMember.addRole(blankRole).catch(console.error);
        // get user data from the bot and update
        let userTest = client.usersDB.getUserByDiscord.get(newMember.user.id);
        if (userTest && userTest.vcount && userTest.vcount == 217253) {
            userTest.vcount = 0;
            client.usersDB.updateUser.run(userTest);
            newMember.setNickname(userTest.tagproname);
        }
        // inform user they are good to go
        await newMember.send(`Howdy ${newMember}, you've been successfully verified and are free to roam around the server!\nTo get my help, just type any of these commands in a server channel to start:\n\nCommand [Argument] :: Description\n!help                                  :: Gives all available commands\n!league [abbr]                 :: Gives a league role\n!lounge [name]               :: Creates a voice lounge in the General Lounges section\n\nBy default, you will only receive notifications on this server when you are mentioned. If you don't know how to set up notifications for channels on Discord, read the following:\n<https://support.discordapp.com/hc/en-us/articles/215253258-Notifications-Settings-101>\n\n\n**Remember to change your TagPro name back to its original name!**\nIn addition, your nickname has automatically been changed to your TagPro name to help everyone identify you easier. If you wish to change your nickname, just click on Competitive TagPro on the top left and click Change Nickname to change it!`).catch(console.error);
    }
};