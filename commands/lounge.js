/**
* lounge command creates a voice lounge under the corresponding section where the command was run
* @param {string} name - name to use for the voice lounge
*/

exports.run = async (client, message, args, level) => {
    // return if no arguments are given
    if (!args || args.length < 1) {
        return await message.reply("\nSorry, you didn't provide enough arguments.\nTry this: !lounge [name]").catch(console.error);
    }
    // return if lounge name contains a bad word
    if (client.checkProfanity(message) === true) {
        return await message.reply("\nBad words cannot be used as lounge names. Try using a more appropriate name.").then(msg => {msg.delete(1000*30)}).catch(console.error);
    }
    // join args to make lounge name
    let loungeName = args.splice(0);
    // clean lounge name to fit into discord guidelines
    loungeName = loungeName.join(" ").match(/[A-Za-z0-9 ]+/g);
    // return if the cleaned name is empty
    if (loungeName === null) {
        return await message.reply("\nSorry, your lounge name doesn't work. Try using alphanumeric characters for your lounge name.").catch(console.error);
    }
    loungeName = loungeName.join("").trim();
    if (loungeName.length > 30) {
        loungeName = loungeName.substring(0,30).trim();
    }
    // get member from message author
    const author = message.member;
    const leagueList = client.config.leagueList;
    // check if member has created another active lounge
    const roleCheck = client.lounges.checkLoungeAdmin.get(message.author.id);
    // if member already has an active lounge, then deny
    if (roleCheck !== undefined && level < 2) {// members with level >= 2 are trusted to not abuse lounge ommand
        return await message.reply("you cannot create more than one active lounge at a time.").then(async (msg) => {await msg.delete(1000*30)}).catch(console.error);
    }
    // otherwise, check if another lounge exists with the given lounge name
    let testChannel = message.guild.channels.find(channel => channel.name.toUpperCase() === ("L-"+loungeName.toUpperCase()));
    // create lounge if it does not exist
    if (testChannel === null && typeof testChannel === "object") {
        // get lounge section to place channels under
        let loungeSection;
        let sectionName;
        let captainRole;
        // get admin role to add permissions
        let adminRole;
        // get bot role to add permissions
        let muteRole = message.guild.roles.find(role => role.name === "vmute");
        const botRole = message.guild.roles.find(role => role.name === "Bots");
        const someBallRole = message.guild.roles.find(role => role.name === "Some Ball");
        if (message.channel.parent && message.channel.parent.name === "Private" && client.config.privateLoungeSections.indexOf(message.channel.name) > -1) {
            loungeSection = message.channel.parent;
            sectionName = message.channel.parent.name;
            if (message.channel.name === "mltp-crc") {
                adminRole = message.guild.roles.find(role => role.name === "MLTP CRC");
                captainRole = message.guild.roles.find(role => role.name === "Majors Captain");
            }
            else if (message.channel.name === "nltp-crc") {
                adminRole = message.guild.roles.find(role => role.name === "NLTP CRC");
                captainRole = message.guild.roles.find(role => role.name === "NLTP Captain");
            }
            else if (message.channel.name === "admins") {
                adminRole = message.guild.roles.find(role => role.name === "Admin");
                captainRole = message.guild.roles.find(role => role.name === "Superadmin");
            }
        }
        else if (message.channel.parent && client.config.customLoungeSections.indexOf(message.channel.parent.name) > -1) {
            adminRole = message.guild.roles.find(role => role.name === "Admin");
            loungeSection = message.channel.parent;
            sectionName = message.channel.parent.name;
            if (sectionName === "MLTP") {
                captainRole = message.guild.roles.find(role => role.name === "Majors"+" Captain");
            }
            else {
                captainRole = message.guild.roles.find(role => role.name === sectionName+" Captain");
            }
        }
        else {
            adminRole = message.guild.roles.find(role => role.name === "Admin");
            loungeSection = message.guild.channels.find(channel => channel.name === "General Lounges");
            sectionName = "General Lounges";
            captainRole = message.guild.roles.find(role => role.name === "Moderator");
        }     
        // create the text channel with corresponding permissions
        await message.guild.createChannel(("l-"+loungeName.replace(/ /g,"_").toLowerCase()), 
            {
                type:"text",
                permissionOverwrites: 
                [
                    {
                        id: message.author.id, // make author a lounge admin
                        allowed: ['MANAGE_MESSAGES']
                    },
                    {
                        id: message.guild.defaultRole.id, // default role is the @everyone role
                        allowed: ['SEND_MESSAGES', 'USE_EXTERNAL_EMOJIS', 'ADD_REACTIONS', 'READ_MESSAGE_HISTORY', 'EMBED_LINKS', 'ATTACH_FILES'],
                        denied: ['CREATE_INSTANT_INVITE', 'READ_MESSAGES', 'SEND_TTS_MESSAGES', 'MANAGE_MESSAGES', 'MENTION_EVERYONE', 'MANAGE_CHANNELS', 'MANAGE_ROLES_OR_PERMISSIONS']
                    },
                    {
                        id: adminRole.id, // set permissions for the admin role
                        allowed: ['SEND_MESSAGES', 'USE_EXTERNAL_EMOJIS', 'ADD_REACTIONS', 'CREATE_INSTANT_INVITE', 'READ_MESSAGES', 'SEND_TTS_MESSAGES', 'MANAGE_MESSAGES', 'EMBED_LINKS', 'ATTACH_FILES', 'READ_MESSAGE_HISTORY', 'MENTION_EVERYONE', 'MANAGE_CHANNELS', 'MANAGE_ROLES_OR_PERMISSIONS']
                    },
                    {
                        id: botRole.id, // set permissions for the bot role
                        allowed: ['SEND_MESSAGES', 'USE_EXTERNAL_EMOJIS', 'ADD_REACTIONS', 'CREATE_INSTANT_INVITE', 'READ_MESSAGES', 'SEND_TTS_MESSAGES', 'MANAGE_MESSAGES', 'EMBED_LINKS', 'ATTACH_FILES', 'READ_MESSAGE_HISTORY', 'MENTION_EVERYONE', 'MANAGE_CHANNELS', 'MANAGE_ROLES_OR_PERMISSIONS']
                    },
                    {
                        id: muteRole.id, // set permissions for mute role
                        denied: ['SEND_MESSAGES','USE_EXTERNAL_EMOJIS','ADD_REACTIONS']
                    }
                ],
                reason: 'Create Lounge'
            })
            .then(async (channel) => await channel.setParent(loungeSection).catch(console.error)) // set the channel in the General Lounges section
            .then(async function(channel){
            // set the voice channel name as the topic
            // this is done because it is the easiest way to store the name
            await channel.setTopic("L-"+loungeName).catch(console.error);
            await channel.send("Admin commands:\n```asciidoc\n!admin [@player/role]   :: adds/removes a player or role as a Lounge admin\n!bitrate [8-128]        :: updates the bitrate of the voice channel\n!bypass [@player/role]  :: allow/reset a player/role to bypass a locked lounge\n!lock                   :: locks/unlocks a voice lounge\n!rename [name]          :: updates the name of the voice lounge\n```").then(async (message) => await message.pin().catch(console.error)).catch(console.error);
        });
        // create the voice channel
        await message.guild.createChannel(("L-"+loungeName), {
            type: 'voice',
            permissionOverwrites: 
                [
                    {
                        id: message.author.id, // set author as lounge admin
                        allowed: ['MUTE_MEMBERS', 'DEAFEN_MEMBERS', 'MOVE_MEMBERS', 'CONNECT']
                    },
                    {
                        id: message.guild.defaultRole.id, // set permissions for @everyone role
                        allowed: ['VIEW_CHANNEL', 'CONNECT', 'SPEAK', 'USE_VAD'],
                        denied: ['CREATE_INSTANT_INVITE',  'MANAGE_CHANNELS', 'MANAGE_ROLES_OR_PERMISSIONS', 'MUTE_MEMBERS', 'DEAFEN_MEMBERS', 'MOVE_MEMBERS', 'PRIORITY_SPEAKER']
                    },
                    {
                        id: adminRole.id, // set permissions for admin role
                        allowed: ['CREATE_INSTANT_INVITE',  'MANAGE_CHANNELS', 'MANAGE_ROLES_OR_PERMISSIONS', 'MUTE_MEMBERS', 'DEAFEN_MEMBERS', 'MOVE_MEMBERS', 'VIEW_CHANNEL', 'CONNECT', 'SPEAK', 'USE_VAD', 'MUTE_MEMBERS', 'DEAFEN_MEMBERS', 'MOVE_MEMBERS', 'PRIORITY_SPEAKER']
                    },
                    {
                        id: captainRole.id,
                        allowed: ['MUTE_MEMBERS', 'DEAFEN_MEMBERS', 'MOVE_MEMBERS']
                    },
                    {
                        id: botRole.id, // set permissions for bot role
                        allowed: ['CREATE_INSTANT_INVITE',  'MANAGE_CHANNELS', 'MANAGE_ROLES_OR_PERMISSIONS', 'MUTE_MEMBERS', 'DEAFEN_MEMBERS', 'MOVE_MEMBERS', 'VIEW_CHANNEL', 'CONNECT', 'SPEAK', 'USE_VAD', 'MUTE_MEMBERS', 'DEAFEN_MEMBERS', 'MOVE_MEMBERS', 'PRIORITY_SPEAKER']
                    },
                    {
                        id: someBallRole.id,
                        denied: ['VIEW_CHANNEL', 'CONNECT']
                    },
                    {
                        id: muteRole.id,
                        denied: ['SPEAK', 'USE_VAD']
                    }
                ],
            reason: 'Create Lounge' // set reason for audit log
            
            })
            .then(async (channel) => await channel.setParent(loungeSection).catch(console.error)) // set the channel in the General Lounges section
            .then(async function(channel){
            // map the lounge admin to the voice channel
            client.lounges.setLoungeAdmin.run({"id": channel.id, "adminid": message.member.id});
            // create a check to delete the channel if it remains empty after thirty seconds
            setTimeout(async function(){
                // redefine the voiceChannel to see if it still exists
                const voiceChannelCheck = message.guild.channels.get(channel.id);
                if (voiceChannelCheck === null && typeof voiceChannelCheck === "object") {
                    //if it doesn't exist do nothing
                }
                else {
                    // otherwise, delete the voice channel and corresponding text channel
                    if (voiceChannelCheck.members.keyArray().length === 0) {
                        client.lounges.deleteLoungeAdmin.run(voiceChannelCheck.id);
                        await voiceChannelCheck.delete().catch(console.error);
                        await message.guild.channels.find(channel => channel.name === (voiceChannelCheck.name.replace(/ /g,"_").toLowerCase())).delete().catch(console.error);
                    }
                }
            }, 30*1000);
            // add channel permissions
            })
            .then(async function() {
            
            // sort voice channels by name
            const sectionChannels = message.guild.channels.filter(channel => channel.parent !== null && channel.parent.name === sectionName && channel.type === "voice");
            const sectionChannelsKeys = doubleSort(sectionChannels.map(channel => channel.name), sectionChannels.keyArray());
            for (let j = 0; j < sectionChannelsKeys.length; j++)
            {
                await sectionChannels.find(channel => channel.id === sectionChannelsKeys[j]).setPosition(j).catch(console.error);
            }
        });
        await message.delete().catch(console.error);
        return await message.reply("L-"+loungeName+" was successfully created in the "+sectionName+" section!").then(async (msg) => {await msg.delete(1000*30).catch(console.error)}).catch(console.error);
    }
    // tell user that a lounge with the name provided already exists
    await message.delete().catch(console.error);
    return await message.reply("a lounge with that name already exists! Try a different name.").then(async (msg) => {await msg.delete(1000*30).catch(console.error)}).catch(console.error);
};

function doubleSort(nameArray, sortArray) {
    // sort sortArray by bubble sorting nameArray
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
    aliases: ["l"],
    permLevel: "User"
};

exports.help = {
    name: "lounge",
    category: "Lounges",
    description: "Allows for players to create their own lounges",
    usage: "lounge [name]"
};