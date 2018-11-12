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
		else if (newChannel.parent.name === "NFTL")
		{
			if (newChannel.members.keyArray().length === 1)
			{
				addRolePermissions(newMember.guild.defaultRole, newChannel);
			}
			addPermissions(newMember, newChannelName.split("-")[0].replace(/ /g,"_").toLowerCase()+"-voice");
		}
	}
	else if (typeof newChannel == 'undefined')
	{ // user has disconnected from a voice channel
		var oldChannelName = oldChannel.name;
		if (oldChannel.parent.name === "General Lounges")
		{
			removePermissions(newMember, oldChannelName);
		}
		else if (oldChannel.parent.name === "NFTL")
		{
			if (oldChannel.members.keyArray().length === 0)
			{
				removeRolePermissions(newMember.guild.defaultRole, oldChannel);
			}
			removePermissions(newMember, oldChannelName.split("-")[0].replace(/ /g,"_").toLowerCase()+"-voice");
		}
	}
	else if (typeof oldChannel !== 'undefined' && typeof newChannel !== 'undefined')
	{ // user has switched voice channels
		var checkOldChannelName = oldChannel.name;
		if (oldChannel.parent.name === "General Lounges")
		{
			removePermissions(newMember, checkOldChannelName);
		}
		else if (oldChannel.parent.name === "NFTL")
		{
			if (oldChannel.members.keyArray().length === 0)
			{
				removeRolePermissions(newMember.guild.defaultRole, oldChannel);
			}
			removePermissions(newMember, checkOldChannelName.split("-")[0].replace(/ /g,"_").toLowerCase()+"-voice");
		}
		var checkNewChannelName = newChannel.name;
		if (newChannel.parent.name === "General Lounges")
		{
			addPermissions(newMember, checkNewChannelName);
		}
		else if (newChannel.parent.name === "NFTL")
		{
			if (newChannel.members.keyArray().length === 1)
			{
				addRolePermissions(newMember.guild.defaultRole, newChannel);
			}
			addPermissions(newMember, checkNewChannelName.split("-")[0].replace(/ /g,"_").toLowerCase()+"-voice");
		}
	}
}

function addPermissions(newMember, newChannelName)
{
	var newChannelEdit = newMember.guild.channels.find(channel => channel.name === newChannelName.replace(" ","-").toLowerCase());
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

function removePermissions(oldMember, oldChannelName)
{
	var oldChannelEdit = oldMember.guild.channels.find(channel => channel.name === oldChannelName.replace(" ","-").toLowerCase());
	oldChannelEdit.permissionOverwrites.get(oldMember.id).delete();
}

function removeRolePermissions(defaultRole, newChannel)
{
	newChannel.overwritePermissions(defaultRole,
	{
		"VIEW_CHANNEL": false
	});
}