// The draft command allows the bot owner to start a tournament draft

exports.run = async (client, message, args, level) => {
    let captainNum;
    let draftRound;
    let rawDraftData = client.botText.getTextStatus.get("DraftBoardSetup");
    let capOrder;
    let playersArr;
    if (rawDraftData && rawDraftData.status) {
        let parseData = JSON.parse(rawDraftData.status);
        capOrder = parseData[0];
        playersArr = parseData[1];
    }
    if (!args || args.length < 2) {
        captainNum = 1;
        draftRound = 1;
        for (let k = 0; k < playersArr.length; k++) {
            let currentPlayer = client.tournaments.getLowerUser.get(playersArr[k].toLowerCase());
            currentPlayer.pstatus = 2;
            client.tournaments.setTournamentUser.run(currentPlayer);
        }
        for (let z = 1; z < capOrder.length; z++) {
            let captainData = client.tournaments.getLowerUser.get(capOrder[z].toLowerCase());
            let currentCaptain = message.guild.members.get(captainData.id);
            await currentCaptain.send(`Hey ${captainData.tagproname}, the draft is starting! Be sure to check here during the draft and I'll message you when it's your pick!`);
        }
    }
    else {
        draftRound = args[0];
        captainNum = args[1];
    }
    
    if (draftRound === 1) {
        draftRound = 2;
        for (let i = captainNum; i < capOrder.length; i++) {
            let captainData = client.tournaments.getLowerUser.get(capOrder[i].toLowerCase());
            let currentCaptain = message.guild.members.get(captainData.id);
            message.channel.send(`${captainData.tagproname} is drafting!`);
            await currentCaptain.send(`Hey ${captainData.tagproname}, it's currently your pick in round 1 of the draft! Type the player you want to draft and I'll tell you if they're available! Use !list to see the list of available players!`)
                .then(async function() {
                    let finished = false;
                    while (finished === false) {
                        await currentCaptain.user.dmChannel.awaitMessages(response => response.author.id === currentCaptain.id, {
                            max: 1,
                            time: 30000,
                            errors: ['time'],
                        })
                            .then(async function(collected) {
                                if (collected.first().cleanContent.toLowerCase() === "!list") {
                                    let sendPlayerList = "Here are the available players:";
                                    for (let z = 0; z < playersArr.length; z++) {
                                        sendPlayerList += "\n"+playersArr[z];
                                    }
                                    sendPlayerList += "\nType the player you want to draft! (Case-insensitive)"
                                    currentCaptain.send(sendPlayerList);
                                }
                                else {
                                    let pickedPlayer = client.tournaments.getLowerUser.get(collected.first().cleanContent.toLowerCase());
                                    if (!pickedPlayer) {
                                        currentCaptain.send("Sorry, I didn't recognize that player. Only type their name, case-insensitive, as it appears on the spreadsheet. Ex: `TToC_BOT`");
                                    }
                                    else if (pickedPlayer.pstatus === 2) {
                                        currentCaptain.send('Success! You drafted: '+pickedPlayer.tagproname);
                                        message.guild.members.get(pickedPlayer.id).send(`Congrats, you were drafted to Team ${i} by ${captainData.tagproname}!`);
                                        message.channel.send(`${captainData.tagproname} has drafted ${pickedPlayer.tagproname}`);
                                        pickedPlayer.pstatus = 3;
                                        client.tournaments.setTournamentUser.run(pickedPlayer);
                                        client.tournaments.submitPick(client, 1, i, pickedPlayer.tagproname);
                                        playersArr.splice(playersArr.indexOf(pickedPlayer.tagproname),1);
                                        rawDraftData.status = JSON.stringify([capOrder,playersArr]);
                                        client.botText.setTextStatus.run(rawDraftData);
                                        finished = true;
                                    }
                                    else {
                                        currentCaptain.send(`Sorry, ${pickedPlayer.tagproname} is not available.`);
                                    }
                                }
                            })
                            .catch(async function(e) {
                                currentCaptain.send(`Hey ${captainData.tagproname}, you still need to make a pick!`);
                            });
                    }
                });
        }
    }
    for (let j = draftRound; j <= 3; j++) {
        let tempStarter;
        if (!args || args.length < 2) {
            tempStarter = capOrder.length - 1;
        }
        else if (j === args[0]) {
            tempStarter = args[1];
        }
        else {
            tempStarter = capOrder.length - 1;
        }
        let tempEnd;
        if (j === 3){
            tempEnd = 1;
        }
        else {
            tempEnd = 0;
        }
        for (let i = tempStarter; i > tempEnd; i--) {
            let captainData = client.tournaments.getLowerUser.get(capOrder[i].toLowerCase());
            let currentCaptain = message.guild.members.get(captainData.id);
            message.channel.send(`${captainData.tagproname} is drafting!`);
            await currentCaptain.send(`Hey ${captainData.tagproname}, it's currently your pick in round ${j} of the draft! Type the player you want to draft and I'll tell you if they're available! Use !list to see the list of available players!`)
                .then(async function() {
                    let finished = false;
                    while (finished === false) {
                        await currentCaptain.user.dmChannel.awaitMessages(response => response.author.id === currentCaptain.id, {
                            max: 1,
                            time: 30000,
                            errors: ['time'],
                        })
                            .then(async function(collected) {
                                if (collected.first().cleanContent.toLowerCase() === "!list") {
                                    let sendPlayerList = "Here are the available players:";
                                    for (let z = 0; z < playersArr.length; z++) {
                                        sendPlayerList += "\n"+playersArr[z];
                                    }
                                    sendPlayerList += "\nType the player you want to draft! (Case-insensitive)"
                                    currentCaptain.send(sendPlayerList);
                                }
                                else {
                                    let pickedPlayer = client.tournaments.getLowerUser.get(collected.first().cleanContent.toLowerCase());
                                    if (!pickedPlayer) {
                                        currentCaptain.send("Sorry, I didn't recognize that player. Only type their name, case-insensitive, as it appears on the spreadsheet. Ex: `TToC_BOT`");
                                    }
                                    else if (pickedPlayer.pstatus === 2) {
                                        currentCaptain.send('Success! You drafted: '+pickedPlayer.tagproname);
                                        message.guild.members.get(pickedPlayer.id).send(`Congrats, you were drafted to Team ${i} by ${captainData.tagproname}!`);
                                        message.channel.send(`${captainData.tagproname} has drafted ${pickedPlayer.tagproname}`);
                                        pickedPlayer.pstatus = 3;
                                        client.tournaments.setTournamentUser.run(pickedPlayer);
                                        client.tournaments.submitPick(client, j, i, pickedPlayer.tagproname);
                                        playersArr.splice(playersArr.indexOf(pickedPlayer.tagproname),1);
                                        rawDraftData.status = JSON.stringify([capOrder,playersArr]);
                                        client.botText.setTextStatus.run(rawDraftData);
                                        finished = true;
                                    }
                                    else {
                                        currentCaptain.send(`Sorry, ${pickedPlayer.tagproname} is not available.`);
                                    }
                                }
                            })
                            .catch(async function(e) {
                                currentCaptain.send(`Hey ${captainData.tagproname}, you still need to make a pick!`);
                            });
                    }
                });
        }
    }
    let finalPlayer = client.tournaments.getLowerUser.get(playersArr[0]);
    let finalCaptainData = client.tournaments.getLowerUser.get(capOrder[1].toLowerCase());
    let finalCaptain = message.guild.members.get(finalCaptainData.id);
    finalCaptain.send("Success! You drafted: " + finalPlayer.tagproname);
    message.guild.members.get(finalPlayer.id).send(`Congrats, you were drafted to Team 1 by ${finalCaptainData.tagproname}!`);
    message.channel.send(`${finalCaptainData.tagproname} has drafted ${finalPlayer.tagproname}`);
    message.channel.send("The tournament draft has concluded! Remember to use team abbreviations and have fun!");
    finalPlayer.pstatus = 3;
    client.tournaments.setTournamentUser.run(finalPlayer);
    client.tournaments.submitPick(client, 3, 1, finalPlayer.tagproname);
    
    for (let i = 1; i < capOrder.length; i++) {
        let captainData = client.tournaments.getLowerUser.get(capOrder[i].toLowerCase());
        let currentCaptain = message.guild.members.get(captainData.id);
        let teamNum = "";
        if (i < 10) {
            teamNum = "0" + i;
        }
        else {
            teamNum = i;
        }
        await currentCaptain.send("The tournament draft has concluded! Create a voice lounge on the server for your team using the following command:```!lounge name```If you need a group, use the following command:```!group```Don't forget to use your team abbreviation in groups and have your tagpro.eu/comp stats scripts active! (Tell the group leader to set your team name as your abbreviation instead of Red or Blue) Your abbreviation is: `T"+teamNum+"`\ntagpro.eu script: <https://tagpro.eu/userscript.user.js>\nComp Stats Script: <https://gist.github.com/Poeticalto/00de8353fce79cac9059b22f20242039/raw/2389544f86b8b5e4f8a2075403ab3838ea48ba95/TagPro_Competitive_Group_Maker.user.js>");
    }
    let draftedPlayers = client.tournaments.getPlayers.all(3);
    for (let i = 0; i < draftedPlayers.length; i++) {
        let currentPlayer = message.guild.members.get(draftedPlayers[i].id);
        await currentPlayer.send(`The tournament draft has concluded! Find your team in the General Lounges section of the server and have fun! Remind your captain to use proper team abbreviations and remember to have your tagpro.eu/comp stats scripts active!\ntagpro.eu script: <https://tagpro.eu/userscript.user.js>\nComp Stats Script: <https://gist.github.com/Poeticalto/00de8353fce79cac9059b22f20242039/raw/2389544f86b8b5e4f8a2075403ab3838ea48ba95/TagPro_Competitive_Group_Maker.user.js>`);
    }
}

exports.conf = {
    enabled: true,
    guildOnly: true,
    aliases: [],
    permLevel: "Bot Owner"
};

exports.help = {
    name: "draft",
    category: "Tournaments",
    description: "starts the draft",
    usage: "draft picknum"
};