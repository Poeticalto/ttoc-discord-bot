module.exports = async (client, oldMember, newMember) => {
	var oldChannel = oldMember.voiceChannel;
	var newChannel = newMember.voiceChannel;
	if (typeof oldChannel == 'undefined')
	{ // user has connected to a voice channel
		var newChannelName = newChannel.name;
		if (newChannel.parent.name === "General Lounges")
		{
			addPermissions(newMember, newChannelName);
		}
	}
	else if (typeof newChannel == 'undefined')
	{ // user has disconnected from a voice channel
		var oldChannelName = oldChannel.name;
		if (oldChannel.parent.name === "General Lounges")
		{
			removePermissions(newMember, oldChannelName);
			processRole("Lounge Admin", newMember, newMember.guild);
			if (oldChannel.members.keyArray().length === 0)
			{
				deleteChannels(newMember, oldChannelName);
			}
		}
	}
	else if (typeof oldChannel !== 'undefined' && typeof newChannel !== 'undefined')
	{ // user has switched voice channels
		var checkOldChannelName = oldChannel.name;
		if (oldChannel.parent.name === "General Lounges")
		{
			removePermissions(newMember, checkOldChannelName);
			if (oldChannel.members.keyArray().length === 0)
			{
				deleteChannels(newMember, checkOldChannelName);
			}
		}
		var checkNewChannelName = newChannel.name;
		if (newChannel.parent.name === "General Lounges")
		{
			addPermissions(newMember, checkNewChannelName);
		}
	}
}

function addPermissions(newMember, newChannelName)
{
	var newChannelEdit = newMember.guild.channels.find(channel => channel.name === newChannelName.replace(/ /g,"_").toLowerCase());
	newChannelEdit.overwritePermissions(newMember,
	{
		"READ_MESSAGES": true
	});
}

function addRolePermissions(defaultRole, newChannel)
{
	newChannel.overwritePermissions(defaultRole,
	{
		"VIEW_CHANNEL": true
	});
}

function deleteChannels(newMember, oldChannelName)
{
	setTimeout(function(){
		var voiceChannelCheck = newMember.guild.channels.find(channel => channel.name === oldChannelName);
		if (voiceChannelCheck === null && typeof voiceChannelCheck === "object")
		{
			//insert code here
		}
		else
		{
			if (voiceChannelCheck.members.keyArray().length === 0)
			{
				voiceChannelCheck.delete();
				newMember.guild.channels.find(channel => channel.name === (oldChannelName.replace(/ /g,"_").toLowerCase())).delete();
				newMember.removeRole(roleToCheck).catch(console.error);
			}
		}
		}, 30*1000);
}

function removePermissions(oldMember, oldChannelName)
{
	var oldChannelEdit = oldMember.guild.channels.find(channel => channel.name === oldChannelName.replace(/ /g,"_").toLowerCase());
	oldChannelEdit.permissionOverwrites.get(oldMember.id).delete();
}

function removeRolePermissions(defaultRole, newChannel)
{
	newChannel.overwritePermissions(defaultRole,
	{
		"VIEW_CHANNEL": false
	});
}

function processRole(abbrProcess, memberEdit, guild)
{
	roleToCheck = guild.roles.find(role => role.name === abbrProcess);
	if (memberEdit.roles.has(roleToCheck.id))
	{
		memberEdit.removeRole(roleToCheck).catch(console.error);
	}
}