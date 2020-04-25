/**
* The guildMemberRemove event runs anytime a user leaves a guild
* @param {client} client - client object for the bot
* @param {snowflake} member - member object for user that just joined the guild
*/

module.exports = async (client, member) => {
    // get user from usersDB
    let userDBdata = client.usersDB.getUserByDiscord.get(member.user.id);
    // check if user has verified
    // user has not verified before or did not meet admission standards
    if (!userDBdata || userDBdata.vstatus == 0 || userDBdata.vstatus == 1 || userDBdata.vcount == 217253) {
        // don't need to do anything since the only role to add back is the some ball role, which is already handled on rejoin
        return;
    }
    let memberRoles = member.roles.keyArray();
    if (memberRoles && memberRoles.length && memberRoles.length > 0) {
        userDBdata.oldroles = JSON.stringify(memberRoles);
        client.usersDB.setUser.run(userDBdata);
    }
};