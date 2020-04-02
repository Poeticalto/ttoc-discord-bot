/**
* The say command connects to a voice channel and uses TTS to play an mp3 of a specified string
* @param {string} string - string to say via TTS
*/

const Discord = require('discord.js');
const needle = require('needle');
const path = require('path');
const fs = require('fs');
let txtomp3 = require("text-to-mp3");

exports.run = async (client, message, args, level) => {
    if (!args || args.length < 1) { 
        return await message.channel.send("Sorry, I didn't detect any arguments.").catch(console.error);
    }
    let rawText = args.join(" ");
    if (message.member && message.member.voiceChannel) {
        await message.member.voiceChannel.join()
        .then(connection => {
            txtomp3.getMp3(args.join(" ")).then(function(binaryStream){
                let file = fs.createWriteStream(path.resolve('./music/tts_out.mp3'));
                file.write(binaryStream);
                file.end();
                const dispatcher = connection.playArbitraryInput(path.resolve('./music/tts_out.mp3'));
                dispatcher.on('end', () => {
                    message.member.voiceChannel.leave();
                });
            }).catch(function (err) {
            var base = 'http://vozme.com/'; //use vozme.com as a backup if google returns error
            var opts = {
            text : args.join(" "),
            gn : 'fm', //fm for female, ml for male
            interface : 'full'
            };

            needle.post(base + 'text2voice.php?lang=en', opts,{}, function (err, resp) {
                var url = base + resp.body.split('<source')[1].split('"')[1];
                needle.get(url, { output : path.resolve('./music/tts_out.mp3') }, function(err, resp, body) {
                    if (err) {
                        console.log('Error: no mp3');
                        return;
                    }
                    const dispatcher = connection.playArbitraryInput(path.resolve('./music/tts_out.mp3'));
                    dispatcher.on('end', () => {
                        message.member.voiceChannel.leave();
                    });
                });
            });
            });
        })
        .catch(console.log);
    }
    else {
        return await message.channel.send("Failed to connect to voice channel.").catch(console.error);
    }
    
};

exports.conf = {
    enabled: true,
    guildOnly: true,
    aliases: [],
    permLevel: "Bot Owner"
};

exports.help = {
    name: "say",
    category: "Miscellaneous",
    description: "say something!",
    usage: "say text"
};