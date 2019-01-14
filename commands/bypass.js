// The bypass command allows a lounge admin to designate certain members or roles who can bypass a locked lounge

exports.run = (client, message, args, level) => {
    // return if no args were provided
    if (!args || args.length < 1) return message.channel.send("\nSorry, you didn't provide enough arguments.\nTry this: !bypass [@player/@role]");
    // return if no member or role was mentioned
    if (message.mentions.roles.keyArray().length === 0 && message.mentions.members.keyArray().length === 0) {
        return message.channel.send("Sorry, a player or role was not detected.\nTry this: !bypass [@player/@role]");
    }
    else {
        // check that channel is a voice lounge
        if (message.channel.parent !== null && (message.channel.parent.name === "General Lounges" || message.channel.parent.name === "MLTP" || message.channel.parent.name === "NLTP") && message.channel.name.split("")[1]==="-") {
            // check if the member is a lounge admin
            if (message.channel.permissionsFor(message.member).has("MANAGE_MESSAGES", true) === true) {
                // get the lounge name
                const loungeName = message.channel.topic;
                // process permissions for tagged users
                let resultsArr = "";
                if (message.mentions.members.keyArray().length > 0) {
                    resultsArr += message.mentions.members.map((member, index, members) => {return processPermissions(member, message, loungeName)}).join("\n");
                }
                // process permissions for tagged roles
                if (message.mentions.roles.keyArray().length > 0) {
                    resultsArr += message.mentions.roles.map((role, index, roles) => {return processPermissions(role, message, loungeName)}).join("\n");
                }
                // send results
                return message.channel.send("Successfully processed:\n"+resultsArr);
            }
            else {
                // notify member that they don't have permission
                message.channel.send("Sorry, you don't have permission to do that.");
            }
        }
        else {
            // notify user that they are in the wrong channel
            message.channel.send("Sorry, you can't use that command here.");
        }
    }
};

exports.conf = {
    enabled: true,
    guildOnly: true,
    aliases: [],
    permLevel: "User"
};

exports.help = {
    name: "bypass",
    category: "Lounges",
    description: "allow/reset a player/role to bypass a locked lounge",
    usage: "bypass [@player/@role]"
};

function processPermissions(memberEdit, message, loungeName) {
    // check whether to add or remove permissions
    if (message.guild.channels.find(channel => channel.name === loungeName).permissionsFor(memberEdit).has("CONNECT", true) === true) {
        // If user currently has permissions, remove
        message.guild.channels.find(channel => channel.name === loungeName).overwritePermissions(memberEdit, {
            "CONNECT": null
        });
        // return string noting results
        if (memberEdit.displayName) {
            // memberEdit was a guildMember
            return "Lounge Bypass privileges successfully removed for "+memberEdit.displayName;
        }
        else {
            // memberEdit was a role
            return "Lounge Bypass privileges successfully removed for "+memberEdit.name;
        }
    }
    else {
        // If user does not have permissions, add
        message.guild.channels.find(channel => channel.name === loungeName).overwritePermissions(memberEdit, {
            "CONNECT": true
        });
        // return string noting results
        if (memberEdit.displayName) {
            // memberEdit was a guildMember
            return "Lounge Bypass privileges successfully added for "+memberEdit.displayName;
        }
        else {
            // memberEdit was a role
            return "Lounge Bypass privileges successfully added for "+memberEdit.name;
        }
    }
}