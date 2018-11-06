module.exports = async (client, oldMember, newMember) => {
	var oldChannel = oldMember.voiceChannel;
	var newChannel = newMember.voiceChannel;
	if (typeof oldChannel == 'object')
	{
		oldChannel = oldChannel.toString();
		oldChannel = oldChannel.substr(2, oldChannel.length-3);
	}
	if (typeof newChannel == 'object')
	{
		newChannel = newChannel.toString();
		newChannel = newChannel.substr(2, newChannel.length-3);
	}
	var loungeList = ["Lounge A", "Lounge B", "Lounge C", "Lounge D", "Lounge E"];
	//console.log(newMember.guild.channels.get(newChannel).name);
	if (typeof oldChannel == 'undefined')
	{ // user has connected to the voice channel
		var newChannelName = newMember.guild.channels.get(newChannel).name;
		if (loungeList.indexOf(newChannelName) > -1)
		{
			var newRole = newMember.guild.roles.find(r => r.name === newChannelName);
			newMember.addRole(newRole);
		}
	}
	else if (typeof newChannel == 'undefined')
	{ // user has disconnected from the voice channel
		var oldChannelName = newMember.guild.channels.get(oldChannel).name;
		if (loungeList.indexOf(oldChannelName) > -1)
		{
			var removeRole = oldMember.guild.roles.find(r => r.name === oldChannelName);
			newMember.removeRole(removeRole);
		}
	}
	else if (typeof oldChannel !== 'undefined' && typeof newChannel !== 'undefined')
	{ // user has switched voice channels
		var checkOldChannelName = newMember.guild.channels.get(oldChannel).name;
		if (loungeList.indexOf(checkOldChannelName) > -1)
		{
			var removeRole = oldMember.guild.roles.find(r => r.name === checkOldChannelName);
			newMember.removeRole(removeRole);
		}
		var checkNewChannelName = newMember.guild.channels.get(newChannel).name;
		if (loungeList.indexOf(checkNewChannelName) > -1)
		{
			var newRole = newMember.guild.roles.find(r => r.name === checkNewChannelName);
			newMember.addRole(newRole);
		}
	}
	
	
	
}