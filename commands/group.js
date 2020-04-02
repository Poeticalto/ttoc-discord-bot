/**
* The group command returns a tagpro group for the specified server
* @param {string} server - the server to get the tagpro group from
*/

const request = require("request");
const maptestServers = ["maptest", "maptest2"];

exports.run = async (client, message, args, level) => {
    // define server
	let server;
    if (!args || args.length < 1){
        // if no server was given, use the default server
		server = "tagpro";
    }
    else {
		// otherwise, parse argument
        let [serverProcess] = args.splice(0);
		// check if argument matches a server in the server list
        if (maptestServers.indexOf(serverProcess.toLowerCase()) > -1) {
            // if so, assign server
			server = serverProcess.toLowerCase();
        }
        else {
			// otherwise, use the default server
            server = "tagpro";
        }
    }
	// define links to build groups
    let groupBuild;
    let groupSend;
    if (maptestServers.indexOf(server) > -1) {
		// maptest servers use a different link than production servers
        groupBuild = 'http://' + server + '.newcompte.fr/groups/create';
        groupSend = 'http://' + server + '.newcompte.fr/groups/';
    }
    else {
		// define group builder for production servers
        groupBuild = 'https://tagpro.koalabeast.com/groups/create';
        groupSend = 'https://tagpro.koalabeast.com/groups/';
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
    }, async function(error, response, body) {
		// return error to user if group cannot be created
        if (response != null) {
            let groupId = body.split("/groups/")[body.split("/groups/").length - 1];
            await message.channel.send("Here is your group: <" + groupSend + groupId + ">").catch(console.error);
        } else {
            await message.channel.send("There was an issue getting your group. Please try again.").catch(console.error);
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