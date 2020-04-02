/**
* league command allows for a member to define their own leagues roles in the server
* @param {string} league - the league corresponding to the role which should be added/removed
*/

exports.run = async (client, message, args, level) => {
    // return if no arguments were provided
    if (!args || args.length < 1) return await message.reply("\nSorry, you didn't provide enough arguments.\nTry this: !league [league]").catch(console.error);
    // get league name
    let [abbrProcess] = args.splice(0);
    // get member from message
    let author = message.member;
    // get leagueList from config
    let leagueList = client.config.leagueList;
    // if league is in the league list, then process role
    if (leagueList.indexOf(abbrProcess.toUpperCase()) > -1) {
        processRole(abbrProcess.toUpperCase(), author, message, leagueList, client);
    }
    else if (abbrProcess.toUpperCase() == "RETIRED") {
        processRole("Retired", author, message, leagueList, client);
    }
    else {
        // otherwise notify user to use an actual league
        return await message.reply("\nSorry, the league name was not recognized.\nUse !league [league] and use one of these leagues: \n"+leagueList.toString()).catch(console.error);
    }
};

exports.conf = {
    enabled: true,
    guildOnly: true,
    aliases: [],
    permLevel: "User"
};

exports.help = {
    name: "league",
    category: "Competitive",
    description: "Allows for players to get league roles",
    usage: "league [league]"
};

async function processRole(abbrProcess, memberEdit, message, leagueList, client) {
    // get role represented by abbrProcess
    const roleToCheck = message.guild.roles.find(role => role.name === abbrProcess);
    const blankRole = message.guild.roles.find(role => role.name === "None");
    leagueList = leagueList.filter(e=>e!==abbrProcess);
    // check if member has the role
    if (memberEdit.roles.has(roleToCheck.id)) {
        // if member has role, remove it
        await memberEdit.removeRole(roleToCheck).catch(console.error);
        await message.channel.send(abbrProcess+" role successfully removed!").catch(console.error);
        if (!memberEdit.roles.some(r=>leagueList.includes(r.name))) {
            await client.wait(500);
            await memberEdit.addRole(blankRole).catch(console.error);
        }  
    }
    else {
        // if member doesn't have role, add it
        await memberEdit.addRole(roleToCheck).catch(console.error);
        await message.channel.send(abbrProcess+" role successfully added!").catch(console.error);
        if (memberEdit.roles.has(blankRole.id)) {
            await client.wait(500);
            await memberEdit.removeRole(blankRole).catch(console.error);
        }
    }
}