/**
* find command returns the voiceChannel of the member tagged
* @param {snowflake} user - the user to find
*/

exports.run = async (client, message, args, level) => { // eslint-disable-line no-unused-vars
    // get member
    const member = message.mentions.members.first();
    // check if member is defined, i.e. message contained a mentioned member
    if (!member) {
        // return if no arguments were given
        if (!args) {
            return await message.channel.send('Need to @mention a user/bot to find.').catch(console.error);
        }
        // see if user typed a member's name instead of tagging
        const testMember = message.guild.members.find(member => member.displayName.toLowerCase() === args.join(" ").toLowerCase());
        // return if the member does not exist
        if (!testMember) {
            return await message.channel.send(`${args.splice(0)} not found. Make sure the name or mention is correct.`).catch(console.error);
        }
        // return if member is not currently in a voice channel
        if (!testMember.voiceChannel) {
            return await message.channel.send(`${testMember.displayName} is not connected to a voice channel.`).catch(console.error);
        }
        // display member's current voiceChannel name
        return await message.channel.send(`${testMember.displayName} is currently in ${testMember.voiceChannel}.`).catch(console.error);
    }
    // return if member is not in a voiceChannel
    if (!member.voiceChannel) {
        return await message.channel.send(`${member.displayName} is not connected to a voice channel.`).catch(console.error);
    }
    // otherwise display member's current voiceChannel name
    return await message.channel.send(`${member.displayName} is currently in ${member.voiceChannel}.`).catch(console.error);
};

exports.conf = {
    enabled: true,
    guildOnly: true,
    aliases: [],
    permLevel: "User"
};

exports.help = {
    name: "find",
    category: "Lounges",
    description: "Finds what voice channel a member is in",
    usage: "find [name or mention]"
};