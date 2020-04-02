/**
* The voiceStateUpdate event occurs when member has changed their voice state
* @param {client} client - client object for the bot
* @param {snowflake} oldMember - member object before user changed voice state
* @param {snowflake} newMember - member object after user changed voice state
*/

const fs = require('fs');

module.exports = async (client, oldMember, newMember) => {
    const level = client.mPermLevel(newMember);
    // get the voice channels associated with oldMember and newMember
    let oldChannel = oldMember.voiceChannel;
    let newChannel = newMember.voiceChannel;
    if (typeof oldChannel == 'undefined' && typeof newChannel !== 'undefined') { // user has connected to a voice channel
        // If user is in a voice lounge, give access to the corresponding text channel
        let newChannelName = newChannel.name;
        // check if parent is defined before checking if channel is in General Lounges section
        if (newChannel.parent && (newChannel.parent.name === "General Lounges"  || client.config.customLoungeSections.indexOf(newChannel.parent.name) > -1)) {
            // add read permission to text channel
            let searchChannel = newMember.guild.channels.find(channel => channel.name === newChannel.name.replace(/ /g,"_").toLowerCase());
            if (searchChannel) {
                logConnection(newMember, searchChannel.name, true);
                await searchChannel.overwritePermissions(newMember, {
                    "READ_MESSAGES": true
                }).catch(console.error);
            }
        }
    }
    else if (typeof newChannel == 'undefined' && typeof oldChannel !== 'undefined') { // user has disconnected from a voice channel
        // If user has disconnected from a voice lounge, remove access to the text channel and check if the voice lounge should be deleted
        let oldChannelName = oldChannel.name;
        // check if parent is defined before checking if channel is in General Lounges section
        if (oldChannel.parent && (oldChannel.parent.name === "General Lounges" || client.config.customLoungeSections.indexOf(oldChannel.parent.name) > -1)) {
            let searchChannel = newMember.guild.channels.find(channel => channel.name === oldChannel.name.replace(/ /g,"_").toLowerCase());
            if (searchChannel) {
                logConnection(newMember, searchChannel.name, false);
                if (level < 3) {
                    await searchChannel.overwritePermissions(newMember, {
                        "READ_MESSAGES": false
                    }).catch(console.error);
                }
                if (oldChannel.members.keyArray().length === 0) {
                    deleteChannels(client, newMember, oldChannel.id);
                }
            }
        }
    }
    else if (typeof oldChannel !== 'undefined' && typeof newChannel !== 'undefined') { // user has switched voice channels
        // if oldChannel == newChannel, then user has changed mute/deaf status.
        if (oldChannel.id == newChannel.id) {
            let isSelfMuteOld = oldMember.selfMute;
            let isSelfDeafOld = oldMember.selfDeaf;
            let isServerMuteOld = oldMember.serverMute;
            let isServerDeafOld = oldMember.serverDeaf;
            let isSelfMuteChanged = (isSelfMuteOld == newMember.selfMute ? false : true);
            let isSelfDeafChanged = (isSelfDeafOld == newMember.selfDeaf ? false : true);
            let isServerMuteChanged = (isServerMuteOld == newMember.serverMute ? false : true);
            let isServerDeafChanged = (isServerDeafOld == newMember.serverDeaf ? false : true);
            if (isSelfMuteChanged || isSelfDeafChanged || isServerMuteChanged || isServerDeafChanged) {
                let changeStatus = "";
                if (isSelfMuteChanged) {
                    changeStatus += `sfm:${!isSelfMuteOld} `;
                }
                if (isSelfDeafChanged) {
                    changeStatus += `sfd:${!isSelfDeafOld} `;
                }
                if (isServerMuteChanged) {
                    changeStatus += `srm:${!isServerMuteOld} `;
                }
                if (isServerDeafChanged) {
                    changeStatus += `srd:${!isServerDeafOld} `;
                }
                logMuteDeaf(newMember, oldChannel.name, changeStatus);
            }
            return;
        }
        // do both checks for connecting and disconnecting
        let oldChannelName = oldChannel.name;
        if (oldChannel.parent && (oldChannel.parent.name === "General Lounges" || client.config.customLoungeSections.indexOf(oldChannel.parent.name) > -1)) {
            let searchChannel = newMember.guild.channels.find(channel => channel.name === oldChannel.name.replace(/ /g,"_").toLowerCase());
            if (searchChannel) {
                logConnection(newMember, searchChannel.name, false);
                if (level < 3) {
                    await searchChannel.overwritePermissions(newMember, {
                    "READ_MESSAGES": false
                    }).catch(console.error);
                }
                if (oldChannel.members.keyArray().length === 0) {
                    deleteChannels(client, newMember, oldChannel.id);
                }
            }
        }
        if (newChannel.parent && (newChannel.parent.name === "General Lounges" || client.config.customLoungeSections.indexOf(oldChannel.parent.name) > -1)) {
            let searchChannel = newMember.guild.channels.find(channel => channel.name === newChannel.name.replace(/ /g,"_").toLowerCase());
            if (searchChannel) {
                logConnection(newMember, searchChannel.name, true);
                await searchChannel.overwritePermissions(newMember, {
                    "READ_MESSAGES": true
                }).catch(console.error);
            }
        }
    }
}

