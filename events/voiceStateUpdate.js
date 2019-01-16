// voiceStateUpdate event occurs when member has changed their voice state
// Note that due to the binding of client to every event, every event
// goes `client, other, args` when this function is run.

module.exports = async (client, oldMember, newMember) => {
    // get the voice channels associated with oldMember and newMember
    let oldChannel = oldMember.voiceChannel;
    let newChannel = newMember.voiceChannel;
    if (typeof oldChannel == 'undefined') { // user has connected to a voice channel
        // If user is in a voice lounge, give access to the corresponding text channel
        let newChannelName = newChannel.name;
        // check if parent is defined before checking if channel is in General Lounges section
        if (newChannel.parent && (newChannel.parent.name === "General Lounges"  || client.config.customLoungeSections.indexOf(newChannel.parent.name) > -1)) {
            // add read permission to text channel
            newMember.guild.channels.find(channel => channel.name === newChannel.name.replace(/ /g,"_").toLowerCase()).overwritePermissions(newMember, {
                "READ_MESSAGES": true
            });
        }
    }
    else if (typeof newChannel == 'undefined') { // user has disconnected from a voice channel
        // If user has disconnected from a voice lounge, remove access to the text channel and check if the voice lounge should be deleted
        let oldChannelName = oldChannel.name;
        // check if parent is defined before checking if channel is in General Lounges section
        if (oldChannel.parent && (oldChannel.parent.name === "General Lounges" || client.config.customLoungeSections.indexOf(oldChannel.parent.name) > -1)) {
            oldMember.guild.channels.find(channel => channel.name === oldChannel.name.replace(/ /g,"_").toLowerCase()).overwritePermissions(newMember, {
                "READ_MESSAGES": false
            });
            if (oldChannel.members.keyArray().length === 0) {
                deleteChannels(client, newMember, oldChannelName);
            }
        }
    }
    else if (typeof oldChannel !== 'undefined' && typeof newChannel !== 'undefined') { // user has switched voice channels
        // do both checks for connecting and disconnecting
        let oldChannelName = oldChannel.name;
        if (oldChannel.parent && (oldChannel.parent.name === "General Lounges" || client.config.customLoungeSections.indexOf(oldChannel.parent.name) > -1)) {
            oldMember.guild.channels.find(channel => channel.name === oldChannel.name.replace(/ /g,"_").toLowerCase()).overwritePermissions(newMember, {
                "READ_MESSAGES": false
            });
            if (oldChannel.members.keyArray().length === 0) {
                deleteChannels(client, newMember, oldChannelName);
            }
        }
        if (newChannel.parent && (newChannel.parent.name === "General Lounges" || client.config.customLoungeSections.indexOf(oldChannel.parent.name) > -1)) {
            newMember.guild.channels.find(channel => channel.name === newChannel.name.replace(/ /g,"_").toLowerCase()).overwritePermissions(newMember, {
                "READ_MESSAGES": true
            });
        }
    }
}

function deleteChannels(client, newMember, oldChannelName) {
    // After 120 seconds, check if lounge is still empty
    // If it is, then delete the lounge channels
    setTimeout(function(){
        // get lounge
        let voiceChannelCheck = newMember.guild.channels.find(channel => channel.name === oldChannelName);
        if (voiceChannelCheck === null && typeof voiceChannelCheck === "object") {
            //insert code here
        }
        else {
            if (voiceChannelCheck.members.keyArray().length === 0) {
                client.lounges.deleteLoungeAdmin.run(voiceChannelCheck.id);
                voiceChannelCheck.delete();
                newMember.guild.channels.find(channel => channel.name === (oldChannelName.replace(/ /g,"_").toLowerCase())).delete();
            }
        }
    }, 120*1000);
}