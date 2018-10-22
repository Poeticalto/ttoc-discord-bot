module.exports = (client) => {
	console.log(`Ready to serve in ${client.channels.size} channels on ${client.guilds.size} servers, for a total of ${client.users.size} users.`);
	console.log(`Logged in as ${client.user.tag}!`);
	client.user.setPresence({
        game: { 
            name: '!help for commands',
            type: 'PLAYING'
        },
        status: 'online'
    });
}