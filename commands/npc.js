/**
* Add or edit user information into captains database
* @async
*/

const Discord = require('discord.js');
const axios = require('axios');

exports.run = async (client, message, args, level) => { // eslint-disable-line no-unused-vars
    //return message.author.send("Signups have closed for NALTP. If you need something changed or want to remove your signup, send a message to Poeticalto.");
    let user = client.usersDB.getUserByDiscord.get(message.author.id);
    if (!user || (user && user.vstatus && user.vstatus < 2)) {
        return await message.author.send("Sorry, you need to have your tagpro profile verified in order to sign up for NPC. Please type `!verify ID` here to begin, where ID is replaced by your TagPro ID.").catch(console.error);
    }
    if (message.channel.type !== "dm") {
        await message.delete().catch(console.error);
    }
    let captainData = client.captainsDB.getUserByDiscord.get(message.author.id);
    if (!captainData || captainData.isRegistered == 0) {
        message.author.send("Welcome to the NALTP captaincy app! Please try to do this in one sitting to avoid timing out the signup and forcing you to do it again.");//\n**If you are signing up for playing captain, let this time out and sign up through `!naltp`");
        if (!captainData) {
            captainData = {
                discordid: message.author.id,
                tagproid: user.tagproid,
                tagproname: user.tagproname,
                q1: "",
                q2: "",
                q3: "",
                q4: "",
                q5: "",
                q6: "",
                q7: "",
                q8: "",
                q9: "",
                q10: "",
                formConfirm: false
            };
        }
        captainData = await captainApp(client, message, user, captainData);
        if (!captainData.formConfirm) {
            //idk
        }
        else {
            captainData.isregistered = 2;
            sendCaptainData(captainData);
        }
        client.captainsDB.setUser.run(captainData);
    }
    else {
        const abFilter = (reaction, user) => {
            return ['🇦', '🇧'].includes(reaction.emoji.name) && user.id === message.author.id;
        };
        let secondCaptainOptions = await message.author.send("Welcome back to the NALTP captaincy app! Please select an option:\nReact 🇦 to edit your application\nReact 🇧 to "+ (captainData.isregistered == 2 ? "remove" : "re-add") +" your application.").catch(console.error);
        await secondCaptainOptions.react("🇦").catch(console.error);
        await secondCaptainOptions.react("🇧").catch(console.error);
        await secondCaptainOptions.awaitReactions(abFilter, { max: 1, time: 300000, errors: ['time'] })
            .then(async function(collected) {
            const reaction = collected.first();
            if (reaction.emoji.name === '🇦') {
                captainData.formConfirm = false;
                captainData = await captainApp(client, message, user, captainData);
                if (!captainData.formConfirm) {
                    //idk
                }
                else {
                    captainData.isregistered = 2;
                    sendCaptainData(captainData);
                }
                client.captainsDB.setUser.run(captainData);
            }
            else if (reaction.emoji.name === '🇧') {
                if (captainData.isregistered == 2) {
                    captainData.isregistered = 1;
                }
                else {
                    captainData.isregistered = 2;
                }
                sendCaptainData(captainData);
                client.captainsDB.setUser.run(captainData);
            }
        })
            .catch(async (collected) => {
                await message.author.send("Sorry, I did not detect a response and your signup has timed out. Whenever you are ready, please do `!naltp` again.").catch(console.error);
        });
    }
    await message.author.send("Data has been successfully updated. If you need to change anything else, just do `!npc` again.").catch(console.error);
};

exports.conf = {
    enabled: false,
    guildOnly: false,
    aliases: [],
    permLevel: "User"
};

exports.help = {
    name: "npc",
    category: "Competitive",
    description: "NPC signup for NALTP S21/18",
    usage: "npc"
};

