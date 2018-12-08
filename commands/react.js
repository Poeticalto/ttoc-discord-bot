const emojiTree = require('emoji-tree');

exports.run = async (client, message, args, level) => { // eslint-disable-line no-unused-vars
  	if (!args || args.length < 1) return message.channel.send("\nSorry, you didn't provide enough arguments.\nTry this: !react [text]");
	console.log(message.author.username + " did !react command with args " + args.join(" "));
	var reactionAdd = args.join("").toLowerCase();
	var splitArray = reactionAdd.split("");
  message.channel.fetchMessages({limit: 2}).then(messages => {
	  var lastID = messages.keyArray();
	  message.channel.fetchMessage(lastID[1]).then(async function (messagea) {
		  message.delete();
		  var parseArray = emojiTree(reactionAdd);
		  var emojiCount = 0;
		  var letterCount = 0;
		  var parseArrayLength = parseArray.length;
		  for (var i = 0; i < parseArrayLength; i++)
		  {
			if (parseArray[i]["text"].match(/[a-z]/i))
			{				
				var checkLetters = splitArray.slice(0,i + emojiCount);
				if (checkLetters.includes(parseArray[i]["text"]) === false)
				{
					if (letterCount < 20)
					{
						await messagea.react(getUnicodeChar(parseArray[i]["text"]));
						letterCount++;
					}
				}
			}
			else if (parseArray[i]["type"] === 'emoji')
			{
				if (letterCount < 20)
				{
					await messagea.react(parseArray[i]["text"]);
					emojiCount++;
					letterCount++;
				}
			}
		  }
	  });
	  });
};

function getUnicodeChar(getCharOf)
{
	const unicodeChars = {
		'a': '🇦',
		'b': '🇧',
		'c': '🇨',
		'd': '🇩',
		'e': '🇪',
		'f': '🇫',
		'g': '🇬',
		'h': '🇭',
		'i': '🇮',
		'j': '🇯',
		'k': '🇰',
		'l': '🇱',
		'm': '🇲',
		'n': '🇳',
		'o': '🇴',
		'p': '🇵',
		'q': '🇶',
		'r': '🇷',
		's': '🇸',
		't': '🇹',
		'u': '🇺',
		'v': '🇻',
		'w': '🇼',
		'x': '🇽',
		'y': '🇾',
		'z': '🇿'
	};
	return unicodeChars[getCharOf];
}

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: [],
  permLevel: "User"
};

exports.help = {
  name: "react",
  category: "Miscellaneous",
  description: "reacts to the previous message with a string",
  usage: "react [string]"
};