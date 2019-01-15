// vote command is a fun command to have fun with other people

exports.run = async (client, message, args, level) => { // eslint-disable-line no-unused-vars
    if (message.mentions.members.keyArray().length < 1) return message.channel.send("Sorry, a player needs to be mentioned for this command.");
    message.delete();
    let memberVote = message.mentions.members.first();
    let sentVote = await message.channel.send('Vote of No Confidence for: '+memberVote+'\nCreated by: '+message.member);
    await sentVote.react('🇾');
    await sentVote.react('🇳');
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