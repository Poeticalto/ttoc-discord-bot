exports.run = async (client, message, args, level) => { // eslint-disable-line no-unused-vars
    const emoji = client.emojis.find(emoji => emoji.name === "PogChamp");
    message.delete();
    const msg = await message.channel.send(`${emoji}`);
};

exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: ["pogchamp"],
    permLevel: "User"
};

exports.help = {
    name: "pogc",
    category: "Miscelaneous",
    description: "Sends the :PogChamp: emote",
    usage: "pogc"
};