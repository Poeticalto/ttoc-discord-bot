// The guildMemberAdd event runs anytime a user joins a guild
// Note that due to the binding of client to every event, every event
// goes `client, other, args` when this function is run.

module.exports = async (client, member) => {
    // find the channel, then send the welcome message
    member.guild.channels.find(channel => channel.name === client.config.welcomeChannel).send(`Welcome to the ${member.guild.name}, ${member}!\nTo get my help, just type any of these commands to start:\n\nCommand [Argument] :: Description\n!help                                  :: Gives all available commands\n!league [abbr]                 :: Gives a league role\n!lounge [name]               :: Creates a voice lounge in the General Lounges section\n\nBy default, you will only receive notifications on this server when you are mentioned. If you don't know how to set up notifications for channels on Discord, read the following:\n<https://support.discordapp.com/hc/en-us/articles/215253258-Notifications-Settings-101>`);
};