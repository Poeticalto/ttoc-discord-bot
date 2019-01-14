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
        if (newChannel.parent && (newChannel.parent.name === "General Lounges"  || newChannel.parent.name === "MLTP" || newChannel.parent.name === "NLTP")) {
            // add read permission to text channel
            addPermissions(newMember, newChannelName);
        }
    }
    else if (typeof newChannel == 'undefined') { // user has disconnected from a voice channel
        // If user has disconnected from a voice lounge, remove access to the text channel and check if the voice lounge should be deleted
        let oldChannelName = oldChannel.name;
        // check if parent is defined before checking if channel is in General Lounges section
        if (oldChannel.parent && (oldChannel.parent.name === "General Lounges" || oldChannel.parent.name === "MLTP" || oldChannel.parent.name === "NLTP")) {
            oldMember.guild.channels.find(channel => channel.name === oldChannel.name.replace(/ /g,"_").toLowerCase()).permissionOverwrites.get(newMember.id).delete();
            if (oldChannel.members.keyArray().length === 0) {
                deleteChannels(client, newMember, oldChannelName);
            }
        }
    }
    else if (typeof oldChannel !== 'undefined' && typeof newChannel !== 'undefined') { // user has switched voice channels
        // do both checks for connecting and disconnecting
        let oldChannelName = oldChannel.name;
        if (oldChannel.parent && (oldChannel.parent.name === "General Lounges" || oldChannel.parent.name === "MLTP" || oldChannel.parent.name === "NLTP")) {
            oldMember.guild.channels.find(channel => channel.name === oldChannel.name.replace(/ /g,"_").toLowerCase()).permissionOverwrites.get(newMember.id).delete();
            if (oldChannel.members.keyArray().length === 0) {
                deleteChannels(client, newMember, oldChannelName);
            }
        }
        let checkNewChannelName = newChannel.name;
        if (newChannel.parent && (newChannel.parent.name === "General Lounges" || newChannel.parent.name === "MLTP" || newChannel.parent.name === "NLTP")) {
            addPermissions(newMember, checkNewChannelName);
        }
    }
}

function addPermissions(newMember, newChannelName) {
    // find channel on guild then assign read permissions
    let newChannelEdit = newMember.guild.channels.find(channel => channel.name === newChannelName.replace(/ /g,"_").toLowerCase());
    newChannelEdit.overwritePermissions(newMember, {
        "READ_MESSAGES": true
    });
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