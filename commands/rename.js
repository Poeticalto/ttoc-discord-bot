/**
* Allows a lounge admin to change the name of the voice lounge
* @param {string} name - string to rename the lounge to
*/

exports.run = async (client, message, args, level) => {
    // return if no argument was provided
    if (!args || args.length < 1) return await message.channel.send("\nSorry, you didn't provide enough arguments.\nTry this: !rename [name]").catch(console.error);
    // join args to make lounge name
    let loungeName = args.splice(0);
    // clean lounge name to fit into discord guidelines
    loungeName = loungeName.join(" ").match(/[A-Za-z0-9 ]+/g);
    // return if the cleaned name is empty
    if (loungeName === null) return await message.reply("\nSorry, your lounge name doesn't work. Try using alphanumeric characters for your lounge name.").catch(console.error);
    loungeName = loungeName.join("").trim();
    if (loungeName.length > 30) {
        loungeName = loungeName.substring(0,30).trim();
    }
    let testChannel = message.guild.channels.find(channel => channel.name.toUpperCase() === ("L-"+loungeName.toUpperCase()));
    // otherwise, check if the command was done inside a lounge
    if (message.channel.parent !== null && (message.channel.parent.name === "General Lounges" || message.channel.parent.name === "MLTP" || message.channel.parent.name === "NLTP")&& message.channel.name.split("")[1]==="-") {
        if (testChannel === null && typeof testChannel === "object") {
            // check if the member is a lounge admin
            if (message.channel.permissionsFor(message.member).has("MANAGE_MESSAGES", true) === true) {
                // get voice lounge name
                let sectionName = message.channel.parent.name;
                const loungeNameOld = message.channel.topic;
                await message.guild.channels.find(channel => channel.name === loungeNameOld).setName(("L-"+loungeName)).catch(console.error);
                await message.channel.setName(("l-"+loungeName.replace(/ /g,"_").toLowerCase())).catch(console.error);
                await message.channel.setTopic(("L-"+loungeName)).catch(console.error);
                const sectionChannels = message.guild.channels.filter(channel => channel.parent !== null && channel.parent.name === sectionName && channel.type === "voice");
                const sectionChannelsKeys = doubleSort(sectionChannels.map(channel => channel.name), sectionChannels.keyArray());
                for (let j = 0; j < sectionChannelsKeys.length; j++)
                {
                    await sectionChannels.find(channel => channel.id === sectionChannelsKeys[j]).setPosition(j).catch(console.error);
                }
                return await message.channel.send("Successfully changed lounge name to L-"+loungeName+"!").catch(console.error);
            }
            // tell user they do not have admin permissions in the lounge
            return await message.channel.send("Sorry, you don't have permission to do that.").catch(console.error);
        }
        return await message.channel.send("Sorry, a lounge with that name already exists! Try a different name.").catch(console.error);
    }
    // tell user they cannot use this command here
    return await message.channel.send("Sorry, you can't use that command here.").catch(console.error);
};

exports.conf = {
    enabled: true,
    guildOnly: true,
    aliases: [],
    permLevel: "User"
};

exports.help = {
    name: "rename",
    category: "Lounges",
    description: "renames the voice lounge",
    usage: "rename [name]"
};

function doubleSort(nameArray, sortArray) {
    // sort sortArray by bubble sorting nameArray
    let done = false;
    while (!done) {
        done = true;
        for (let i = 1; i < nameArray.length; i++) {
            if (nameArray[i - 1].toLowerCase() > nameArray[i].toLowerCase()) {
                done = false;
                let tmp = nameArray[i-1];
                let tmpb = sortArray[i-1];
                nameArray[i-1] = nameArray[i];
                sortArray[i-1] = sortArray[i];
                nameArray[i] = tmp;
                sortArray[i] = tmpb;
            }
        }
    }
    return sortArray;
}