async function captainApp(client, message, user, captainData) {
    await message.author.send("**If I don't catch your response within a few seconds, wait for all of the reacts to show up and then unreact/react again or copy/paste your response again.**").catch(console.error);
    let count = 0;
    const donefilter = (reaction, user) => {
        return ['☑'].includes(reaction.emoji.name) && user.id === message.author.id;
    };
    let captainType = await message.author.send("What tier of captaincy are you applying for?\nReact 🇦 for M/mLTP Non Playing Captain\nReact 🇧 for NLTP Non Playing Captain\n*Please react with ☑ when you have selected all of your options.*").catch(console.error);
    if (captainData.q1 !== "") {
        await message.author.send("Previous response: " + captainData.q1).catch(console.error);
    }
    await captainType.react('🇦').catch(console.error);
    await captainType.react('🇧').catch(console.error);
    await captainType.react('☑').catch(console.error);
    await captainType.awaitReactions(donefilter, { max: 1, time: 300000, errors: ['time'] })
        .then(async (collected) => {
        let typeArr = [];
        let typeString = "";
        let reactCollection = collected.first().message.reactions;
        if (reactCollection.get("🇦").users.get(message.author.id)) {
            typeArr.push("MNC");
        }
        if (reactCollection.get("🇧").users.get(message.author.id)) {
            typeArr.push("NPC");
        }
        if (typeArr.length == 0) {
            typeString = "none";
        }
        else {
            for (let i = 0; i < (typeArr.length - 1); i++) {
                typeString += typeArr[i] + ", ";
            }
            typeString += typeArr[typeArr.length - 1];
        }
        captainData.q1 = typeString;
        await message.author.send("Great! Next question:").catch(console.error);
        count++;
    })
        .catch(async (collected) => {
        await message.author.send("Sorry, I did not detect a response and your signup has timed out. Whenever you are ready, please do `!naltp` again.").catch(console.error);
    });
    if (count < 1) {
        return captainData;
    }
    let comfortServers = await message.author.send("**What servers are you comfortable captaining on?**\nReact 🇦 for Atlanta\nReact 🇨 for Chicago\nReact 🇩 for Dallas\nReact 🇫 for San Francisco\nReact 🇱 for Los Angeles\nReact 🇲 for Miami\nReact 🇳 for New York\nReact 🇸 for Seattle\nReact 🇹 for Toronto\n*Please react with ☑️ when you have selected all of your severs.*").catch(console.error);
    await comfortServers.react("🇦").catch(console.error);
    await comfortServers.react("🇨").catch(console.error);
    await comfortServers.react("🇩").catch(console.error);
    await comfortServers.react("🇫").catch(console.error);
    await comfortServers.react("🇱").catch(console.error);
    await comfortServers.react("🇲").catch(console.error);
    await comfortServers.react("🇳").catch(console.error);
    await comfortServers.react("🇸").catch(console.error);
    await comfortServers.react("🇹").catch(console.error);
    await comfortServers.react("☑").catch(console.error);
    if (captainData.q2 !== "") {
        await message.author.send("Previous response: " + captainData.q2).catch(console.error);
    }
    await comfortServers.awaitReactions(donefilter, { max: 1, time: 300000, errors: ['time'] })
        .then(async (collected) => {
        let serverArr = [];
        let serverString = "";
        let reactCollection = collected.first().message.reactions;
        if (reactCollection.get("🇦").users.get(message.author.id)) {
            serverArr.push("Atlanta");
        }
        if (reactCollection.get("🇨").users.get(message.author.id)) {
            serverArr.push("Chicago");
        }
        if (reactCollection.get("🇩").users.get(message.author.id)) {
            serverArr.push("Dallas");
        }
        if (reactCollection.get("🇫").users.get(message.author.id)) {
            serverArr.push("San Francisco");
        }
        if (reactCollection.get("🇱").users.get(message.author.id)) {
            serverArr.push("Los Angeles");
        }
        if (reactCollection.get("🇲").users.get(message.author.id)) {
            serverArr.push("Miami");
        }
        if (reactCollection.get("🇳").users.get(message.author.id)) {
            serverArr.push("New York");
        }
        if (reactCollection.get("🇸").users.get(message.author.id)) {
            serverArr.push("Seattle");
        }
        if (reactCollection.get("🇹").users.get(message.author.id)) {
            serverArr.push("Toronto");
        }
        if (serverArr.length == 0) {
            serverString = "home server";
        }
        else {
            for (let i = 0; i < (serverArr.length - 1); i++) {
                serverString += serverArr[i] + ", ";
            }
            serverString += serverArr[serverArr.length - 1];
        }
        captainData.q2 = serverString;
        await message.author.send("Great! Next question:").catch(console.error);
        count++;
    })
        .catch(async (collected) => {
            await message.author.send("Sorry, I did not detect a response and your signup has timed out. Whenever you are ready, please do `!naltp` again.").catch(console.error);
    });
    if (count < 2) {
        return captainData;
    }
    let expComment = await message.author.send("**Please summarize your TagPro experience.** In particular, we'd like to know about any leadership experience you've already had.").catch(console.error);
    if (captainData.q3 !== "") {
        await message.author.send("Previous response: " + captainData.q3).catch(console.error);
    }
    await expComment.channel.awaitMessages(response => response.author.id === message.author.id, {
        max: 1,
        time: 300000,
        errors: ['time'],
    })
        .then(async function(collected) {
        captainData.q3 = collected.first().cleanContent;
        await message.author.send("Great! Next question:").catch(console.error);
        count++;
    })
        .catch(async function() {
            await message.author.send('Sorry, I did not detect a response and your signup has timed out. Whenever you are ready, please do `!naltp` again.').catch(console.error);
    });
    if (count < 3) {
        return captainData;
    }
    let whyComment = await message.author.send("**Why do you want to be a captain?**").catch(console.error);
    if (captainData.q4 !== "") {
        await message.author.send("Previous response: " + captainData.q4).catch(console.error);
    }
    await expComment.channel.awaitMessages(response => response.author.id === message.author.id, {
        max: 1,
        time: 300000,
        errors: ['time'],
    })
        .then(async function(collected) {
            captainData.q4 = collected.first().cleanContent;
            await message.author.send("Great! Next question:").catch(console.error);
            count++;
    })
        .catch(async function() {
            await message.author.send('Sorry, I did not detect a response and your signup has timed out. Whenever you are ready, please do `!naltp` again.').catch(console.error);
    });
    if (count < 4) {
        return captainData;
    }
    let timeComment = await message.author.send("**What will be your time commitment to captaining this season?**").catch(console.error);
    if (captainData.q5 !== "") {
        await message.author.send("Previous response: " + captainData.q5).catch(console.error);
    }
    await timeComment.channel.awaitMessages(response => response.author.id === message.author.id, {
        max: 1,
        time: 300000,
        errors: ['time'],
    })
        .then(async function(collected) {
            captainData.q5 = collected.first().cleanContent;
            await message.author.send("Great! Next question:").catch(console.error);
            count++;
    })
        .catch(async function() {
            await message.author.send('Sorry, I did not detect a response and your signup has timed out. Whenever you are ready, please do `!naltp` again.').catch(console.error);
    });
    if (count < 5) {
        return captainData;
    }
    let othersComment = await message.author.send("**Do you know anyone the CRC should contact to be a captain?**").catch(console.error);
    if (captainData.q6 !== "") {
        await message.author.send("Previous response: " + captainData.q6).catch(console.error);
    }
    await othersComment.channel.awaitMessages(response => response.author.id === message.author.id, {
        max: 1,
        time: 300000,
        errors: ['time'],
    })
        .then(async function(collected) {
            captainData.q6 = collected.first().cleanContent;
            await message.author.send("Great! Next question:").catch(console.error);
            count++;
    })
        .catch(async function() {
            await message.author.send('Sorry, I did not detect a response and your signup has timed out. Whenever you are ready, please do `!naltp` again.').catch(console.error);
    });
    if (count < 6) {
        return captainData;
    }
    let generalComment = await message.author.send("**Do you have any general comments for the CRC? If you want to be a minors captain, please note it here.**").catch(console.error);
    if (captainData.q7 !== "") {
        await message.author.send("Previous response: " + captainData.q7).catch(console.error);
    }
    await generalComment.channel.awaitMessages(response => response.author.id === message.author.id, {
        max: 1,
        time: 300000,
        errors: ['time'],
    })
        .then(async function(collected) {
            captainData.q7 = collected.first().cleanContent;
            await message.author.send("Great! Next question:").catch(console.error);
            count++;
    })
        .catch(async function() {
            await message.author.send('Sorry, I did not detect a response and your signup has timed out. Whenever you are ready, please do `!naltp` again.').catch(console.error);
    });
    if (count < 7) {
        return captainData;
    }
    let affiliationComment = await message.author.send("**Please describe your willingness to captain in an affiliated league vs. unaffiliated league as well as your willingness to captain in an All-Dallas league. **\n*We don't need an essay, just a sentence or two is fine.*").catch(console.error);
    if (captainData.q8 !== "") {
        await message.author.send("Previous response: " + captainData.q8).catch(console.error);
    }
    await expComment.channel.awaitMessages(response => response.author.id === message.author.id, {
        max: 1,
        time: 300000,
        errors: ['time'],
    })
        .then(async function(collected) {
            captainData.q8 = collected.first().cleanContent;
            await message.author.send("Great! That's it!").catch(console.error);
            count++;
    })
        .catch(async function() {
            await message.author.send('Sorry, I did not detect a response and your signup has timed out. Whenever you are ready, please do `!naltp` again.').catch(console.error);
    });
    if (count < 8) {
        return captainData;
    }
    captainData.formConfirm = true;
    return captainData;
}

function sendCaptainData(captainData) {
    /*
    let formSubmitURL = `google_form_connected_with_data_link`;
    axios({
        method: "post",
        url: formSubmitURL
    });*/
}