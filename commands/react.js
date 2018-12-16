const emojiTree = require('emoji-tree');

exports.run = async (client, message, args, level) => { // eslint-disable-line no-unused-vars
	client.logger.log(`(${message.member.id}) ${message.member.displayName} used command react with args ${args}`);
    if (!args || args.length < 1) return message.channel.send("\nSorry, you didn't provide enough arguments.\nTry this: !react [text]");
    const reactionAdd = args.join("").toLowerCase();
    const splitArray = reactionAdd.split("");
    message.channel.fetchMessages({limit: 2}).then(messages => {
        let lastID = messages.keyArray();
        message.channel.fetchMessage(lastID[1]).then(async function (messagea) {
            message.delete();
            let parseArray = emojiTree(reactionAdd);
            let emojiCount = 0;
            let letterCount = 0;
            const parseArrayLength = parseArray.length;
            for (let i = 0; i < parseArrayLength; i++) {
                if (parseArray[i]["text"].match(/[a-z]/i)) {
                    let checkLetters = splitArray.slice(0,i + emojiCount);
                    if (checkLetters.includes(parseArray[i]["text"]) === false) {
                        if (letterCount < 20) {
                            await messagea.react(getUnicodeChar(parseArray[i]["text"])).catch(console.error);
                            letterCount++;
                        }
                    }
                }
                else if (parseArray[i]["type"] === 'emoji') {
                    if (letterCount < 20) {
                        await messagea.react(parseArray[i]["text"]).catch(console.error);
                        emojiCount++;
                        letterCount++;
                    }
                }
            }
        });
    });
};

function getUnicodeChar(getCharOf) {
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