exports.run = async (client, message, args) => { // eslint-disable-line no-unused-vars
	client.logger.log(`(${message.member.id}) ${message.member.displayName} used command bubble with args ${args}`);
    if (!args || args.length < 1) return await message.channel.send("\nSorry, you didn't provide enough arguments.\nTry this: !bubble [text]");
    let array = args.join(" ");
    array = array.split("");
    message.delete();
    let newMessage = "";
    for (let i = 0; i < array.length; i++) {
        let currentLetter = array[i];
        if (currentLetter.match(/[A-z]/i)) {
            newMessage += ":regional_indicator_" + currentLetter.toLowerCase() + ": ";
        }
        else if (currentLetter === " ") {
            newMessage += "   ";
        }
        else if (currentLetter.match(/[0-9]/i)) {
            switch(currentLetter) {
                case "0":
                    newMessage += ":zero: ";
                    break;
                case "1":
                    newMessage += ":one: ";
                    break;
                case "2":
                    newMessage += ":two: ";
                    break;
                case "3":
                    newMessage += ":three: ";
                    break;
                case "4":
                    newMessage += ":four: ";
                    break;
                case "5":
                    newMessage += ":five: ";
                    break;
                case "6":
                    newMessage += ":six: ";
                    break;
                case "7":
                    newMessage += ":seven: ";
                    break;
                case "8":
                    newMessage += ":eight: ";
                    break;
                case "9":
                    newMessage += ":nine: ";
                    break;
            }
        }
        else if (currentLetter === "!") {
            newMessage += ":grey_exclamation: ";
        }
        else if (currentLetter === "?") {
            newMessage += ":grey_question: ";
        }
        else {
            newMessage += currentLetter + " ";
        }
    }
    newMessage += "- " + message.author.username;
    await message.channel.send(newMessage);
};

exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: ["b"],
    permLevel: "user"
};

exports.help = {
    name: "bubble",
    category: "Miscelaneous",
    description: "Changes your text to bubble letters",
    usage: "bubble [text]"
};