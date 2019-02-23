// The guildMemberAdd event runs anytime a user joins a guild
// Note that due to the binding of client to every event, every event
// goes `client, other, args` when this function is run.

module.exports = async (client, member) => {
    // find the channel, then send the welcome message
    let someBallRole = member.guild.roles.find(role => role.name === "Some Ball");
    member.addRole(someBallRole).catch(console.error);
    let currentTime = new Date().getTime();
    let dateCreated = (parseInt(member.id) / 4194304) +  1420070400000;
    let differenceTime = currentTime - dateCreated;
    let convertedDifference = "";
    if (differenceTime < 60000) {
        convertedDifference = (differenceTime / 1000) + " seconds";
    }
    else if (differenceTime < 3600000) {
        convertedDifference = (differenceTime / 60000) + " minutes";
    }    
    else if (differenceTime < 86400000) {
        convertedDifference = (differenceTime / 3600000) + " hours";
    }
    else {
        convertedDifference = (differenceTime / 86400000) + " days";
    }
    member.guild.channels.find(channel => channel.name === "join-feed").send(`Age of ${member} is: ${convertedDifference}`);
    member.guild.channels.find(channel => channel.name === client.config.welcomeChannel).send(`Welcome to the ${member.guild.name} Discord, ${member}!\nYou need to be verified by an admin or a captain before you are allowed to chat in general channels. If an admin isn't available, send a private message to your captain asking them to give you a team role!`);
};