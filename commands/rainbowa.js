let rainbowStatus = {};

exports.run = async (client, message, args, level) => {
	client.logger.log(`(${message.member.id}) ${message.member.displayName} used command rainbowa with args ${args}`);
    if (!(message.guild.id in rainbowStatus)) {
        rainbowStatus[message.guild.id] = 0;
    }
    let place = 0;
    const size    = client.config.rainbowColorsNum;
    const rainbow = new Array(size);
    for (let i=0; i<size; i++) {
        let red   = sin_to_hex(i, 0 * Math.PI * 2/3); // 0   deg
        let blue  = sin_to_hex(i, 1 * Math.PI * 2/3); // 120 deg
        let green = sin_to_hex(i, 2 * Math.PI * 2/3); // 240 deg
        rainbow[i] = '#'+ red + green + blue;
    }
    let rainbowInterval;
    setTimeout(function(){rainbowInterval = setInterval(changeColor, client.config.rainbowColorsSpeed);}, 5000);
    if (rainbowStatus[message.guild.id] === 0) {
        rainbowStatus[message.guild.id] = 1;
        await message.channel.send("rainbow role active");
    }
    else {
        rainbowStatus[message.guild.id] = 0;
        await message.channel.send("rainbow role disabled");
    }

    function sin_to_hex(i, phase) {
        let sin = Math.sin(Math.PI / size * 2 * i + phase);
        let int = Math.floor(sin * 127) + 128;
        let hex = int.toString(16);
        return hex.length === 1 ? '0'+hex : hex;
    }

    function changeColor() {
        if (rainbowStatus[message.guild.id] === 0) {
            clearInterval(rainbowInterval);
        }
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