const request = require("request");
const tpServers = ["diameter", "centra", "sphere", "origin", "pi", "radius", "chord", "orbit"];
const maptestServers = ["maptest", "maptest2", "maptest3"];

exports.run = async (client, message, args, level) => {
    let server;
    if (!args || args.length < 1){
        server = "sphere";
    }
    else {
        let [serverProcess] = args.splice(0);
        if (tpServers.indexOf(serverProcess.toLowerCase()) > -1) {
            server = serverProcess.toLowerCase();
        }
        else {
            server = "sphere";
        }
    }
    let groupBuild;
    let groupSend;
    if (maptestServers.indexOf(server) > -1) {
        groupBuild = 'http://' + server + '.newcompte.fr/groups/create';
        groupSend = 'http://' + server + '.newcompte.fr/groups/';
    } else if (tpServers.indexOf(server) > -1) {
        groupBuild = 'http://tagpro-' + server + '.koalabeast.com/groups/create';
        groupSend = 'http://tagpro-' + server + '.koalabeast.com/groups/';
    }
    request({
        method: 'POST',
        uri: groupBuild,
        multipart: [{
            'follow_redirects': 'false',
            'body': JSON.stringify({ public: "off" })
        }]
    }, function(error, response, body) {
        if (response != null) {
            let groupId = body.split("/groups/")[body.split("/groups/").length - 1];
            message.channel.send("Here is your " + server + " group: <" + groupSend + groupId + ">");
        } else {
            message.channel.send("There was an issue getting your group. Please try again.");
        }
    });
};

exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: [],
    permLevel: "User"
};

exports.help = {
    name: "group",
    category: "tagpro",
    description: "Gets a tagpro group on the specified server",
    usage: "group [server]"
};