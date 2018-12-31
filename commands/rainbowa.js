// rainbowa command allows server admins to manually control the rainbow role

// define an object which contains the status of the rainbow role for all guilds
let rainbowStatus = {};

exports.run = async (client, message, args, level) => {
    // if guild is not in the rainbowStatus object, add it
    if (!(message.guild.id in rainbowStatus)) {
        rainbowStatus[message.guild.id] = 0;
    }
    // place defines which color to assign to the rainbow role
    let place = 0;
    // size defines how many colors the rainbow role should go through
    const size    = client.config.rainbowColorsNum;
    // create array to fill with colors
    const rainbow = new Array(size);
    // fill array with colors
    for (let i=0; i<size; i++) {
        let red   = sin_to_hex(i, 0 * Math.PI * 2/3); // 0   deg
        let blue  = sin_to_hex(i, 1 * Math.PI * 2/3); // 120 deg
        let green = sin_to_hex(i, 2 * Math.PI * 2/3); // 240 deg
        rainbow[i] = '#'+ red + green + blue;
    }
    // rainbowInterval is how often to change the color of the rainbow role
    let rainbowInterval;
    setTimeout(function(){rainbowInterval = setInterval(changeColor, client.config.rainbowColorsSpeed);}, 5000);
    // if rainbowRole is off, turn it on
    if (rainbowStatus[message.guild.id] === 0) {
        rainbowStatus[message.guild.id] = 1;
        await message.channel.send("rainbow role active");
    }
    else {
        // otherwise turn off the rainbow role
        rainbowStatus[message.guild.id] = 0;
        await message.channel.send("rainbow role disabled");
    }

    function sin_to_hex(i, phase) {
        // return a position on the sin wave to help define colors
        let sin = Math.sin(Math.PI / size * 2 * i + phase);
        let int = Math.floor(sin * 127) + 128;
        let hex = int.toString(16);
        return hex.length === 1 ? '0'+hex : hex;
    }

    function changeColor() {
        // changeColor changes the color of the rainbow role
        if (rainbowStatus[message.guild.id] === 0) {
            // if the rainbow status of the guild is 0, cancel
            // this works across different calls of !rainbowa command
            clearInterval(rainbowInterval);
        }
        // set the rainbow role to the next color in the array
        message.guild.roles.find(val => val.name === "Rainbow").setColor(rainbow[place])
            .catch(console.error);
        if (place == (size - 1)) {
            place = 0;
        }
        else {
            place++;
        }
    }
};

exports.conf = {
    enabled: true,
    guildOnly: true,
    aliases: [],
    permLevel: "Bot Admin"
};

exports.help = {
    name: "rainbowa",
    category: "Miscellaneous",
    description: "changes the status of the rainbow role",
    usage: "rainbowa"
};