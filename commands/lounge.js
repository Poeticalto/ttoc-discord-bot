exports.run = async (client, message, args, level) => {
    if (!args || args.length < 1) return message.reply("\nSorry, you didn't provide enough arguments.\nTry this: !lounge [name]");
    let loungeName = args.splice(0);
    loungeName = loungeName.join(" ").match(/[A-Za-z0-9 ]+/g).join("");
    const author = message.member;
    const roleToCheck = message.guild.roles.find(role => role.name === "Lounge Admin");
    if (author.roles.has(roleToCheck.id) || loungeName == "") {
        message.channel.send("Sorry, you cannot create more than one active lounge at a time.");
    }
    else {
        let testChannel = message.guild.channels.find(channel => channel.name === ("L-"+loungeName));
        if (testChannel === null && typeof testChannel === "object") {
            const loungeSection = message.guild.channels.find(channel => channel.name === "General Lounges");
            const adminRole = message.guild.roles.find(role => role.name === "Admin");
            const botRole = message.guild.roles.find(role => role.name === "Bots");
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
                .then(function(channel){
					channel.setTopic("L-"+loungeName);
					channel.send("Admin commands:\n!admin [@player/role]   :: adds/removes a player or role as a Lounge admin\n!bypass [@player/role]  :: allow/reset a player/role to bypass a locked lounge\n!lock [@player/role]       :: locks/unlocks a voice lounge").then(message => message.pin());
				});
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
            }))
                .then(async function() {
                const sectionChannels = message.guild.channels.filter(channel => channel.parent !== null && channel.parent.name === "General Lounges" && channel.type === "voice");
                const sectionChannelsKeys = doubleSort(sectionChannels.map(channel => channel.name), sectionChannels.keyArray());
                for (let j = 0; j < sectionChannelsKeys.length; j++)
                {
                    await sectionChannels.find(channel => channel.id === sectionChannelsKeys[j]).setPosition(j);
                }
            });
            message.channel.send("L-"+loungeName+" was successfully created in the General Lounges section!");
            setTimeout(function(){
                const voiceChannelCheck = message.guild.channels.find(channel => channel.name === ("L-"+loungeName));
                if (voiceChannelCheck === null && typeof voiceChannelCheck === "object") {
                    //insert code here
                }
                else {
                    if (voiceChannelCheck.members.keyArray().length === 0) {
                        voiceChannelCheck.delete();
                        message.guild.channels.find(channel => channel.name === ("l-"+loungeName.replace(/ /g,"_").toLowerCase())).delete();
                        message.member.removeRole(roleToCheck).catch(console.error);
                    }
                }
            }, 30*1000);
        }
        else {
            message.channel.send("Sorry, a lounge with that name already exists! Try a different name.");
        }
    }
};

function doubleSort(nameArray, sortArray) {
    let done = false;
    while (!done) {
        done = true;
        for (let i = 1; i < nameArray.length; i++) {
            if (nameArray[i - 1].toLowerCase() > nameArray[i].toLowerCase()) {
                done = false;
                let tmp = nameArray[i-1];
                let tmpb = sortArray[i-1];
                nameArray[i-1] = nameArray[i];
                sortArray[i-1] = sortArray[i];
                nameArray[i] = tmp;
                sortArray[i] = tmpb;
            }
        }
    }
    return sortArray;
}

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