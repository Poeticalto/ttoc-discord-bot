module.exports = async (client, oldMember, newMember) => {
    let oldChannel = oldMember.voiceChannel;
    let newChannel = newMember.voiceChannel;
    if (typeof oldChannel == 'undefined') { // user has connected to a voice channel
        let newChannelName = newChannel.name;
        if (newChannel.parent.name === "General Lounges") {
            addPermissions(newMember, newChannelName);
        }
    }
    else if (typeof newChannel == 'undefined') { // user has disconnected from a voice channel
        let oldChannelName = oldChannel.name;
        if (oldChannel.parent.name === "General Lounges") {
            removePermissions(newMember, oldChannelName);
            processRole("Lounge Admin", newMember, newMember.guild);
            if (oldChannel.members.keyArray().length === 0) {
                deleteChannels(newMember, oldChannelName);
            }
        }
    }
    else if (typeof oldChannel !== 'undefined' && typeof newChannel !== 'undefined') { // user has switched voice channels
        let checkOldChannelName = oldChannel.name;
        if (oldChannel.parent.name === "General Lounges") {
            removePermissions(newMember, checkOldChannelName);
            if (oldChannel.members.keyArray().length === 0) {
                deleteChannels(newMember, checkOldChannelName);
            }
        }
        let checkNewChannelName = newChannel.name;
        if (newChannel.parent.name === "General Lounges") {
            addPermissions(newMember, checkNewChannelName);
        }
    }
}

function addPermissions(newMember, newChannelName) {
    let newChannelEdit = newMember.guild.channels.find(channel => channel.name === newChannelName.replace(/ /g,"_").toLowerCase());
    newChannelEdit.overwritePermissions(newMember,
                                        {
        "READ_MESSAGES": true
    });
}

function addRolePermissions(defaultRole, newChannel) {
    newChannel.overwritePermissions(defaultRole,
                                    {
        "VIEW_CHANNEL": true
    });
}

function deleteChannels(newMember, oldChannelName) {
    setTimeout(function(){
        let voiceChannelCheck = newMember.guild.channels.find(channel => channel.name === oldChannelName);
        if (voiceChannelCheck === null && typeof voiceChannelCheck === "object") {
            //insert code here
        }
        else {
            if (voiceChannelCheck.members.keyArray().length === 0) {
                voiceChannelCheck.delete();
                newMember.guild.channels.find(channel => channel.name === (oldChannelName.replace(/ /g,"_").toLowerCase())).delete();
            }
        }
    }, 60*1000);
}

function removePermissions(oldMember, oldChannelName) {
    oldMember.guild.channels.find(channel => channel.name === oldChannelName.replace(/ /g,"_").toLowerCase()).permissionOverwrites.get(oldMember.id).delete();
}

function processRole(abbrProcess, memberEdit, guild) {
    const roleToCheck = guild.roles.find(role => role.name === abbrProcess);
    if (memberEdit.roles.has(roleToCheck.id)) {
        memberEdit.removeRole(roleToCheck).catch(console.error);
    }
}