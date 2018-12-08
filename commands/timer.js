exports.run = async (client, message, args, level) => { // eslint-disable-line no-unused-vars
    if (!args || args.length < 1) return message.reply("\nSorry, you didn't provide enough arguments.\nTry this: !timer [seconds]");
    var [timerLength] = args.splice(0);
    if (isNaN(timerLength) === false)
    {
        timerLength = Math.floor(timerLength);
        if (timerLength > 0 && timerLength < (10*60))
        {
            message.delete();
            message.channel.send("A timer was started for " + timerLength + " seconds!");
            var timerPart0;
            var timerPart1;
            var timerPart2;
            if (timerLength > 30)
            {
                timerPart0 = setInterval(displayTime0, 10000);
            }
            else
            {
                timerPart1 = setInterval(displayTime1, 5000);
            }
            function displayTime0()
            {
                timerLength -= 10;
                message.channel.send(timerLength + " seconds left");
                if (timerLength <= 30)
                {
                    clearInterval(timerPart0);
                    timerPart1 = setInterval(displayTime1, 5000);
                }
            }

            function displayTime1()
            {
                timerLength -= 5;
                message.channel.send(timerLength + " seconds left");
                if (timerLength <= 10)
                {
                    clearInterval(timerPart1);
                    timerPart2 = setInterval(displayTime2, 1000);
                }
            }

            function displayTime2()
            {
                timerLength -= 1;
                message.channel.send(timerLength + " seconds left");
                if (timerLength <= 1)
                {
                    clearInterval(timerPart2);
                    var finalMessage = setTimeout(finalDisplay, 1000);
                }
            }

            function finalDisplay()
            {
                message.channel.send("Timer complete!");
            }
        }
        else
        {
            message.channel.send("Sorry, a timer cannot be made using that number. Try using a number between 1 and 3600.");
        }
    }
    else
    {
        message.channel.send("Sorry, your argument could not be recognized. Try using a number between 1 and 3600.");
    }
};

exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: [],
    permLevel: "Bot Admin"
};

exports.help = {
    name: "timer",
    category: "Miscellaneous",
    description: "Sets a timer",
    usage: "timer [seconds]"
};