async function deleteChannels(client, newMember, oldChannelId) {
    // After 120 seconds, check if lounge is still empty
    // If it is, then delete the lounge channels
    setTimeout(async function(){
        // get lounge
        let voiceChannelCheck = newMember.guild.channels.get(oldChannelId);
        if (voiceChannelCheck === null && typeof voiceChannelCheck === "object") {
            //insert code here
        }
        else {
            if (voiceChannelCheck && voiceChannelCheck.members.keyArray().length === 0) {
                client.lounges.deleteLoungeAdmin.run(voiceChannelCheck.id);
                let textLounge = newMember.guild.channels.find(channel => channel.name === (voiceChannelCheck.name.replace(/ /g,"_").toLowerCase()));
                await voiceChannelCheck.delete().catch(console.error);
                let archiveFileName = `${textLounge.name}.txt`;
                let archiveNewFileName = `${Math.round((new Date()).getTime() / 1000)}_${archiveFileName}`;
                fs.rename('./logs/lounges/'+archiveFileName, './logs/lounges/'+archiveNewFileName, async (err) => {
                    if (err) throw err;
                    /*
                    // upload lounge archive to Discord
                    await textLounge.guild.channels.find(channel => channel.name === "lounge-archives").send(`${textLounge.name} has been successfully archived: `,
                        {files: [{
                            attachment: './logs/lounges/'+archiveNewFileName,
                            name: archiveFileName
                        }]
                        }).catch(console.error);
                    */
                    // local/website archive
                    await textLounge.guild.channels.find(channel => channel.name === "lounge-archives").send(`${textLounge.name} has been successfully archived: /logs/lounges/${archiveNewFileName}`).catch(console.error);
                });
                await textLounge.delete().catch(console.error);
            }
        }
    }, 120*1000);
}

function getTimeFromSnowflake(id) {
    let a = new Date((parseInt(id) / 4194304) +  1420070400000);
    let months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    let year = a.getFullYear();
    let month = months[a.getMonth()];
    let date = a.getDate();
    let hour = a.getHours();
    let min = a.getMinutes();
    let sec = a.getSeconds();
    let time = `${month}/${date}/${year} ${hour}:${min}:${sec}`;
    return time;
}

function customNewDate() {
    let a = new Date();
    let months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    let year = a.getFullYear();
    let month = months[a.getMonth()];
    let date = a.getDate();
    let hour = a.getHours();
    let min = a.getMinutes();
    let sec = a.getSeconds();
    let time = `${month}/${date}/${year} ${hour}:${min}:${sec}`;
    return time;
}

function logConnection(memberWrite, loungeWrite, isConnected) {
    let data = `${customNewDate()} ${memberWrite.displayName} (${memberWrite.id}) has ${isConnected ? "joined" : "disconnected"} with status: sfm:${memberWrite.selfMute} sfd:${memberWrite.selfDeaf} srm:${memberWrite.serverMute} srd:${memberWrite.serverDeaf}.\n`;
    let fileName = `${loungeWrite.replace(/ /g,"_").toLowerCase()}.txt`;
    fs.appendFile("./logs/lounges/"+fileName,data,'utf8',
        function(err) {
            if (err) throw err;
        });
}

function logMuteDeaf(memberWrite, loungeWrite, changeStatus) {
    let data = `${customNewDate()} ${memberWrite.displayName} (${memberWrite.id}) updated voice status: ${changeStatus}.\n`;
    let fileName = `${loungeWrite.replace(/ /g,"_").toLowerCase()}.txt`;
    fs.appendFile("./logs/lounges/"+fileName,data,'utf8',
        function(err) {
            if (err) throw err;
        });
}