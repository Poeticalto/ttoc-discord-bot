const fs = require("fs");
const path = require('path');
var pathToScrimList = path.join(__dirname, '../scrimList.json');
var schedule = require('node-schedule');

module.exports = (client) => {
    console.log(`Ready to serve in ${client.channels.size} channels on ${client.guilds.size} servers, for a total of ${client.users.size} users.`);
    console.log(`Logged in as ${client.user.tag}!`);
    client.user.setPresence({
        game: {
            name: '!help for commands',
            type: 'PLAYING'
        },
        status: 'online'
    });
    client.on("error", (e) => console.error(e));
    client.on("warn", (e) => console.warn(e));
    var resetScrimList = schedule.scheduleJob('0 0 5 * * *', function(){
        var scrimList = {
            "MLTP": [],
            "NLTP": [],
            "NFTL": [],
            "USC": [],
            "Players": []
        };
        fs.writeFile(pathToScrimList, JSON.stringify(scrimList, null, 4), 'utf8');
        console.log("scrim list reset!");
    });
}