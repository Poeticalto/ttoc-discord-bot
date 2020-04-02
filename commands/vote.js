/**
* Adds, updates, or removes a user's tagpro profile from the users database.
* 
* @param {snowflake} @user - user mention representing user to be used for the vote
*/

exports.run = async (client, message, args, level) => { // eslint-disable-line no-unused-vars
    if (message.mentions.members.keyArray().length < 1) {
        return await message.channel.send("Sorry, a player needs to be mentioned for this command.").catch(console.error);
    }
    await message.delete().catch(console.error);
    let memberVote = message.mentions.members.first();
    let sentVote = await message.channel.send('Vote of No Confidence for: '+memberVote+'\nCreated by: '+message.member).catch(console.error);
    await sentVote.react('🇾').catch(console.error);
    await sentVote.react('🇳').catch(console.error);
};

exports.conf = {
    enabled: true,
    guildOnly: true,
    aliases: ["v"],
    permLevel: "Administrator"
};

exports.help = {
    name: "vote",
    category: "Miscellaneous",
    description: "Vote of No Confidence",
    usage: "vote @Player"
};