// streams command returns an embed with all active streams for a specific game

const Discord = require('discord.js');
const axios = require('axios');

exports.run = async (client, message, args, level) => { // eslint-disable-line no-unused-vars
    // set up axios request
    axios.defaults.headers.common['Authorization'] = 'Bearer ' + client.config.twitchToken;
    axios.defaults.baseURL = 'https://api.twitch.tv/helix/streams';
    // get axios request for TagPro (see Twitch APIs if you
    // need to get the id for a different game)
    axios.get('?game_id=313418')
        .then(function (response) {
        // delete the command message
        message.delete().catch(console.error);
        // create an embed to fill in the streams
        const exampleEmbed = new Discord.RichEmbed()
        .setTitle('Here is the current list of TagPro streams on Twitch:')
        .setDescription('If you don\'t see your stream here, make sure your game is set to TagPro!')
        .setColor('DARK_GOLD')
        .setTimestamp()
        .setFooter('Stream list retreived:');
        // if at least one stream is actve, extract the data and make into an embed field
        if (response.data.data[0] !== undefined) {
            for (let i = 0; i < response.data.data.length; i++) {
                const currentStream = response.data.data[i];
                const authorLabel = currentStream['user_name']+ ' - '+currentStream['title'];
                const streamLabel = "https://twitch.tv/"+currentStream['user_name'];
                exampleEmbed.addField(authorLabel, streamLabel, false);
            }
        }
        else {
            // if there aren't any streams, add a field saying no streams
            exampleEmbed.addField('No TagPro streams found :c', 'Try making your own stream!', false);
        }
        message.channel.send(exampleEmbed);
    })
        .catch(function (error) {
        message.channel.send("Sorry, there was an error getting the stream list.");
        console.log(error);
    });
};

exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: [],
    permLevel: "User"
};

exports.help = {
    name: "streams",
    category: "tagpro",
    description: "Gets the updated list of TagPro streams",
    usage: "stream"
};