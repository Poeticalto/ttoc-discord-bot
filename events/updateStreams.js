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
				.then(async function (response) {
				const exampleEmbed = new Discord.RichEmbed()
				.setTitle('Here is the current list of TagPro streams on Twitch:')
				.setDescription('If you don\'t see your stream here, make sure your game is set to TagPro!')
				.setColor('DARK_GOLD')
				if (response.data.data[0] !== undefined) {
					for (let i = 0; i < response.data.data.length; i++) {
						const currentStream = response.data.data[i];
						const authorLabel = currentStream['user_name']+ ' - '+currentStream['title'];
						const streamLabel = "https://twitch.tv/"+currentStream['user_name'];
						exampleEmbed.addField(authorLabel, streamLabel, false);
					}
				}
				else {
					exampleEmbed.addField('No TagPro streams found :c', 'Try making your own stream!', false);
				}
				let oldMessage = await streamsChannel.fetchMessage(streamsChannel.lastMessageID);
				if (oldMessage.embeds.length === 0 || oldMessage.embeds[0].fields.length != exampleEmbed.fields.length) {
					console.log("change detected");
					oldMessage.delete();
					streamsChannel.send(exampleEmbed);
				}
				else {
					let check = 0;
					for (let i = 0; i < exampleEmbed.fields.length; i++) {
						if (oldMessage.embeds[0].fields[i].value === exampleEmbed.fields[i].value && oldMessage.embeds[0].fields[i].name === exampleEmbed.fields[i].name) {
							check++;
						}
					}
					if (check === exampleEmbed.fields.length) {
						console.log("no change in updateStreams");
					}
					else {
						console.log("change detected");
						oldMessage.delete();
						streamsChannel.send(exampleEmbed);
					}
				}
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