// The UPDATESTREAMS event is a user defined event which updates a channel with the list of twitch streams for a game (in this case TagPro)
// This event is similar to the !streams command

const Discord = require('discord.js');

module.exports = (client) => {
    // find the guild to display stream list in
    const guild = client.guilds.first();
    // make sure guild is defined and is available
    if (guild && guild.available) {
        // define the channel to send to
        const streamsChannel = guild.channels.find(channel => channel.name === "tagpro-streams");
        // check that streamChannel is defined
        if (streamsChannel) {
            // make axios request
            client.getStreams.get('?game_id=313418')
                .then(async function (response) {
                // create rich embed to send to channel
                const exampleEmbed = new Discord.RichEmbed()
                .setTitle('Here is the current list of TagPro streams on Twitch:')
                .setDescription('If you don\'t see your stream here, make sure your game is set to TagPro!')
                .setColor('DARK_GOLD')
                if (response.data.data[0] !== undefined) {
                    // if data exists in the request, convert it to text form for embed
                    for (let i = 0; i < response.data.data.length; i++) {
                        const currentStream = response.data.data[i];
                        const authorLabel = currentStream['user_name']+ ' - '+currentStream['title'];
                        const streamLabel = "https://twitch.tv/"+currentStream['user_name'];
                        exampleEmbed.addField(authorLabel, streamLabel, false);
                    }
                }
                else {
                    // otherwise, add field saying no streams were found
                    exampleEmbed.addField('No TagPro streams found :c', 'Try making your own stream!', false);
                }
                // get the previous streams message
                let oldMessage = await streamsChannel.fetchMessage(streamsChannel.lastMessageID);
                // If the previous message does not have any embeds or the number of fields does not match,
                // then delete previous and make new message
                if (oldMessage.embeds.length === 0 || oldMessage.embeds[0].fields.length != exampleEmbed.fields.length) {
                    oldMessage.delete();
                    streamsChannel.send(exampleEmbed);
                }
                else {
                    // otherwise, compare the contents of each field
                    let check = 0;
                    for (let i = 0; i < exampleEmbed.fields.length; i++) {
                        if (oldMessage.embeds[0].fields[i].value === exampleEmbed.fields[i].value && oldMessage.embeds[0].fields[i].name === exampleEmbed.fields[i].name) {
                            check++;
                        }
                    }
                    // If the contents match, then leave previous message intact
                    if (check === exampleEmbed.fields.length) {
                        // logger
                    }
                    else {
                        // otherwise, replace message
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
            // stream channel is not defined
        }
    }
    else {
        // guild isn't available
    }
}