/**
* The Ready event runs once the client is connected.
* @param {client} client - client object for the bot
*/

const schedule = require("node-schedule");

module.exports = async (client) => {
    // log ready status
    console.log(`Ready to serve in ${client.channels.size} channels on ${client.guilds.size} servers, for a total of ${client.users.size} users.`);
    console.log(`Logged in as ${client.user.tag}!`);
    // set bot presence
    await client.user.setPresence({
        game: {
            name: '!help for commands',
            type: 'PLAYING'
        },
        status: 'online'
    }).catch(console.error);
    setInterval(function(){ client.emit("updateStreams"); }, 60000);
    setInterval(function(){ 
        client.emit("verifyCheck");
    }, 30000);
    let resetScrimList = schedule.scheduleJob('0 0 5 * * *', function(){
        // clear scrim list at 5 AM local time
        client.scrimList.clearScrimList.run();
        client.guilds.first().fetchMembers();
        client.logger.log("scrim list db cleared.");
    });
    client.flairDB.ready(client);
    let lockedUsers = client.naltpDB.rescueLockedUsers.all(1);
    if (lockedUsers && lockedUsers.length && lockedUsers.length > 0) {
        for (let i = 0; i < lockedUsers.length; i++) {
            let currentLockedUser = lockedUsers[i];
            let messageMember = client.guilds.first().members.get(currentLockedUser.discordid);
            currentLockedUser.islocked = 0;
            client.naltpDB.setUser.run(currentLockedUser);
            await messageMember.user.send("Sorry, but WRIG's daughter seems to have unplugged one of my cords and I had to shut down as a result. Your data is still saved, but unfortunately you'll have to restart the app to continue. Message `!naltp` here when you're ready to continue!").catch(console.error);
        }
    }
    await client.guilds.first().fetchMembers().catch(console.error);
}