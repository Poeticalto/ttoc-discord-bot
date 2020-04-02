/**
* React command converts a string into reactions for a message
* The string supports letters and default emoticons
* Two limitations of discord reactions: cannot repeat reactions and limit of 20 reactions per message
* @param {snowflake} user/role - the user/role to add/remove bypass permissions for
*/

const emojiTree = require('emoji-tree');

exports.run = async (client, message, args, level) => { // eslint-disable-line no-unused-vars
    // return if no argument was given
    if (!args || args.length < 1) return await message.channel.send("\nSorry, you didn't provide enough arguments.\nTry this: !react [text]").catch(console.error);
    // concat args to get a string
    const reactionAdd = args.join("").toLowerCase();
    // split array by character to check for emoticons
    const splitArray = reactionAdd.split("");
    // get the pervious message to react to
    await message.channel.fetchMessages({limit: 2}).then(async (messages) => {
        let lastID = messages.keyArray();
        // get previous message
        await message.channel.fetchMessage(lastID[1]).then(async function (messagea) {
            // delete command message
            await message.delete().catch(console.error);
            // check each character to see if it is an emoticon
            let parseArray = emojiTree(reactionAdd);
            // define counts for emojis and letters
            // this needs to be separate because emoticons are technically two characters
            let emojiCount = 0;
            let letterCount = 0;
            // get length of parseArray
            const parseArrayLength = parseArray.length;
            for (let i = 0; i < parseArrayLength; i++) {
                // check if character is text or an emoticon
                if (parseArray[i].text.match(/[a-z]/i)) {
                    // get array to check if letter has been used already
                    let checkLetters = splitArray.slice(0,i + emojiCount);
                    if (checkLetters.includes(parseArray[i].text) === false && letterCount < 20) {
                        // if letter has not been used and there are less than twenty unique reactions, then add letter as reaction
                        await messagea.react(getUnicodeChar(parseArray[i].text)).catch(console.error);
                        // increment letter count
                        letterCount++;
                    }
                    else {
                        return;
                    }
                }
                else if (parseArray[i]["type"] === 'emoji' && letterCount < 20) {
                    // if character is emoticon and there are less than twenty unique reactions, add emoticon
                    await messagea.react(parseArray[i].text).catch(console.error);
                    // increment both emojiCount and letterCount
                    emojiCount++;
                    letterCount++;
                }
                else if (letterCount >= 20) {
                    return;
                }
            }
        }).catch(console.error);
    }).catch(console.error);
};

function getUnicodeChar(getCharOf) {
    // return unicode emoticon of letter
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