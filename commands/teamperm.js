// team command allows for moderators of the server to assign team roles to multiple members

exports.run = async (client, message, args, level) => {
    if (!args || args.length < 2) return message.channel.send("\nSorry, you didn't provide enough arguments.\nTry this: !teamperm [abbr] [@player]");
    // get the team role to assign
    let [abbrProcess] = args.splice(0);
    if (message.mentions.members.keyArray().length > 0) {
        let resultsArr = message.mentions.members.map((member, index, members) => {return processMember(abbrProcess.toUpperCase(), member, client)});
        return message.channel.send("Successfully processed:\n"+resultsArr.join("\n"));
    }
    else {
        // tell user if member wasn't mentioned
        return message.channel.send("Sorry, I couldn't find a mentioned player. Remember to mention each player instead of typing names!");
    }
};

exports.conf = {
    enabled: true,
    guildOnly: true,
    aliases: [],
    permLevel: "Administrator"
};

exports.help = {
    name: "teamperm",
    category: "Competitive",
    description: "Give permissions for member to assign team roles",
    usage: "teamperm [abbr] @player"
};

function processMember(abbrProcess, memberEdit, client) {
    let memberData = client.teamPerms.getTeamPerms.get(memberEdit.id);
    if (!memberData) {
        memberData = {
            "id": memberEdit.id,
            "teamlist": abbrProcess+" "
        };
        client.teamPerms.setTeamPerms.run(memberData);
        return `Added permissions to ${memberEdit.displayName} for ${abbrProcess}`;
    }
    else {
        let teamArr = memberData.teamlist.split(" ");
        console.log(teamArr);
        if (teamArr.indexOf(abbrProcess) < 0) {
            memberData.teamlist += abbrProcess + " ";
            client.teamPerms.setTeamPerms.run(memberData);
            return `Added permissions to ${memberEdit.displayName} for ${abbrProcess}`;
        }
        else {
            if (teamArr.length === 2) {
                memberData.teamlist = "";
            }
            else {
                teamArr.splice(teamArr.indexOf(abbrProcess),1);
                memberData.teamlist = teamArr.join(" ");
                console.log(memberData.teamlist);
            }
            client.teamPerms.setTeamPerms.run(memberData);
            return `Removed permissions to ${memberEdit.displayName} for ${abbrProcess}`;
        }
    }   
}