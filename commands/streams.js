const Discord = require('discord.js');
const axios = require('axios');

exports.run = async (client, message, args, level) => { // eslint-disable-line no-unused-vars
    axios.defaults.headers.common['Authorization'] = 'Bearer ' + client.config.twitchToken;
    axios.defaults.baseURL = 'https://api.twitch.tv/helix/streams';
    axios.get('?game_id=313418')
        .then(function (response) {
        message.delete().catch(console.error);
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
    category: "TagPro",
    description: "Gets the updated list of TagPro streams",
    usage: "stream"
};