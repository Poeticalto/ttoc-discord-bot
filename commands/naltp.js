/**
* Add or edit user information into NALTP users database
* @async
*/

const Discord = require('discord.js');
const axios = require('axios');

exports.run = async (client, message, args, level) => { // eslint-disable-line no-unused-vars
    //return await message.author.send("Signups are temporarily closed for database maintenance, so check back after 6 PM EST and it should be back up by then. If you have an important message to change, contact Poeticalto.").catch(console.error);
    //return await message.author.send("Signups have closed for NALTP S20/17. If you need something changed or want to remove your signup, send a message to Poeticalto.").catch(console.error);
    let user = client.usersDB.getUserByDiscord.get(message.author.id);
    if (!user || (user && user.vstatus && user.vstatus < 2)) {
        return await message.author.send("Sorry, you need to have your tagpro profile verified in order to sign up for NALTP. Please type `!verify ID` here to begin, where ID is replaced by your TagPro ID.").catch(console.error);
    }
    if (message.channel.type !== "dm") {
        await message.delete().catch(console.error);
    }
    let playerData = client.naltpDB.getUserByDiscord.get(message.author.id);
    if (!playerData || playerData.isregistered == 0 || playerData.isregistered == -1 || playerData.isregistered == -2) {
        if (playerData && playerData.isregistered >= -2 && playerData.islocked > 0) {
            return await message.author.send("You already have an instance of the `!naltp` command running. To avoid overwriting critical data, please complete your current instance first or let it time out before typing `!naltp` again.\n\nIf you messed up somewhere, please finish the application first and then I can help you edit any particular section you need after you are finished.").catch(console.error);
        }
        //return await message.author.send("Sorry, new signups for NALTP S21/S18 are now closed.").catch(console.error);
        if (!playerData) {
            playerData = {
                discordid: message.author.id,
                tagproid: user.tagproid,
                tagproname: user.tagproname,
                oldname: "",
                mic: "",
                tpposition: "",
                playingfrom: "",
                homeserver: "",
                comfortservers: "",
                atlping: -1,
                chiping: -1,
                dalping: -1,
                laping: -1,
                miaping: -1,
                nycping: -1,
                sfping: -1,
                seaping: -1,
                torping: -1,
                availdays: "",
                availhours: "",
                availcomment: "",
                gencomment: "",
                isregistered: 0,
                islocked: 1,
                formConfirm: false
            }
        }
        else if (playerData.isregistered == -1) {
            playerData.tagproid = user.tagproid;
            playerData.tpposition = "";
            playerData.islocked = 1;
            client.naltpDB.setUser.run(playerData);
        }
        let confirmMessage = await message.author.send("Welcome to the NALTP S21/18 signups! Please try to do this in one sitting to avoid timing out the signup and forcing you to do it again.\n\n**First, please affirm that the information you are providing today is as truthful as possible and that you agree to abide by all rules of MLTP/NLTP.**\n\nIf you agree with this statement, please type `"+user.tagproname+"` below. (That's your registered TagPro name if you can't see it)").catch(console.error);
        await confirmMessage.channel.awaitMessages(response => response.content.toLowerCase() === user.tagproname.toLowerCase(), {
            max: 1,
            time: 300000,
            errors: ['time'],
        })
            .then(async function(collected) {
            await message.author.send("Great! Let's get started.");
            playerData.formConfirm = true;
        })
            .catch(async function() {
            await message.author.send('Sorry, I did not detect the correct response and your signup has timed out. Whenever you are ready, please do `!naltp` again.');
        });
        if (!playerData.formConfirm) {
            playerData.islocked = 0;
            client.naltpDB.setUser.run(playerData);
            return;
        }
        if (playerData.isregistered == -2) {
            if (playerData.tagproid == "226078") {
                playerData.tagproid = user.tagproid;
            }
            playerData.islocked = 1;
            client.naltpDB.setUser.run(playerData);
            playerData.formConfirm = false;
            playerData = await firstEditByQuestion(client, message, user, playerData);
        }
        else {
            playerData.formConfirm = false;
            playerData = await sectionOne(client, message, user, playerData);
            // write sectionOne data
            
            if (!playerData.formConfirm) {
                playerData.islocked = 0;
                client.naltpDB.setUser.run(playerData);
                return;
            }
            client.naltpDB.setUser.run(playerData);
            playerData.formConfirm = false;
            playerData = await sectionTwo(client, message, user, playerData);
            // write sectionTwo data
            if (!playerData.formConfirm) {
                playerData.islocked = 0;
                client.naltpDB.setUser.run(playerData);
                return;
            }
            client.naltpDB.setUser.run(playerData);
            playerData.formConfirm = false;
            playerData = await sectionThree(client, message, user, playerData);
        }
        // write sectionThree data
        playerData.islocked = 0;
        client.naltpDB.setUser.run(playerData);
        if (!playerData.formConfirm) {
            return;
        }
        sendForm(playerData);
        // submit form
        return await message.author.send("Your data has been successfully saved. Thanks for signing up for NALTP S21/18!\nRemember to subscribe to /r/MLTP and /r/NLTP on Reddit so you can keep up with the latest NALTP updates!\nHere's the NALTP 2020 calendar if you need it for further planning: <https://docs.google.com/spreadsheets/d/1_Fa8_OZWbDE1W1V-egtJ4EqzRu8yImPUbLu-OvUgMM4/edit#gid=345448984>\nIf you need to edit any part of your signup, including removing your signup if needed, just message me `!naltp` again.").catch(console.error);
    }
    if (playerData.isregistered > 2) {
        return await message.author.send("You've already been drafted! Check your messages for information about your team or message Poeticalto if you need help finding your team.").catch(console.error);
    }
    if (playerData.islocked > 0) {
        return await message.author.send("You already have an instance of the `!naltp` command running. To avoid overwriting critical data, please complete your current instance first or let it time out before typing `!naltp` again.\n\nIf you messed up somewhere, please finish the application first and then I can help you edit any particular section you need after you are finished.").catch(console.error);
    }
    playerData.formConfirm = false;
    playerData.islocked = 1;
    client.naltpDB.setUser.run(playerData);
    let optionsMenu = await message.author.send("**Welcome back to the NALTP S21/18 signups!** What would you like to do?\nReact 🇦 to redo Section 1: General Information\nReact 🇧 to redo Section 2: Ping\nReact 🇨 to redo Section 3: Availability\nReact 🇩 to edit a specific question in your responses\nReact 🇪 to " + (playerData.isregistered == 2 ? "remove" : "re-add") + " your signup\n" + "React 🇫 to sign up for captain\n\n*If I don't catch your response within a few seconds, wait for all of the reacts to show up and then unreact/react again or copy/paste your response again.*").catch(console.error);
    await optionsMenu.react("🇦").catch(console.error);
    await optionsMenu.react("🇧").catch(console.error);
    await optionsMenu.react("🇨").catch(console.error);
    await optionsMenu.react("🇩").catch(console.error);
    await optionsMenu.react("🇪").catch(console.error);
    await optionsMenu.react("🇫").catch(console.error);
    const optionsfilter = (reaction, user) => {
        return ['🇦', '🇧', '🇨', '🇩', '🇪', '🇫'].includes(reaction.emoji.name) && user.id === message.author.id;
    };
    await optionsMenu.awaitReactions(optionsfilter, { max: 1, time: 300000, errors: ['time'] })
        .then(async function(collected) {
        const reaction = collected.first();
        if (reaction.emoji.name === '🇦') {
            playerData = await sectionOne(client, message, user, playerData);
        }
        else if (reaction.emoji.name === '🇧') {
            playerData = await sectionTwo(client, message, user, playerData);
        }
        else if (reaction.emoji.name === '🇨') {
            playerData = await sectionThree(client, message, user, playerData);
        }
        else if (reaction.emoji.name === '🇩') {
            playerData = await secondEdit(client, message, user, playerData);
        }
        else if (reaction.emoji.name === '🇪') {
            if (playerData.isregistered == 2) {
                message.author.send("Your signup has been removed.");
                playerData.isregistered = 1;
                playerData.formConfirm = true;
            }
            else {
                message.author.send("Your signup has been re-added.");
                playerData.isregistered = 2;
                playerData.formConfirm = true;
            }
        }
        else if (reaction.emoji.name === '🇫') {
            let captainData = client.captainsDB.getUserByDiscord.get(message.author.id);
            if (!captainData || captainData.isRegistered == 0) {
                await message.author.send("Welcome to the NALTP captaincy app! Please try to do this in one sitting to avoid timing out the signup and forcing you to do it again.").catch(console.error);
                if (!captainData) {
                    captainData = {
                        discordid: message.author.id,
                        tagproid: playerData.tagproid,
                        tagproname: playerData.tagproname,
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
        }
        
        if (playerData.formConfirm && reaction.emoji.name !== '🇫') {
            sendForm(playerData);
            // submit data
        }
        playerData.formConfirm = false;
        playerData.islocked = 0;
        client.naltpDB.setUser.run(playerData);
        return await message.author.send("Data has been successfully updated. If you need to change anything else, just do `!naltp` again.").catch(console.error);
        
    })
        .catch(async (collected) => {
        playerData.islocked = 0;
        client.naltpDB.setUser.run(playerData);
        await message.author.send("Sorry, I did not detect a response and your signup has timed out. Whenever you are ready, please do `!naltp` again.").catch(console.error);
    });
};

exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: ["sniiipe"],
    permLevel: "User"
};

exports.help = {
    name: "naltp",
    category: "Competitive",
    description: "Sign up for NALTP S21/18!",
    usage: "naltp"
};

async function captainApp(client, message, user, captainData) {
    message.author.send("**If I don't catch your response within a few seconds, wait for all of the reacts to show up and then unreact/react again or copy/paste your response again.**");
    let count = 0;
    const donefilter = (reaction, user) => {
        return ['☑'].includes(reaction.emoji.name) && user.id === message.author.id;
    };
    let captainType = await message.author.send("What tier of captaincy are you applying for?\nReact 🇦 for Majors Playing Captain\nReact 🇧 for Minors Playing Captain\nReact 🇨 for MLTP Non Playing Captain\nReact 🇩 for NLTP Direct Playing Captain\nReact 🇪 for NLTP Indirect Playing Captain\nReact 🇫 for NLTP B-Team Playing Captain\nReact 🇬 for NLTP Non Playing Captain\n*Please react with ☑ when you have selected all of your options.*").catch(console.error);
    if (captainData.q1 !== "") {
        message.author.send("Previous response: " + captainData.q1);
    }
    await captainType.react('🇦').catch(console.error);
    await captainType.react('🇧').catch(console.error);
    await captainType.react('🇨').catch(console.error);
    await captainType.react('🇩').catch(console.error);
    await captainType.react('🇪').catch(console.error);
    await captainType.react('🇫').catch(console.error);
    await captainType.react('🇬').catch(console.error);
    await captainType.react('☑').catch(console.error);
    await captainType.awaitReactions(donefilter, { max: 1, time: 300000, errors: ['time'] })
        .then(async (collected) => {
        let typeArr = [];
        let typeString = "";
        let reactCollection = collected.first().message.reactions;
        if (reactCollection.get("🇦").users.get(message.author.id)) {
            typeArr.push("MC");
        }
        if (reactCollection.get("🇧").users.get(message.author.id)) {
            typeArr.push("MPC");
        }
        if (reactCollection.get("🇨").users.get(message.author.id)) {
            typeArr.push("MNC");
        }
        if (reactCollection.get("🇩").users.get(message.author.id)) {
            typeArr.push("DPC");
        }
        if (reactCollection.get("🇪").users.get(message.author.id)) {
            typeArr.push("IPC");
        }
        if (reactCollection.get("🇫").users.get(message.author.id)) {
            typeArr.push("BPC");
        }
        if (reactCollection.get("🇬").users.get(message.author.id)) {
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
        message.author.send("Previous response: " + captainData.q2);
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
        .catch(async(collected) => {
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
        awaitmessage.author.send("Previous response: " + captainData.q5).catch(console.error);
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
        message.author.send("Previous response: " + captainData.q6);
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
    let generalComment = await message.author.send("**Do you have any general comments for the CRC?**").catch(console.error);
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

async function firstEditByQuestion(client, message, user, playerData) {
    let editComplete = true;
    while (editComplete) {
        let concatData = `Here is your previous response data:
        **1** *Old Name*: ${playerData.oldname}
        **2** *Mic*: ${playerData.mic}
        **3** *Position*: ${playerData.tpposition}
        **4** *Location*: ${playerData.playingfrom}
        **5** *Home Server*: ${playerData.homeserver}
        **6** *Comfort Servers*: ${playerData.comfortservers}
        **7** *Atlanta Ping*: ${playerData.atlping}
        **8** *Chicago Ping*: ${playerData.chiping}
        **9** *Dallas Ping*: ${playerData.dalping}
        **10** *LA Ping*: ${playerData.laping}
        **11** *Miami Ping*: ${playerData.miaping}
        **12** *New York Ping*: ${playerData.nycping}
        **13** *SF Ping*: ${playerData.sfping}
        **14** *Seattle Ping*: ${playerData.seaping}
        **15** *Toronto Ping*: ${playerData.torping}`;
        await message.author.send(concatData).catch(console.error);
        const numCheck = function (response) {
            return (isNaN(response.cleanContent) === false && response.cleanContent >= 0 && response.cleanContent <= 15);
        }
        let firstEditMessage = await message.author.send("Please type **only** the number corresponding to the data you would like to edit, or type `0` to confirm your data and move on to the availability section:").catch(console.error);
        await firstEditMessage.channel.awaitMessages(numCheck, {
            max: 1,
            time: 300000,
            errors: ['time'],
        })
            .then(async function(collected) {
            switch (Math.floor(collected.first().cleanContent)) {
                case 0:
                    editComplete = false;
                    break;
                case 1:
                    playerData = await oldName(client, message, user, playerData);
                    break;
                case 2:
                    playerData = await playerMic(client, message, user, playerData);
                    break;
                case 3:
                    playerData = await positionQuestion(client, message, user, playerData);
                    break;
                case 4:
                    playerData = await censusQuestion(client, message, user, playerData);
                    break;
                case 5:
                    playerData = await homeServerQuestion(client, message, user, playerData);
                    break;
                case 6:
                    playerData = await comfortServerQuestion(client, message, user, playerData);
                    break;
                case 7:
                    playerData = await atlPingQ(client, message, user, playerData);
                    break;
                case 8:
                    playerData = await chiPingQ(client, message, user, playerData);
                    break;
                case 9:
                    playerData = await dalPingQ(client, message, user, playerData);
                    break;
                case 10:
                    playerData = await laPingQ(client, message, user, playerData);
                    break;
                case 11:
                    playerData = await miaPingQ(client, message, user, playerData);
                    break;
                case 12:
                    playerData = await nycPingQ(client, message, user, playerData);
                    break;
                case 13:
                    playerData = await sfPingQ(client, message, user, playerData);
                    break;
                case 14:
                    playerData = await seaPingQ(client, message, user, playerData);
                    break;
                case 15:
                    playerData = await torPingQ(client, message, user, playerData);
                    break;
                default:
                    await message.author.send("Uh oh, I don't quite understand what you typed, let's try this again.").catch(console.error);
            }
            if (playerData.nextQuestion === false) {
                editComplete = false;
            }
        })
            .catch(async function() {
                await message.author.send("Sorry, I did not detect a response and your signup has timed out. Whenever you are ready, please do `!naltp` again.").catch(console.error);
                editComplete = false;
                playerData.nextQuestion = false;
        });
        
    }
    if (playerData.nextQuestion === false) {
        return playerData;
    }
    playerData = await sectionThree(client, message, user, playerData);
    return playerData;
}

async function secondEdit(client, message, user, playerData) {
    let editComplete = true;
    while (editComplete) {
        let concatData = `Here is your previous response data:
        **1** *Old Name*: ${playerData.oldname}
        **2** *Mic*: ${playerData.mic}
        **3** *Position*: ${playerData.tpposition}
        **4** *Location*: ${playerData.playingfrom}
        **5** *Home Server*: ${playerData.homeserver}
        **6** *Comfort Servers*: ${playerData.comfortservers}
        **7** *Atlanta Ping*: ${playerData.atlping}
        **8** *Chicago Ping*: ${playerData.chiping}
        **9** *Dallas Ping*: ${playerData.dalping}
        **10** *LA Ping*: ${playerData.laping}
        **11** *Miami Ping*: ${playerData.miaping}
        **12** *New York Ping*: ${playerData.nycping}
        **13** *SF Ping*: ${playerData.sfping}
        **14** *Seattle Ping*: ${playerData.seaping}
        **15** *Toronto Ping*: ${playerData.torping}`;
        let concat2Data = `Availability:
        **16** *Days*: ${playerData.availdays}
        **17** *Hours*: ${playerData.availhours}
        **18** *Gen Avail*: ${playerData.availcomment}
        **19** *Gen Comment*: ${playerData.gencomment}`;
        await message.author.send(concatData).catch(console.error);
        await message.author.send(concat2Data).catch(console.error);
        const numCheck = function (response) {
            return (isNaN(response.cleanContent) === false && response.cleanContent >= 0 && response.cleanContent <= 19);
        }
        let firstEditMessage = await message.author.send("Please type **only** the number corresponding to the data you would like to edit, or type `0` to confirm your data:").catch(console.error);
        await firstEditMessage.channel.awaitMessages(numCheck, {
            max: 1,
            time: 300000,
            errors: ['time'],
        })
            .then(async function(collected) {
            switch (Math.floor(collected.first().cleanContent)) {
                case 0:
                    editComplete = false;
                    break;
                case 1:
                    playerData = await oldName(client, message, user, playerData);
                    break;
                case 2:
                    playerData = await playerMic(client, message, user, playerData);
                    break;
                case 3:
                    playerData = await positionQuestion(client, message, user, playerData);
                    break;
                case 4:
                    playerData = await censusQuestion(client, message, user, playerData);
                    break;
                case 5:
                    playerData = await homeServerQuestion(client, message, user, playerData);
                    break;
                case 6:
                    playerData = await comfortServerQuestion(client, message, user, playerData);
                    break;
                case 7:
                    playerData = await atlPingQ(client, message, user, playerData);
                    break;
                case 8:
                    playerData = await chiPingQ(client, message, user, playerData);
                    break;
                case 9:
                    playerData = await dalPingQ(client, message, user, playerData);
                    break;
                case 10:
                    playerData = await laPingQ(client, message, user, playerData);
                    break;
                case 11:
                    playerData = await miaPingQ(client, message, user, playerData);
                    break;
                case 12:
                    playerData = await nycPingQ(client, message, user, playerData);
                    break;
                case 13:
                    playerData = await sfPingQ(client, message, user, playerData);
                    break;
                case 14:
                    playerData = await seaPingQ(client, message, user, playerData);
                    break;
                case 15:
                    playerData = await torPingQ(client, message, user, playerData);
                    break;
                case 16:
                    playerData = await availDaysQ(client, message, user, playerData);
                    break;
                case 17:
                    playerData = await availHoursQ(client, message, user, playerData);
                    break;
                case 18:
                    playerData = await availCommentQ(client, message, user, playerData);
                    break;
                case 19:
                    playerData = await genCommentQ(client, message, user, playerData);
                    break;
                default:
                    await message.author.send("Uh oh, I don't quite understand what you typed, let's try this again.").catch(console.error);
            }
            if (playerData.nextQuestion === false) {
                editComplete = false;
            }
        })
            .catch(async function() {
                await message.author.send("Sorry, I did not detect a response and your signup has timed out. Whenever you are ready, please do `!naltp` again.").catch(console.error);
                editComplete = false;
                playerData.nextQuestion = false;
        });
        
    }
    if (playerData.nextQuestion === false) {
        return playerData;
    }
    playerData.formConfirm = true;
    playerData.isregistered = 2;
    return playerData;
}

async function sectionOne(client, message, user, playerData) {
    await message.author.send("**SECTION 1: General Info**\n\n**If I don't catch your response within a few seconds, wait for all of the reacts to show up and then unreact/react again or copy/paste your response again.**").catch(console.error);
    playerData = await nameConfirm(client, message, user, playerData);
    if (playerData.nextQuestion === false) {
        return playerData;
    }
    playerData = await oldName(client, message, user, playerData);
    if (playerData.nextQuestion === false) {
        return playerData;
    }
    playerData = await playerMic(client, message, user, playerData);
    if (playerData.nextQuestion === false) {
        return playerData;
    }
    playerData = await positionQuestion(client, message, user, playerData);
    if (playerData.nextQuestion === false) {
        return playerData;
    }
    playerData = await censusQuestion(client, message, user, playerData);
    if (playerData.nextQuestion === false) {
        return playerData;
    }
    playerData.formConfirm = true;
    return playerData;
}

async function sectionTwo(client, message, user, playerData) {
    await message.author.send("**Section 2: Ping**\n\n**If I don't catch your response within a few seconds, wait for all of the reacts to show up and then unreact/react again or copy/paste your response again.**").catch(console.error);
    playerData = await homeServerQuestion(client, message, user, playerData);
    if (playerData.nextQuestion === false) {
        return playerData;
    }
    playerData = await comfortServerQuestion(client, message, user, playerData);
    if (playerData.nextQuestion === false) {
        return playerData;
    }
    playerData = await atlPingQ(client, message, user, playerData);
    if (playerData.nextQuestion === false) {
        return playerData;
    }
    playerData = await chiPingQ(client, message, user, playerData);
    if (playerData.nextQuestion === false) {
        return playerData;
    }
    playerData = await dalPingQ(client, message, user, playerData);
    if (playerData.nextQuestion === false) {
        return playerData;
    }
    playerData = await laPingQ(client, message, user, playerData);
    if (playerData.nextQuestion === false) {
        return playerData;
    }
    playerData = await miaPingQ(client, message, user, playerData);
    if (playerData.nextQuestion === false) {
        return playerData;
    }
    playerData = await nycPingQ(client, message, user, playerData);
    if (playerData.nextQuestion === false) {
        return playerData;
    }
    playerData = await sfPingQ(client, message, user, playerData);
    if (playerData.nextQuestion === false) {
        return playerData;
    }
    playerData = await seaPingQ(client, message, user, playerData);
    if (playerData.nextQuestion === false) {
        return playerData;
    }
    playerData = await torPingQ(client, message, user, playerData);
    if (playerData.nextQuestion === false) {
        return playerData;
    }
    playerData.formConfirm = true;
    return playerData;
}

async function sectionThree(client, message, user, playerData) {
    await message.author.send("**Section 3: Availability**\n\nNote: You may be restricted from playing on certain game days if you note them as unavailable.\n\n**If I don't catch your response within a few seconds, wait for all of the reacts to show up and then unreact/react again or copy/paste your response again.**").catch(console.error);
    
    playerData = await availDaysQ(client, message, user, playerData);
    if (playerData.nextQuestion === false) {
        return playerData;
    }
    playerData = await availHoursQ(client, message, user, playerData);
    if (playerData.nextQuestion === false) {
        return playerData;
    }
    playerData = await availCommentQ(client, message, user, playerData);
    if (playerData.nextQuestion === false) {
        return playerData;
    }
    playerData = await genCommentQ(client, message, user, playerData);
    if (playerData.nextQuestion === false) {
        return playerData;
    }
    playerData.formConfirm = true;
    playerData.isregistered = 2;
    return playerData;
}

async function nameConfirm(client, message, user, playerData) {
    let nameConfirm = await message.author.send("First, let's confirm your name. **Will you be playing as "+user.tagproname+" this season?**\nReact 🇾 for yes.\nReact 🇳 for no.").catch(console.error);
    await nameConfirm.react("🇾").catch(console.error);
    await nameConfirm.react("🇳").catch(console.error);
    const ynfilter = (reaction, user) => {
        return ['🇾', '🇳'].includes(reaction.emoji.name) && user.id === message.author.id;
    };
    await nameConfirm.awaitReactions(ynfilter, { max: 1, time: 300000, errors: ['time'] })
        .then(async (collected) => {
        const reaction = collected.first();
        if (reaction.emoji.name === '🇾') {
            playerData.tagproname = user.tagproname;
            await message.author.send("Great! Next question:").catch(console.error);
            playerData.nextQuestion = true;
        }
        else {
            await message.author.send("NALTP rules require that you play under your registered name during league matches. Unfortunately, this means you will have to verify your new profile with me using the `!verify` command or you can play under the profile currently registered. Please use `!naltp` whenever you are ready.").catch(console.error);
            playerData.nextQuestion = false;
        }
    })
        .catch(async (collected) => {
            await message.author.send("Sorry, I did not detect a response and your signup has timed out. Whenever you are ready, please do `!naltp` again.").catch(console.error);
            playerData.nextQuestion = false;
    });
    return playerData;
}

async function oldName(client, message, user, playerData) {
    let oldNameMessage = await message.author.send("**What name did you use during your last competitive season?** If you used " + user.tagproname + " last season, just respond with `" + user.tagproname + "` again.").catch(console.error);
    if (playerData.oldname !== "") {
        await message.author.send("Previous response: " + playerData.oldname).catch(console.error);
    }
    await oldNameMessage.channel.awaitMessages(response => (response.author.id === message.author.id && response.content), {
        max: 1,
        time: 300000,
        errors: ['time'],
    })
        .then(async function(collected) {
            playerData.oldname = collected.first().cleanContent;
            await message.author.send("Great! Next question:").catch(console.error);
            playerData.nextQuestion = true;
    })
        .catch(async function() {
            await message.author.send('Sorry, I did not detect a response and your signup has timed out. Whenever you are ready, please do `!naltp` again.').catch(console.error);
            playerData.nextQuestion = false;
    });
    return playerData;
}

async function playerMic(client, message, user, playerData) {
    let micQuestion = await message.author.send("**Will you be using a mic this season?**\nReact 🇾 for yes.\nReact 🇳 for no.").catch(console.error);
    await micQuestion.react("🇾").catch(console.error);
    await micQuestion.react("🇳").catch(console.error);
    if (playerData.mic !== "") {
        await message.author.send("Previous response: " + playerData.mic).catch(console.error);
    }
    const ynfilter = (reaction, user) => {
        return ['🇾', '🇳'].includes(reaction.emoji.name) && user.id === message.author.id;
    };
    await micQuestion.awaitReactions(ynfilter, { max: 1, time: 300000, errors: ['time'] })
        .then(async (collected) => {
        const reaction = collected.first();

        if (reaction.emoji.name === '🇾') {
            playerData.mic = "Y";
            await message.author.send("Great! Next question:").catch(console.error);
            playerData.nextQuestion = true;
        }
        else {
            playerData.mic = "N";
            await message.author.send("Great! Next question:").catch(console.error);
            playerData.nextQuestion = true;
        }
    })
        .catch(async (collected) => {
            await message.author.send("Sorry, I did not detect a response and your signup has timed out. Whenever you are ready, please do `!naltp` again.").catch(console.error);
            playerData.nextQuestion = false;
    });
    return playerData;
}

async function positionQuestion(client, message, user, playerData) {
    let tppositionMessage = await message.author.send("**What position will you be playing this season?**\nReact 🇦 if you will be playing offense only.\nReact 🇧 if you are open to either position.\nReact 🇨 if you will be playing defense only.\nNote that you *may* be restricted if you select either offense only or defense only.").catch(console.error);
    if (playerData.tpposition !== "") {
        await message.author.send("Previous response: " + playerData.tpposition).catch(console.error);
    }
    await tppositionMessage.react("🇦").catch(console.error);
    await tppositionMessage.react("🇧").catch(console.error);
    await tppositionMessage.react("🇨").catch(console.error);
    const positionfilter = (reaction, user) => {
        return ['🇦', '🇧', '🇨'].includes(reaction.emoji.name) && user.id === message.author.id;
    };
    await tppositionMessage.awaitReactions(positionfilter, { max: 1, time: 300000, errors: ['time'] })
        .then(async (collected) => {
        const reaction = collected.first();
        if (reaction.emoji.name === '🇦') {
            playerData.tpposition = "Offense Only";
        }
        else if (reaction.emoji.name === '🇧') {
            playerData.tpposition = "Both Positions";
        }
        else {
            playerData.tpposition = "Defense Only";
        }
        await message.author.send("Great! Next question:").catch(console.error);
        playerData.nextQuestion = true;
    })
        .catch(async (collected) => {
            await message.author.send("Sorry, I did not detect a response and your signup has timed out. Whenever you are ready, please do `!naltp` again.").catch(console.error);
            playerData.nextQuestion = false;
    });
    return playerData;
}

async function censusQuestion(client, message, user, playerData) {
    let nameArr = ["Alabama","Alaska","American Samoa","Arizona","Arkansas","California","Colorado","Connecticut","Delaware","District of Columbia","Florida","Georgia","Guam","Hawaii","Idaho","Illinois","Indiana","Iowa","Kansas","Kentucky","Louisiana","Maine","Maryland","Massachusetts","Michigan","Minnesota","Mississippi","Missouri","Montana","Nebraska","Nevada","New Hampshire","New Jersey","New Mexico","New York","North Carolina","North Dakota","Northern Mariana Islands","Ohio","Oklahoma","Oregon","Pennsylvania","Puerto Rico","Rhode Island","South Carolina","South Dakota","Tennessee","Texas","United States Minor Outlying Islands","United States Virgin Islands","Utah","Vermont","Virginia","Washington","West Virginia","Wisconsin","Wyoming","Alberta","British Columbia","Manitoba","New Brunswick","Newfoundland","Nova Scotia","Ontario","Prince Edward Island","Quebec","Saskatchewan","Afghanistan","Aland Islands","Albania","Algeria","American Samoa","Andorra","Angola","Anguilla","Antarctica","Antigua And Barbuda","Argentina","Armenia","Aruba","Australia","Austria","Azerbaijan","Bahamas","Bahrain","Bangladesh","Barbados","Belarus","Belgium","Belize","Benin","Bermuda","Bhutan","Bolivia","Bosnia and Herzegovina","Botswana","Bouvet Island","Brazil","British Indian Ocean Territory","Brunei","Bulgaria","Burkina Faso","Burundi","Cambodia","Cameroon","Canada","Cape Verde","Cayman Islands","Central African Republic","Chad","Chile","China","Christmas Island","Cocos Islands","Colombia","Comoros","Congo","The Democratic Republic Of The Congo","Cook Islands","Costa Rica","Ivory Coast","Croatia","Cuba","Cyprus","Czech Republic","Denmark","Djibouti","Dominica","Dominican Republic","East Timor","Ecuador","Egypt","El Salvador","Equatorial Guinea","Eritrea","Estonia","Ethiopia","Falkland Islands","Faroe Islands","Fiji Islands","Finland","France","French Guiana","French Polynesia","French Southern Territories","Gabon","Gambia","Georgia","Germany","Ghana","Gibraltar","Greece","Greenland","Grenada","Guadeloupe","Guam","Guatemala","Guernsey and Alderney","Guinea","Guinea-Bissau","Guyana","Haiti","Heard and McDonald Islands","Honduras","Hong Kong S.A.R.","Hungary","Iceland","India","Indonesia","Iran","Iraq","Ireland","Israel","Italy","Jamaica","Japan","Jersey","Jordan","Kazakhstan","Kenya","Kiribati","Korea North\n","Korea South","Kuwait","Kyrgyzstan","Laos","Latvia","Lebanon","Lesotho","Liberia","Libya","Liechtenstein","Lithuania","Luxembourg","Macau S.A.R.","Macedonia","Madagascar","Malawi","Malaysia","Maldives","Mali","Malta","Isle of Man","Marshall Islands","Martinique","Mauritania","Mauritius","Mayotte","Mexico","Micronesia","Moldova","Monaco","Mongolia","Montenegro","Montserrat","Morocco","Mozambique","Myanmar","Namibia","Nauru","Nepal","Netherlands Antilles","Netherlands","New Caledonia","New Zealand","Nicaragua","Niger","Nigeria","Niue","Norfolk Island","Northern Mariana Islands","Norway","Oman","Pakistan","Palau","Palestinian Territory Occupied","Panama","Papua new Guinea","Paraguay","Peru","Philippines","Pitcairn Island","Poland","Portugal","Puerto Rico","Qatar","Reunion","Romania","Russia","Rwanda","Saint Helena","Saint Kitts And Nevis","Saint Lucia","Saint Pierre and Miquelon","Saint Vincent And The Grenadines","Saint-Barthelemy","Saint-Martin","Samoa","San Marino","Sao Tome and Principe","Saudi Arabia","Senegal","Serbia","Seychelles","Sierra Leone","Singapore","Slovakia","Slovenia","Solomon Islands","Somalia","South Africa","South Georgia","South Sudan","Spain","Sri Lanka","Sudan","Suriname","Svalbard And Jan Mayen Islands","Swaziland","Sweden","Switzerland","Syria","Taiwan","Tajikistan","Tanzania","Thailand","Togo","Tokelau","Tonga","Trinidad And Tobago","Tunisia","Turkey","Turkmenistan","Turks And Caicos Islands","Tuvalu","Uganda","Ukraine","United Arab Emirates","United Kingdom","United States","United States Minor Outlying Islands","Uruguay","Uzbekistan","Vanuatu","Vatican City","Venezuela","Vietnam","British Virgin Islands","US Virgin Islands","Wallis And Futuna Islands","Western Sahara","Yemen","Zambia","Zimbabwe"];
    let codeArr = ["AL","AK","AS","AZ","AR","CA","CO","CT","DE","DC","FL","GA","GU","HI","ID","IL","IN","IA","KS","KY","LA","ME","MD","MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ","NM","NY","NC","ND","MP","OH","OK","OR","PA","PR","RI","SC","SD","TN","TX","UM","VI","UT","VT","VA","WA","WV","WI","WY","AB","BC","MB","NB","NL","NS","ON","PE","QC","SK","AFG","ALA","ALB","DZA","ASM","AND","AGO","AIA","ATA","ATG","ARG","ARM","ABW","AUS","AUT","AZE","BHS","BHR","BGD","BRB","BLR","BEL","BLZ","BEN","BMU","BTN","BOL","BIH","BWA","BVT","BRA","IOT","BRN","BGR","BFA","BDI","KHM","CMR","CAN","CPV","CYM","CAF","TCD","CHL","CHN","CXR","CCK","COL","COM","COG","COD","COK","CRI","CIV","HRV","CUB","CYP","CZE","DNK","DJI","DMA","DOM","TLS","ECU","EGY","SLV","GNQ","ERI","EST","ETH","FLK","FRO","FJI","FIN","FRA","GUF","PYF","ATF","GAB","GMB","GEO","DEU","GHA","GIB","GRC","GRL","GRD","GLP","GUM","GTM","GGY","GIN","GNB","GUY","HTI","HMD","HND","HKG","HUN","ISL","IND","IDN","IRN","IRQ","IRL","ISR","ITA","JAM","JPN","JEY","JOR","KAZ","KEN","KIR","PRK","KOR","KWT","KGZ","LAO","LVA","LBN","LSO","LBR","LBY","LIE","LTU","LUX","MAC","MKD","MDG","MWI","MYS","MDV","MLI","MLT","IMN","MHL","MTQ","MRT","MUS","MYT","MEX","FSM","MDA","MCO","MNG","MNE","MSR","MAR","MOZ","MMR","NAM","NRU","NPL","ANT","NLD","NCL","NZL","NIC","NER","NGA","NIU","NFK","MNP","NOR","OMN","PAK","PLW","PSE","PAN","PNG","PRY","PER","PHL","PCN","POL","PRT","PRI","QAT","REU","ROU","RUS","RWA","SHN","KNA","LCA","SPM","VCT","BLM","MAF","WSM","SMR","STP","SAU","SEN","SRB","SYC","SLE","SGP","SVK","SVN","SLB","SOM","ZAF","SGS","SSD","ESP","LKA","SDN","SUR","SJM","SWZ","SWE","CHE","SYR","TWN","TJK","TZA","THA","TGO","TKL","TON","TTO","TUN","TUR","TKM","TCA","TUV","UGA","UKR","ARE","GBR","USA","UMI","URY","UZB","VUT","VAT","VEN","VNM","VGB","VIR","WLF","ESH","YEM","ZMB","ZWE"];
    const locationCheck = function (response) {
        return (nameArr.findIndex(item=> response.cleanContent.toLowerCase() === item.toLowerCase())>-1 ? true:false) || (codeArr.findIndex(item=> response.cleanContent.toLowerCase() === item.toLowerCase())>-1? true:false);
    }
    let censusQuestion = await message.author.send("**Where will you be playing from?** I will accept one of the following (Case-insensitive):\nFull name for US State, CA Province, or Country\nTwo Letter Code for US State/Province\nThree letter code (iso3) for Country").catch(console.error);
    if (playerData.playingfrom !== "") {
        await message.author.send("Previous response: " + playerData.playingfrom).catch(console.error);
    }
    await censusQuestion.channel.awaitMessages(locationCheck, {
        max: 1,
        time: 300000,
        errors: ['time'],
    })
        .then(async function(collected) {
            let finalCheck = nameArr.findIndex(item=> collected.first().cleanContent.toLowerCase() === item.toLowerCase());
            if (finalCheck == -1) {
                finalCheck = codeArr.findIndex(item=> collected.first().cleanContent.toLowerCase() === item.toLowerCase());
            }
            playerData.playingfrom = nameArr[finalCheck];
            await message.author.send("Great! That's the end of section 1!").catch(console.error);
            playerData.nextQuestion = true;
    })
        .catch(async function() {
            await message.author.send("Sorry, I did not detect a response and your signup has timed out. Whenever you are ready, please do `!naltp` again.").catch(console.error); 
            playerData.nextQuestion = false;
    });
    return playerData;
}

async function homeServerQuestion(client, message, user, playerData) {
    let homeServer = await message.author.send("**What is your home server?**\nReact 🇦 for Atlanta\nReact 🇨 for Chicago\nReact 🇩 for Dallas\nReact 🇫 for San Francisco\nReact 🇱 for Los Angeles\nReact 🇲 for Miami\nReact 🇳 for New York\nReact 🇸 for Seattle\nReact 🇹 for Toronto").catch(console.error);
    await homeServer.react("🇦").catch(console.error);
    await homeServer.react("🇨").catch(console.error);
    await homeServer.react("🇩").catch(console.error);
    await homeServer.react("🇫").catch(console.error);
    await homeServer.react("🇱").catch(console.error);
    await homeServer.react("🇲").catch(console.error);
    await homeServer.react("🇳").catch(console.error);
    await homeServer.react("🇸").catch(console.error);
    await homeServer.react("🇹").catch(console.error);
    if (playerData.homeserver !== "") {
        await message.author.send("Previous response: " + playerData.homeserver).catch(console.error);
    }
    const serverfilter = (reaction, user) => {
        return ['🇦', '🇨', '🇩', '🇫', '🇱', '🇲', '🇳', '🇸', '🇹'].includes(reaction.emoji.name) && user.id === message.author.id;
    };
    await homeServer.awaitReactions(serverfilter, { max: 1, time: 300000, errors: ['time'] })
        .then(async (collected) => {
        const reaction = collected.first();
        if (reaction.emoji.name === '🇦') {
            playerData.homeserver = "Atlanta";    
        }
        else if (reaction.emoji.name === '🇨') {
            playerData.homeserver = "Chicago";    
        }
        else if (reaction.emoji.name === '🇩') {
            playerData.homeserver = "Dallas";    
        }
        else if (reaction.emoji.name === '🇫') {
            playerData.homeserver = "San Francisco";    
        }
        else if (reaction.emoji.name === '🇱') {
            playerData.homeserver = "Los Angeles";    
        }
        else if (reaction.emoji.name === '🇲') {
            playerData.homeserver = "Miami";    
        }
        else if (reaction.emoji.name === '🇳') {
            playerData.homeserver = "New York";    
        }
        else if (reaction.emoji.name === '🇸') {
            playerData.homeserver = "Seattle";    
        }
        else if (reaction.emoji.name === '🇹') {
            playerData.homeserver = "Toronto";    
        }
        else {
            playerData.homeserver = "Dallas";    
        }
        await message.author.send("Great! Next question:").catch(console.error);
        playerData.nextQuestion = true;
    })
        .catch(async(collected) => {
            await message.author.send("Sorry, I did not detect a response and your signup has timed out. Whenever you are ready, please do `!naltp` again.").catch(console.error);
            playerData.nextQuestion = false;
    });
    return playerData;
}

async function comfortServerQuestion(client, message, user, playerData) {
    let comfortServers = await message.author.send("**What servers are you comfortable playing on?**\n*Please react with ☑️ when you have selected all of your severs.*").catch(console.error);
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
    const donefilter = (reaction, user) => {
        return ['☑'].includes(reaction.emoji.name) && user.id === message.author.id;
    };
    if (playerData.comfortservers !== "") {
        await message.author.send("Previous response: " + playerData.comfortservers).catch(console.error);
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
            serverString = playerData.homeserver;
        }
        else {
            for (let i = 0; i < (serverArr.length - 1); i++) {
                serverString += serverArr[i] + ", ";
            }
            serverString += serverArr[serverArr.length - 1];
        }
        playerData.comfortservers = serverString;
        await message.author.send("Great! Next question:").catch(console.error);
        playerData.nextQuestion = true;
    })
        .catch(async (collected) => {
        await message.author.send("Sorry, I did not detect a response and your signup has timed out. Whenever you are ready, please do `!naltp` again.").catch(console.error);
        playerData.nextQuestion = false;
    });
    return playerData;
}

async function atlPingQ(client, message, user, playerData) {
    const numCheck = function (response) {
        return (isNaN(response.cleanContent) === false && response.cleanContent > 0 && response.cleanContent <= 300);
    }
    let atlPingMessage = await message.author.send("**What is your ping to Atlanta?**\n*I will only accept a number between 0 and 300. Do not type anything except the number.*").catch(console.error);
    if (playerData.atlping !== -1) {
        await message.author.send("Previous response: " + playerData.atlping).catch(console.error);
    }
    await atlPingMessage.channel.awaitMessages(numCheck, {
        max: 1,
        time: 300000,
        errors: ['time'],
    })
        .then(async function(collected) {
            playerData.atlping = Math.floor(collected.first().cleanContent);
            await message.author.send("Great! Next question:").catch(console.error);
            playerData.nextQuestion = true;
    })
        .catch(async function() {
            await message.author.send("Sorry, I did not detect a response and your signup has timed out. Whenever you are ready, please do `!naltp` again.").catch(console.error);
            playerData.nextQuestion = false;
    });
    return playerData;
}

async function chiPingQ(client, message, user, playerData) {
    const numCheck = function (response) {
        return (isNaN(response.cleanContent) === false && response.cleanContent > 0 && response.cleanContent <= 300);
    }
    let chiPingMessage = await message.author.send("**What is your ping to Chicago?**\n*I will only accept a number between 0 and 300. Do not type anything except the number.*").catch(console.error);
    if (playerData.chiping !== -1) {
        await message.author.send("Previous response: " + playerData.chiping).catch(console.error);
    }
    await chiPingMessage.channel.awaitMessages(numCheck, {
        max: 1,
        time: 300000,
        errors: ['time'],
    })
        .then(async function(collected) {
            playerData.chiping = Math.floor(collected.first().cleanContent);
            await message.author.send("Great! Next question:").catch(console.error);
            playerData.nextQuestion = true;
    })
        .catch(async function() {
            await message.author.send("Sorry, I did not detect a response and your signup has timed out. Whenever you are ready, please do `!naltp` again.").catch(console.error); 
            playerData.nextQuestion = false;
    });
    return playerData;
}

async function dalPingQ(client, message, user, playerData) {
    const numCheck = function (response) {
        return (isNaN(response.cleanContent) === false && response.cleanContent > 0 && response.cleanContent <= 300);
    }    
    let dalPingMessage = await message.author.send("**What is your ping to Dallas?**\n*I will only accept a number between 0 and 300. Do not type anything except the number.*").catch(console.error);
    if (playerData.dalping !== -1) {
        await message.author.send("Previous response: " + playerData.dalping).catch(console.error);
    }
    await dalPingMessage.channel.awaitMessages(numCheck, {
        max: 1,
        time: 300000,
        errors: ['time'],
    })
        .then(async function(collected) {
            playerData.dalping = Math.floor(collected.first().cleanContent);
            await message.author.send("Great! Next question:").catch(console.error);
            playerData.nextQuestion = true;
    })
        .catch(async function() {
            await message.author.send("Sorry, I did not detect a response and your signup has timed out. Whenever you are ready, please do `!naltp` again.").catch(console.error); 
            playerData.nextQuestion = false;
    });
    return playerData;
}

async function laPingQ(client, message, user, playerData) {
    const numCheck = function (response) {
        return (isNaN(response.cleanContent) === false && response.cleanContent > 0 && response.cleanContent <= 300);
    }    
    let laPingMessage = await message.author.send("**What is your ping to Los Angeles?**\n*I will only accept a number between 0 and 300. Do not type anything except the number.*").catch(console.error);
    if (playerData.laping !== -1) {
        await message.author.send("Previous response: " + playerData.laping).catch(console.error);
    }
    await laPingMessage.channel.awaitMessages(numCheck, {
        max: 1,
        time: 300000,
        errors: ['time'],
    })
        .then(async function(collected) {
            playerData.laping = Math.floor(collected.first().cleanContent);
            await message.author.send("Great! Next question:").catch(console.error);
            playerData.nextQuestion = true;
    })
        .catch(async function() {
            await message.author.send("Sorry, I did not detect a response and your signup has timed out. Whenever you are ready, please do `!naltp` again.").catch(console.error); 
            playerData.nextQuestion = false;
    });
    return playerData;
}

async function miaPingQ(client, message, user, playerData) {
    const numCheck = function (response) {
        return (isNaN(response.cleanContent) === false && response.cleanContent > 0 && response.cleanContent <= 300);
    }
    let miaPingMessage = await message.author.send("**What is your ping to Miami?**\n*I will only accept a number between 0 and 300. Do not type anything except the number.*").catch(console.error);
    if (playerData.miaping !== -1) {
        await message.author.send("Previous response: " + playerData.miaping).catch(console.error);
    }
    await miaPingMessage.channel.awaitMessages(numCheck, {
        max: 1,
        time: 300000,
        errors: ['time'],
    })
        .then(async function(collected) {
            playerData.miaping = Math.floor(collected.first().cleanContent);
            await message.author.send("Great! Next question:").catch(console.error);
            playerData.nextQuestion = true;
    })
        .catch(async function() {
            await message.author.send("Sorry, I did not detect a response and your signup has timed out. Whenever you are ready, please do `!naltp` again.").catch(console.error); 
            playerData.nextQuestion = false;
    });
    return playerData;
}

async function nycPingQ(client, message, user, playerData) {
    const numCheck = function (response) {
        return (isNaN(response.cleanContent) === false && response.cleanContent > 0 && response.cleanContent <= 300);
    }    
    let nycPingMessage = await message.author.send("**What is your ping to New York?**\n*I will only accept a number between 0 and 300. Do not type anything except the number.*").catch(console.error);
    if (playerData.nycping !== -1) {
        await message.author.send("Previous response: " + playerData.nycping).catch(console.error);
    }
    await nycPingMessage.channel.awaitMessages(numCheck, {
        max: 1,
        time: 300000,
        errors: ['time'],
    })
        .then(async function(collected) {
            playerData.nycping = Math.floor(collected.first().cleanContent);
            await message.author.send("Great! Next question:").catch(console.error);
            playerData.nextQuestion = true;
    })
        .catch(async function() {
            await message.author.send("Sorry, I did not detect a response and your signup has timed out. Whenever you are ready, please do `!naltp` again.").catch(console.error); 
            playerData.nextQuestion = false;
    });
    return playerData;
}

async function sfPingQ(client, message, user, playerData) {
    const numCheck = function (response) {
        return (isNaN(response.cleanContent) === false && response.cleanContent > 0 && response.cleanContent <= 300);
    }
    let sfPingMessage = await message.author.send("**What is your ping to San Francisco?**\n*I will only accept a number between 0 and 300. Do not type anything except the number.*").catch(console.error);
    if (playerData.sfping !== -1) {
        await message.author.send("Previous response: " + playerData.sfping).catch(console.error);
    }
    await sfPingMessage.channel.awaitMessages(numCheck, {
        max: 1,
        time: 300000,
        errors: ['time'],
    })
        .then(async function(collected) {
            playerData.sfping = Math.floor(collected.first().cleanContent);
            await message.author.send("Great! Next question:").catch(console.error);
            playerData.nextQuestion = true;
    })
        .catch(async function() {
            await message.author.send("Sorry, I did not detect a response and your signup has timed out. Whenever you are ready, please do `!naltp` again.").catch(console.error);
            playerData.nextQuestion = false;
    });
    return playerData;
}

async function seaPingQ(client, message, user, playerData) {
    const numCheck = function (response) {
        return (isNaN(response.cleanContent) === false && response.cleanContent > 0 && response.cleanContent <= 300);
    }
    let seaPingMessage = await message.author.send("**What is your ping to Seattle?**\n*I will only accept a number between 0 and 300. Do not type anything except the number.*").catch(console.error);
    if (playerData.seaping !== -1) {
        await message.author.send("Previous response: " + playerData.seaping).catch(console.error);
    }
    await seaPingMessage.channel.awaitMessages(numCheck, {
        max: 1,
        time: 300000,
        errors: ['time'],
    })
        .then(async function(collected) {
            playerData.seaping = Math.floor(collected.first().cleanContent);
            await message.author.send("Great! Next question:").catch(console.error);
            playerData.nextQuestion = true;
    })
        .catch(async function() {
            await message.author.send("Sorry, I did not detect a response and your signup has timed out. Whenever you are ready, please do `!naltp` again.").catch(console.error); 
            playerData.nextQuestion = false;
    });
    return playerData;
}

async function torPingQ(client, message, user, playerData) {
    const numCheck = function (response) {
        return (isNaN(response.cleanContent) === false && response.cleanContent > 0 && response.cleanContent <= 300);
    }
    let torPingMessage = await message.author.send("**What is your ping to Toronto?**\n*I will only accept a number between 0 and 300. Do not type anything except the number.*").catch(console.error);
    if (playerData.torping !== -1) {
        await message.author.send("Previous response: " + playerData.torping).catch(console.error);
    }
    await torPingMessage.channel.awaitMessages(numCheck, {
        max: 1,
        time: 300000,
        errors: ['time'],
    })
        .then(async function(collected) {
            playerData.torping = Math.floor(collected.first().cleanContent);
            await message.author.send("Great! That's the end of section two!").catch(console.error);
            playerData.nextQuestion = true;
    })
        .catch(async function() {
            await message.author.send("Sorry, I did not detect a response and your signup has timed out. Whenever you are ready, please do `!naltp` again.").catch(console.error);
            playerData.nextQuestion = false;
    });
    return playerData;
}

async function availDaysQ(client, message, user, playerData) {
    const donefilter = (reaction, user) => {
        return ['☑'].includes(reaction.emoji.name) && user.id === message.author.id;
    };
    let availDaysMessage = await message.author.send("**What days of the week are you normally available to play?**\nReact 🇺 for Sunday\nReact 🇲 for Monday\nReact 🇹 for Tuesday\nReact 🇼 for Wednesday\nReact 🇷 for Thursday\nReact 🇫 for Friday\nReact 🇸 for Saturday\n*Please react with ☑ when you have selected all of your days.*").catch(console.error);
    await availDaysMessage.react("🇺").catch(console.error);
    await availDaysMessage.react("🇲").catch(console.error);
    await availDaysMessage.react("🇹").catch(console.error);
    await availDaysMessage.react("🇼").catch(console.error);
    await availDaysMessage.react("🇷").catch(console.error);
    await availDaysMessage.react("🇫").catch(console.error);
    await availDaysMessage.react("🇸").catch(console.error);
    await availDaysMessage.react("☑").catch(console.error);
    if (playerData.availdays !== "") {
        await message.author.send("Previous response: " + playerData.availdays).catch(console.error);
    }
    await availDaysMessage.awaitReactions(donefilter, { max: 1, time: 300000, errors: ['time'] })
        .then(async (collected) => {
            let serverArr = [];
            let serverString = "";
            let reactCollection = collected.first().message.reactions;
            if (reactCollection.get("🇺").users.get(message.author.id)) {
                serverArr.push("Sunday");
            }
            if (reactCollection.get("🇲").users.get(message.author.id)) {
                serverArr.push("Monday");
            }
            if (reactCollection.get("🇹").users.get(message.author.id)) {
                serverArr.push("Tuesday");
            }
            if (reactCollection.get("🇼").users.get(message.author.id)) {
                serverArr.push("Wednesday");
            }
            if (reactCollection.get("🇷").users.get(message.author.id)) {
                serverArr.push("Thursday");
            }
            if (reactCollection.get("🇫").users.get(message.author.id)) {
                serverArr.push("Friday");
            }
            if (reactCollection.get("🇸").users.get(message.author.id)) {
                serverArr.push("Saturday");
            }
            if (serverArr.length == 0) {
                serverString = "None";
            }
            else {
                for (let i = 0; i < (serverArr.length - 1); i++) {
                    serverString += serverArr[i] + ", ";
                }
                serverString += serverArr[serverArr.length - 1];
            }
            playerData.availdays = serverString;
            await message.author.send("Great! Next question:").catch(console.error);
            playerData.nextQuestion = true;
    })
        .catch(async(collected) => {
            await message.author.send("Sorry, I did not detect a response and your signup has timed out. Whenever you are ready, please do `!naltp` again.").catch(console.error);
            playerData.nextQuestion = false;
    });
    return playerData;
}

async function availHoursQ(client, message, user, playerData) {
    let availHoursMessage = await message.author.send("**Please make a comment about what times you are available to play on your average days.** To help captains out, make sure to include what times you can play on game nights and include your time zone. If you can play at any time, just respond with `any times`.").catch(console.error);
    if (playerData.availhours !== "") {
        await message.author.send("Previous response: " + playerData.availhours).catch(console.error);
    }
    await availHoursMessage.channel.awaitMessages(response => (response.author.id === message.author.id && response.content), {
        max: 1,
        time: 300000,
        errors: ['time'],
    })
        .then(async function(collected) {
            playerData.availhours = collected.first().cleanContent;
            await message.author.send("Great! Next question:").catch(console.error);
            playerData.nextQuestion = true;
    })
        .catch(async function(err) {
            await message.author.send('Sorry, I did not detect a response and your signup has timed out. Whenever you are ready, please do `!naltp` again.').catch(console.error);
            playerData.nextQuestion = false;
    });
    return playerData;
}

async function availCommentQ(client, message, user, playerData) {
    let availCommentMessage = await message.author.send("**Explain any availability issues you know you will have.** If you don't have any, you can just respond with `None`.").catch(console.error);
    if (playerData.availcomment !== "") {
        await message.author.send("Previous response: " + playerData.availcomment).catch(console.error);
    }
    await availCommentMessage.channel.awaitMessages(response => (response.author.id === message.author.id && response.content), {
        max: 1,
        time: 300000,
        errors: ['time'],
    })
        .then(async function(collected) {
            playerData.availcomment = await collected.first().cleanContent;
            await message.author.send("Great! Next question:").catch(console.error);
            playerData.nextQuestion = true;
    })
        .catch(async function() {
            await message.author.send('Sorry, I did not detect a response and your signup has timed out. Whenever you are ready, please do `!naltp` again.').catch(console.error);
            playerData.nextQuestion = false;
    });
    return playerData;
}

async function genCommentQ(client, message, user, playerData) {
    let genCommentMessage = await message.author.send("**Any general comments for the captains/CRC?** In particular, we'd like some feedback on this signup process. If you don't have any comments, you can just respond with `None`.").catch(console.error);
    if (playerData.gencomment !== "") {
        await message.author.send("Previous response: " + playerData.gencomment).catch(console.error);
    }
    await genCommentMessage.channel.awaitMessages(response => (response.author.id === message.author.id && response.content), {
        max: 1,
        time: 300000,
        errors: ['time'],
    })
        .then(async function(collected) {
            playerData.gencomment = await collected.first().cleanContent;
            await message.author.send("Great! Next question:").catch(console.error);
            playerData.nextQuestion = true;
    })
        .catch(async function() {
            await message.author.send('Sorry, I did not detect a response and your signup has timed out. Whenever you are ready, please do `!naltp` again.').catch(console.error);
            playerData.nextQuestion = false;
    });
    return playerData;
}

function sendForm(playerData) {
    /*
    let formSubmitURL = `google_form_connected_with_data`;
    axios({
        method: "post",
        url: formSubmitURL
    })
    */
}

function sendCaptainData(captainData) {
    /*
    let formSubmitURL = `google_form_connected_with_data``;
    axios({
        method: "post",
        url: formSubmitURL
    });
    */
}