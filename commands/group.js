// group command returns a tagpro group on a specified server.

const request = require("request");
const tpServers = ["diameter", "centra", "sphere", "origin", "pi", "radius", "chord", "orbit", "test"];
const maptestServers = ["maptest", "maptest2", "maptest3"];

exports.run = async (client, message, args, level) => {
    // define server
	let server;
    if (!args || args.length < 1){
        // if no server was given, use the default server
		server = "test";
    }
    else {
		// otherwise, parse argument
        let [serverProcess] = args.splice(0);
		// check if argument matches a server in the server list
        if (tpServers.indexOf(serverProcess.toLowerCase()) > -1) {
            // if so, assign server
			server = serverProcess.toLowerCase();
        }
        else {
			// otherwise, use the default server
            server = "test";
        }
    }
	// define links to build groups
    let groupBuild;
    let groupSend;
    if (maptestServers.indexOf(server) > -1) {
		// maptest servers use a different link than production servers
        groupBuild = 'http://' + server + '.newcompte.fr/groups/create';
        groupSend = 'http://' + server + '.newcompte.fr/groups/';
    } else if (tpServers.indexOf(server) > -1) {
		// define group builder for production servers
        groupBuild = 'http://tagpro-' + server + '.koalabeast.com/groups/create';
        groupSend = 'http://tagpro-' + server + '.koalabeast.com/groups/';
    }
	// create request to get new group
	// note that follow_redirects is important here because if
	// it is true, then the group builder automatically redirects to
	// the group created, which will return the html code instead of a text link
    request({
        method: 'POST',
        uri: groupBuild,
        multipart: [{
            'follow_redirects': 'false',
            'body': JSON.stringify({ public: "off" })
        }]
    }, function(error, response, body) {
		// return error to user if group cannot be created
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