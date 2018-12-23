const Discord = require('discord.js');
const axios = require('axios');

module.exports = (client) => {
    console.log("Running updateStreams event");
	const guild = client.guilds.first();
	if (guild && guild.available) {
		const streamsChannel = guild.channels.find(channel => channel.name === "tagpro-streams");
		if (streamsChannel) {
			axios.defaults.headers.common['Authorization'] = 'Bearer ' + client.config.twitchToken;
			axios.defaults.baseURL = 'https://api.twitch.tv/helix/streams';
			axios.get('?game_id=313418')
				.then(function (response) {
				const exampleEmbed = new Discord.RichEmbed()
				.setTitle('Here is the current list of TagPro streams on Twitch:')
				.setDescription('If you don\'t see your stream here, make sure your game is set to TagPro!')
				.setColor('DARK_GOLD')
				.setTimestamp()
				.setFooter('Stream list retreived:');
				if (response.data.data[0] !== undefined) {
					for (let i = 0; i < response.data.data.length; i++) {
						const currentStream = response.data.data[i];
						const authorLabel = currentStream['user_name']+ ' - '+currentStream["viewer_count"]+' viewers';
						const streamLabel = '['+currentStream['title']+'](https://twitch.tv/'+currentStream['user_name']+')';
						exampleEmbed.addField(authorLabel, streamLabel, false);
					}
				}
				else {
					exampleEmbed.addField('No TagPro streams found :c', 'Try making your own stream!', false);
				}
				streamsChannel.fetchMessage(streamsChannel.lastMessageID).then(message => message.delete());
				streamsChannel.send(exampleEmbed);
			})
				.catch(function (error) {
				console.log(error);
			});
		}
		else {
			console.log("stream channel not available, skipping updateStreams event.");
		}
    }
	else {
		console.log("guild not available, skipping updateStreams event");
	}
}