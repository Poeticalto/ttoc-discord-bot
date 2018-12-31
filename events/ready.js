// Ready event runs once the client is connected.
// Note that due to the binding of client to every event, every event
// goes `client, other, args` when this function is run.

module.exports = (client) => {
    // log ready status
    console.log(`Ready to serve in ${client.channels.size} channels on ${client.guilds.size} servers, for a total of ${client.users.size} users.`);
    console.log(`Logged in as ${client.user.tag}!`);
    // set bot presence
    client.user.setPresence({
        game: {
            name: '!help for commands',
            type: 'PLAYING'
        },
        status: 'online'
    });
}