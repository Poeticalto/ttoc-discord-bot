// The guildMemberUpdate event runs anytime a member object is changed
// Note that due to the binding of client to every event, every event
// goes `client, other, args` when this function is run.

module.exports = async (client, oldMember, newMember) => {
    let someBallRole = newMember.guild.roles.find(role => role.name === "Some Ball");
    if (!oldMember.roles.has(someBallRole.id)) {
        // if the member didn't have the Some Ball role, we don't care
        return;
    }
    if ((oldMember.roles.has(someBallRole.id)) && (!newMember.roles.has(someBallRole.id)))
    {
        newMember.send(`Howdy ${newMember}, you've been successfully verified and are free to roam around the server!\nTo get my help, just type any of these commands in a server channel to start:\n\nCommand [Argument] :: Description\n!help                                  :: Gives all available commands\n!league [abbr]                 :: Gives a league role\n!lounge [name]               :: Creates a voice lounge in the General Lounges section\n\nBy default, you will only receive notifications on this server when you are mentioned. If you don't know how to set up notifications for channels on Discord, read the following:\n<https://support.discordapp.com/hc/en-us/articles/215253258-Notifications-Settings-101>`);
    }
};