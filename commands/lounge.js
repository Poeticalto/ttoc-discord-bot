exports.run = async (client, message, args, level) => {
    if (!args || args.length < 1) return message.reply("\nSorry, you didn't provide enough arguments.\nTry this: !lounge [name]");
    var loungeName = args.splice(0);
    loungeName = loungeName.join(" ").match(/[A-Za-z0-9 ]+/g).join("");
    var author = message.member;
    var roleToCheck = message.guild.roles.find(role => role.name === "Lounge Admin");
    if (author.roles.has(roleToCheck.id) || loungeName == "")
    {
        message.channel.send("Sorry, you cannot create more than one active lounge at a time.");
    }
    else
    {
        var testChannel = message.guild.channels.find(channel => channel.name === ("L-"+loungeName));
        if (testChannel === null && typeof testChannel === "object")
        {
            var loungeSection = message.guild.channels.find(channel => channel.name === "General Lounges");
            var adminRole = message.guild.roles.find(role => role.name === "Admin");
            var botRole = message.guild.roles.find(role => role.name === "Bots");
            message.member.addRole(roleToCheck).catch(console.error);
            message.guild.createChannel(("l-"+loungeName.replace(/ /g,"_").toLowerCase()), "text")
                .then(channel => channel.setParent(loungeSection))
                .then(channel => channel.replacePermissionOverwrites({
                overwrites: [
                    {
                        id: message.author.id,
                        allowed: ['MANAGE_MESSAGES']
                    },
                    {
                        id: message.guild.defaultRole.id,
                        allowed: ['SEND_MESSAGES', 'USE_EXTERNAL_EMOJIS', 'ADD_REACTIONS', 'READ_MESSAGE_HISTORY'],
                        denied: ['CREATE_INSTANT_INVITE', 'READ_MESSAGES', 'SEND_TTS_MESSAGES', 'MANAGE_MESSAGES', 'EMBED_LINKS', 'ATTACH_FILES', 'MENTION_EVERYONE', 'MANAGE_CHANNELS', 'MANAGE_ROLES_OR_PERMISSIONS']
                    },
                    {
                        id: adminRole.id,
                        allowed: ['SEND_MESSAGES', 'USE_EXTERNAL_EMOJIS', 'ADD_REACTIONS', 'CREATE_INSTANT_INVITE', 'READ_MESSAGES', 'SEND_TTS_MESSAGES', 'MANAGE_MESSAGES', 'EMBED_LINKS', 'ATTACH_FILES', 'READ_MESSAGE_HISTORY', 'MENTION_EVERYONE', 'MANAGE_CHANNELS', 'MANAGE_ROLES_OR_PERMISSIONS']
                    },
                    {
                        id: botRole.id,
                        allowed: ['SEND_MESSAGES', 'USE_EXTERNAL_EMOJIS', 'ADD_REACTIONS', 'CREATE_INSTANT_INVITE', 'READ_MESSAGES', 'SEND_TTS_MESSAGES', 'MANAGE_MESSAGES', 'EMBED_LINKS', 'ATTACH_FILES', 'READ_MESSAGE_HISTORY', 'MENTION_EVERYONE', 'MANAGE_CHANNELS', 'MANAGE_ROLES_OR_PERMISSIONS']
                    }
                ],
                reason: 'Create Lounge'
            }))
			.then(channel => channel.setTopic("L-"+loungeName));
            message.guild.createChannel(("L-"+loungeName), "voice")
                .then(channel => channel.setParent(loungeSection))
                .then(channel => channel.replacePermissionOverwrites({
                overwrites: [
                    {
                        id: message.author.id,
                        allowed: ['MUTE_MEMBERS', 'DEAFEN_MEMBERS', 'MOVE_MEMBERS']
                    },
                    {
                        id: message.guild.defaultRole.id,
                        allowed: ['VIEW_CHANNEL', 'CONNECT', 'SPEAK', 'USE_VAD'],
                        denied: ['CREATE_INSTANT_INVITE',  'MANAGE_CHANNELS', 'MANAGE_ROLES_OR_PERMISSIONS', 'MUTE_MEMBERS', 'DEAFEN_MEMBERS', 'MOVE_MEMBERS', 'PRIORITY_SPEAKER']
                    },
                    {
                        id: adminRole.id,
                        allowed: ['CREATE_INSTANT_INVITE',  'MANAGE_CHANNELS', 'MANAGE_ROLES_OR_PERMISSIONS', 'MUTE_MEMBERS', 'DEAFEN_MEMBERS', 'MOVE_MEMBERS', 'VIEW_CHANNEL', 'CONNECT', 'SPEAK', 'USE_VAD', 'MUTE_MEMBERS', 'DEAFEN_MEMBERS', 'MOVE_MEMBERS', 'PRIORITY_SPEAKER']
                    },
                    {
                        id: botRole.id,
                        allowed: ['CREATE_INSTANT_INVITE',  'MANAGE_CHANNELS', 'MANAGE_ROLES_OR_PERMISSIONS', 'MUTE_MEMBERS', 'DEAFEN_MEMBERS', 'MOVE_MEMBERS', 'VIEW_CHANNEL', 'CONNECT', 'SPEAK', 'USE_VAD', 'MUTE_MEMBERS', 'DEAFEN_MEMBERS', 'MOVE_MEMBERS', 'PRIORITY_SPEAKER']
                    }
                ],
                reason: 'Create Lounge'
            }));
            message.channel.send("L-"+loungeName+" was successfully created in the General Lounges section!");
            setTimeout(function(){
                var voiceChannelCheck = message.guild.channels.find(channel => channel.name === ("L-"+loungeName));
                if (voiceChannelCheck === null && typeof voiceChannelCheck === "object")
                {
                    //insert code here
                }
                else
                {
                    if (voiceChannelCheck.members.keyArray().length === 0)
                    {
                        voiceChannelCheck.delete();
                        message.guild.channels.find(channel => channel.name === ("l-"+loungeName.replace(/ /g,"_").toLowerCase())).delete();
                        message.member.removeRole(roleToCheck).catch(console.error);
                    }
                }
            }, 30*1000);
        }
        else
        {
            message.channel.send("Sorry, a lounge with that name already exists! Try a different name.");
        }
    }
};

exports.conf = {
    enabled: true,
    guildOnly: true,
    aliases: [],
    permLevel: "User"
};

exports.help = {
    name: "lounge",
    category: "Lounges",
    description: "Allows for players to create their own lounges",
    usage: "lounge [name]"
};