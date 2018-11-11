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
		}
	}
	else if (typeof oldChannel !== 'undefined' && typeof newChannel !== 'undefined')
	{ // user has switched voice channels
		var checkOldChannelName = oldChannel.name;
		if (oldChannel.parent.name === "General Lounges")
		{
			removePermissions(newMember, checkOldChannelName);
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
	var newChannelEdit = newMember.guild.channels.find(channel => channel.name === newChannelName.replace(" ","-").toLowerCase());
	newChannelEdit.overwritePermissions(newMember,
	{
		"READ_MESSAGES": true
	}
	);
}

function removePermissions(oldMember, oldChannelName)
{
	var oldChannelEdit = oldMember.guild.channels.find(channel => channel.name === oldChannelName.replace(" ","-").toLowerCase());
	oldChannelEdit.overwritePermissions(oldMember,
	{
		"READ_MESSAGES": null
	}
	);
}