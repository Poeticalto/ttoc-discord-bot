/**
* The verifyCheck event is a user defined event which checks profiles with the TagPro production servers
* @param {client} client - client object for the bot
*/

const axios = require("axios");

module.exports = (client) => {
    let partAUsers = client.usersDB.getUsersByStatus.all(1);
    let partBUsers = client.usersDB.getUsersByStatus.all(2);
    let partCUsers = client.usersDB.getUsersByStatus.all(226078);
    let queryString = "";
    if (partAUsers.length === 0 && partBUsers.length === 0 && partCUsers.length === 0) {
        return;
    }
    for (let i = 0; i < partAUsers.length; i++) {
        if (i == partAUsers.length - 1 && partBUsers.length == 0) {
            queryString += partAUsers[i].tagproid;
            break;
        }
        queryString += partAUsers[i].tagproid + ",";
    }
    for (let j = 0; j < partBUsers.length; j++) {
        if (j == partBUsers.length - 1 && partCUsers.length == 0) {
            queryString += partBUsers[j].tagproid;
            break;
        }
        queryString += partBUsers[j].tagproid + ",";
    }
    for (let j = 0; j < partCUsers.length; j++) {
        if (j == partCUsers.length - 1) {
            queryString += partCUsers[j].tagproid;
            break;
        }
        queryString += partCUsers[j].tagproid + ",";
    }
    client.tagproCheck.get(queryString)
        .then(async function (response) {
            // handle server errors
            if (response.data && response.data.error) {
                if (response.data.error == "Invalid Request") {
                    // An invalid request happens when a single profile is requested that doesn't exist on the server
                    // because partBUsers has already been verified, this error can only occur when a single partAUser is sent
                    // with an invalid ID.
                    partAUsers[0].tagproid = "none";
                    partAUsers[0].vstatus = 0;
                    client.usersDB.updateUser.run(partAUsers[0]);
                    let messageMember = client.guilds.first().members.get(partAUsers[0].discordid);
                    await messageMember.user.send("Sorry, the profile ID you entered doesn't exist. Please ensure your ID is correct and do `!verify ID`, where ID is replaced with one of the following:\nraw ID (example: `!verify 53bdf282c9bab5f82768e4ad`)\nprofile link (example: `!verify https://tagpro.koalabeast.com/profile/53bdf282c9bab5f82768e4ad`)\nPlease use <https://tagpro.koalabeast.com> to retrive your profile link. If you need assistance with finding your profile link, contact an admin.").catch(console.error);
                }
            }
            let profileKeys = [];
            for (let i = 0; i < response.data.length; i++) {
                profileKeys.push(response.data[i]["_id"]);
            }
            for (let j = 0; j < partAUsers.length; j++) {
                let keyIndex = profileKeys.indexOf(partAUsers[j].tagproid);
                let messageMember = client.guilds.first().members.get(partAUsers[j].discordid);
                if (keyIndex === -1) {
                    partAUsers[j].tagproid = "none";
                    partAUsers[j].vstatus = 0;
                    client.usersDB.updateUser.run(partAUsers[j]);
                    await messageMember.user.send("Sorry, the profile ID you entered doesn't exist. Please ensure your ID is correct and do `!verify ID`, where ID is replaced with one of the following:\nraw ID (example: `!verify 53bdf282c9bab5f82768e4ad`)\nprofile link (example: `!verify https://tagpro.koalabeast.com/profile/53bdf282c9bab5f82768e4ad`)\nPlease use <https://tagpro.koalabeast.com> to retrive your profile link. If you need assistance with finding your profile link, contact an admin.").catch(console.error);
                    continue;
                }
                partAUsers[j].tagproname = response.data[keyIndex].reservedName;
                partAUsers[j].vstatus = 2;
                partAUsers[j].verifyname = client.newUUID(false).slice(0,12);
                client.usersDB.updateUser.run(partAUsers[j]);
                await messageMember.user.send("Thanks for your patience " + partAUsers[j].tagproname + ", you're almost there! I've confirmed that your profile exists, now we just need to confirm your profile is actually yours. This means you'll need to change your reserved name so I can verify your profile. (Don't worry, you can change it back right after your profile is verified.)\n**PLEASE CHANGE YOUR RESERVED NAME TO THIS:** `" + partAUsers[j].verifyname + "`\nRemember to click the `Save Settings` button once you've changed it!\nIf you're unsure where to change your name, go to your profile on <https://tagpro.koalabeast.com> and find the area that looks like this: https://www.tagproleague.com/assets/img/login/after_name_change.png\nYou will have 5 minutes to change your name before the request will timeout and you'll have to start this process over again. Contact an admin if you need any help.").catch(console.error);
            }
            for (let k = 0; k < partBUsers.length; k++) {
                let keyIndex = profileKeys.indexOf(partBUsers[k].tagproid);
                let messageMember = client.guilds.first().members.get(partBUsers[k].discordid);
                if (!messageMember) {
                    partBUsers[k].vstatus = 0;
                    partBUsers[k].tagproid = "none";
                    partBUsers[k].vcount = 0;
                    client.usersDB.updateUser.run(partBUsers[k]);
                    continue;
                }
                if (response.data[keyIndex].reservedName == partBUsers[k].verifyname) {
                    partBUsers[k].vstatus = 3;
                    let autoVerificationConditions = true; // replace autoVerificationConditions with your own thresholds for automatic verification
                    if (autoVerificationConditions) {
                        let someBallRole = client.guilds.first().roles.find(role => role.name === "Some Ball");
                        if (messageMember.roles.has(someBallRole.id)) {
                            messageMember.setNickname(partBUsers[k].tagproname);
                            messageMember.removeRole(someBallRole).catch(console.error);
                        }
                        else {                 
                            await messageMember.user.send("Your profile has been successfully verified!\n**Remember to change your TagPro name back to its original name!**").catch(console.error);
                        }
                        partBUsers[k].vcount = 0;
                        client.usersDB.updateUser.run(partBUsers[k]);
                        await client.guilds.first().channels.find(channel => channel.name === "join-feed").send(`${messageMember} has successfully verified: <https://tagpro.koalabeast.com/profile/${partBUsers[k].tagproid}>`).catch(console.error);
                        // guildMemberUpdate sends a verified message once the some ball role has been removed, so there's no need to send one here.
                        continue;
                    }
                    partBUsers[k].vcount = 217253;
                    messageMember.setNickname("*"+partBUsers[k].tagproid);
                    client.usersDB.updateUser.run(partBUsers[k]);
                    await messageMember.user.send("Your profile has been successfully verified, but unfortunately, you do not meet certain age requirements to receive automatic admission. Don't worry, an admin will contact you shortly to help verify you manually.\n**Remember to change your TagPro name back to its original name!**").catch(console.error);
                    await client.guilds.first().channels.find(channel => channel.name === "join-feed").send(`${messageMember} requires manual verification: <https://tagpro.koalabeast.com/profile/${partBUsers[k].tagproid}>`).catch(console.error);
                    continue;
                }
                partBUsers[k].vcount++;
                if (partBUsers[k].vcount > 10) {
                    partBUsers[k].vstatus = 0;
                    partBUsers[k].tagproid = "none";
                    partBUsers[k].vcount = 0;
                    client.usersDB.updateUser.run(partBUsers[k]);
                    await messageMember.user.send("Unfortunately, I did not detect the proper reserved name on your profile. For security reasons, your verification has timed out. Whenever you're ready to verify, please ensure your ID is correct and do `!verify ID`, where ID is replaced with one of the following:\nraw ID (example: `!verify 53bdf282c9bab5f82768e4ad`)\nprofile link (example: `!verify https://tagpro.koalabeast.com/profile/53bdf282c9bab5f82768e4ad`)\nPlease use <https://tagpro.koalabeast.com> to retrive your profile link. If you need assistance with finding your profile link, contact an admin.").catch(console.error);
                    continue;
                }
                let timeLeft = 300 - (30 * partBUsers[k].vcount);
                await messageMember.user.send("You have " + timeLeft + " seconds to change your reserved name. Remember to change your reserved name to this: `" + partBUsers[k].verifyname + "`").catch(console.error);
                client.usersDB.updateUser.run(partBUsers[k]);
                continue;
            }
            for (let l = 0; l < partCUsers.length; l++) {
                let keyIndex = profileKeys.indexOf(partCUsers[l].tagproid);
                let messageMember = client.guilds.first().members.get(partCUsers[l].discordid);
                partCUsers[l].tagproname = response.data[keyIndex].reservedName;
                partCUsers[l].vstatus = 3;
                await messageMember.user.send("Success! Your profile name has been updated to `"+partCUsers[l].tagproname+"`!").catch(console.error);
                client.usersDB.updateUser.run(partCUsers[l]);
            }
    })
        .catch(function (error) {
        console.log(error);
    });
}