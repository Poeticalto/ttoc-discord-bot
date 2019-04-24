// lounge command creates a voice lounge under the general lounges section
// voice lounges consist of a voice channel and a corresponding text channel
// the text channel can only be accessed if the member is connected to the voice channel

exports.run = async (client, message, args, level) => {
    // return if no arguments are given
    if (!args || args.length < 1) return message.reply("\nSorry, you didn't provide enough arguments.\nTry this: !lounge [name]");
    // return if lounge name contains a bad word
    if (client.checkProfanity(message) === true) return message.reply("\nBad words cannot be used as lounge names. Try using a more appropriate name.");
    // join args to make lounge name
    let loungeName = args.splice(0);
    // clean lounge name to fit into discord guidelines
    loungeName = loungeName.join(" ").match(/[A-Za-z0-9 ]+/g);
    // return if the cleaned name is empty
    if (loungeName === null) return message.reply("\nSorry, your lounge name doesn't work. Try using alphanumeric characters for your lounge name.");
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
        return message.channel.send("Sorry, you cannot create more than one active lounge at a time.");
    }
    else {
        // otherwise, check if another lounge exists with the given lounge name
        let testChannel = message.guild.channels.find(channel => channel.name === ("L-"+loungeName));
        // create lounge if it does not exist
        if (testChannel === null && typeof testChannel === "object") {
            // get lounge section to place channels under
            let loungeSection;
            let sectionName;
            let captainRole;
            // get admin role to add permissions
            let adminRole;
            // get bot role to add permissions
            const botRole = message.guild.roles.find(role => role.name === "Bots");
            if (message.channel.parent && message.channel.parent.name === "Private" && client.config.privateLoungeSections.indexOf(message.channel.name) > -1) {
                loungeSection = message.channel.parent;
                sectionName = message.channel.parent.name;
                if (message.channel.name === "mltp-crc") {
                    adminRole = message.guild.roles.find(role => role.name === "MLTP CRC");
                    captainRole = message.guild.roles.find(role => role.name === "MLTP Captain");
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
            else if (message.channel.parent && client.config.customLoungeSections.indexOf(message.channel.parent.name) > -1 && message.channel.name.indexOf("general") === -1) {
                adminRole = message.guild.roles.find(role => role.name === "Admin");
                loungeSection = message.channel.parent;
                sectionName = message.channel.parent.name;
                captainRole = message.guild.roles.find(role => role.name === sectionName+" Captain");
            }
            else {
                adminRole = message.guild.roles.find(role => role.name === "Admin");
                loungeSection = message.guild.channels.find(channel => channel.name === "General Lounges");
                sectionName = "General Lounges";
                captainRole = message.guild.roles.find(role => role.name === "Moderator");
            }     
            // create the text channel with corresponding permissions
            message.guild.createChannel(("l-"+loungeName.replace(/ /g,"_").toLowerCase()), "text")
                .then(channel => channel.setParent(loungeSection)) // set the channel in the General Lounges section
                .then(channel => channel.replacePermissionOverwrites({ // add channel permissions
                overwrites: [
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
                    }
                ],
                reason: 'Create Lounge' // add reason for the audit log
            }))
                .then(function(channel){
                // set the voice channel name as the topic
                // this is done because it is the easiest way to store the name
                channel.setTopic("L-"+loungeName);
                channel.send("Admin commands:\n!admin [@player/role]   :: adds/removes a player or role as a Lounge admin\n!bypass [@player/role]  :: allow/reset a player/role to bypass a locked lounge\n!lock                                     :: locks/unlocks a voice lounge").then(message => message.pin());
            });
            // create the voice channel
            message.guild.createChannel(("L-"+loungeName), "voice")
                .then(channel => channel.setParent(loungeSection)) // set the channel in the General Lounges section
                .then(function(channel){
                // map the lounge admin to the voice channel
                client.lounges.setLoungeAdmin.run({"id": channel.id, "adminid": message.member.id});
                // add channel permissions
                channel.replacePermissionOverwrites({
                    overwrites: [
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
                        }
                    ],
                    reason: 'Create Lounge' // set reason for audit log
                })})
                .then(async function() {
                if (sectionName === "Private") {
                    message.guild.channels.find(channel => channel.name === "L-"+loungeName).overwritePermissions(message.guild.defaultRole, { VIEW_CHANNEL: false });
                }
                // sort voice channels by name
                const sectionChannels = message.guild.channels.filter(channel => channel.parent !== null && channel.parent.name === sectionName && channel.type === "voice");
                const sectionChannelsKeys = doubleSort(sectionChannels.map(channel => channel.name), sectionChannels.keyArray());
                for (let j = 0; j < sectionChannelsKeys.length; j++)
                {
                    await sectionChannels.find(channel => channel.id === sectionChannelsKeys[j]).setPosition(j);
                }
            });
            message.channel.send("L-"+loungeName+" was successfully created in the "+sectionName+" section!");
            // create a check to delete the channel if it remains empty after thirty seconds
            setTimeout(function(){
                // redefine the voiceChannel to see if it still exists
                const voiceChannelCheck = message.guild.channels.find(channel => channel.name === ("L-"+loungeName));
                if (voiceChannelCheck === null && typeof voiceChannelCheck === "object") {
                    //if it doesn't exist do nothing
                }
                else {
                    // otherwise, delete the voice channel and corresponding text channel
                    if (voiceChannelCheck.members.keyArray().length === 0) {
                        client.lounges.deleteLoungeAdmin.run(voiceChannelCheck.id);
                        voiceChannelCheck.delete();
                        message.guild.channels.find(channel => channel.name === ("l-"+loungeName.replace(/ /g,"_").toLowerCase())).delete();
                    }
                }
            }, 30*1000);
        }
        else {
            // tell user that a lounge with the name provided already exists
            message.channel.send("Sorry, a lounge with that name already exists! Try a different name.");
        }
    }
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