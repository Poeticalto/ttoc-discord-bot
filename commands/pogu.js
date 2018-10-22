exports.run = async (client, message, args, level) => { // eslint-disable-line no-unused-vars
  const emoji = client.emojis.find(emoji => emoji.name === "PogU");
  const msg = await message.channel.send(`${emoji}`);
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: "User"
};

exports.help = {
  name: "pogu",
  category: "Miscelaneous",
  description: "Sends the :PogU: emote",
  usage: "pogu"
};