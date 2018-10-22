var cats = require('cat-ascii-faces');

exports.run = async (client, message, args, level) => { // eslint-disable-line no-unused-vars
  const msg = await message.channel.send(cats());
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: "User"
};

exports.help = {
  name: "cat",
  category: "Miscelaneous",
  description: "Sends a cat!",
  usage: "cat"
};