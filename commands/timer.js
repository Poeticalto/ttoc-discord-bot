/**
* The timer command sets a timer and displays the progress
* @param {integer} time - the length of time the timer should run for
*/

exports.run = async (client, message, args, level) => { // eslint-disable-line no-unused-vars
    // return if no arguments were provided
    let timerLength;
    // get the timer length from args
    if (!args || args.length < 1) {
        timerLength = 10;
    }
    else {
        timerLength = args[0];
    }
    // check if timerLength is an integer
    if (isNaN(timerLength) === false) {
        // round down timerLength to resolve decimals
        timerLength = Math.floor(timerLength);
        // check if timer length is greater than 0 and less then 600 seconds (10 minutes)
        console.log(timerLength);
        if (timerLength > 0 && timerLength <= (10*60)) {
            // delete command message
            message.delete();
            let cancel = false;
            // declare start of timer
            message.channel.send("A timer was started for " + timerLength + " seconds!")
                .then(function() {
				message.channel.awaitMessages(response => response.author.id === message.author.id && response.cleanContent === "c", {
					max: 1,
					time: timerLength * 1000,
					errors: ['time'],
                }).then(() => {
                    cancel = true;
                }
                )
                .catch(() => {
                    cancel=false;
                    });
                });
            // set vars for different timer parts
            let timerPart0;
            let timerPart1;
            let timerPart2;
            // if timer is greater than 30 seconds, start with an interval of 10 seconds
            if (timerLength > 30) {
                timerPart0 = setInterval(displayTime0, 10000);
            }
            else {
                // if timer is less than 30 seconds, start with an interval of 5 seconds
                timerPart1 = setInterval(displayTime1, 5000);
            }
            async function displayTime0() {
                if (cancel === true){
                    clearInterval(timerPart0);
                    return;
                }
                // decrease the timer by 10 seconds
                timerLength -= 10;
                // send a message saying how many seconds are left
                await message.channel.send(timerLength + " seconds left").catch(console.error);
                if (timerLength <= 30) {
                    // if the timerLength is less than 30 seconds, move to 5 second intervals
                    clearInterval(timerPart0);
                    timerPart1 = setInterval(displayTime1, 5000);
                }
            }

            async function displayTime1() {
                // decrease the timer by 5 seconds
                if (cancel === true){
                    clearInterval(timerPart1);
                    return;
                }
                timerLength -= 5;
                // send a message saying how many seconds are left
                await message.channel.send(timerLength + " seconds left").catch(console.error);
                if (timerLength <= 10) {
                    // if timerLength is less than 10 seconds, move to 1 second intervals
                    clearInterval(timerPart1);
                    timerPart2 = setInterval(displayTime2, 1000);
                }
            }

            async function displayTime2() {
                // decrease the timer by 1 second
                if (cancel === true){
                    clearInterval(timerPart0);
                    return;
                }
                timerLength -= 1;
                // send a message saying how many seconds are left
                await message.channel.send(timerLength + " seconds left").catch(console.error);
                if (timerLength <= 1) {
                    // if timerLength is done, move to finalDisplay
                    clearInterval(timerPart2);
                    let finalMessage = setTimeout(finalDisplay, 1000);
                }
            }

            async function finalDisplay() {
                // declare that timer is complete
                await message.channel.send("Timer complete!").catch(console.error);
            }
        }
        else {
            // tell user to use a different number
            await message.channel.send("Sorry, a timer cannot be made using that number. Try using a number between 1 and 600.").catch(console.error);
        }
    }
    else {
        // tell user to use an integer
        await message.channel.send("Sorry, your argument could not be recognized. Try using a number between 1 and 600.").catch(console.error);
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