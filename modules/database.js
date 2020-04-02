const {google} = require("googleapis");
const SCOPES = ['https://www.googleapis.com/auth/script.projects', 'https://www.googleapis.com/auth/forms', 'https://www.googleapis.com/auth/spreadsheets', 'https://www.googleapis.com/auth/script.scriptapp', 'https://www.googleapis.com/auth/script.container.ui', 'https://www.googleapis.com/auth/script.external_request'];

const Database = require("better-sqlite3");
let db = new Database("./data/botdatabase.db");

const schedule = require("node-schedule");
const axios = require("axios");
const EventSource = require('eventsource');

module.exports = (client) => {    
    // define all of the lounge functions
    client.lounges = {
        "getLoungeAdmin": db.prepare("SELECT * FROM lounges WHERE id = ?;"),
        "setLoungeAdmin": db.prepare("INSERT OR REPLACE INTO lounges (id, adminid) VALUES (@id, @adminid);"),
        "deleteLoungeAdmin": db.prepare("DELETE FROM lounges WHERE id = ?;"),
        "checkLoungeAdmin": db.prepare("SELECT * FROM lounges WHERE adminid = ?;"),
        "clearLoungeAdmin": db.prepare("DELETE FROM lounges;")
    };   
    
    client.naltpDB = {
        "getUserByDiscord": db.prepare("SELECT * FROM naltp WHERE discordid=?;"),
        "getUserByTagPro": db.prepare("SELECT * FROM naltp WHERE tagproname=?;"),
        "setUser": db.prepare("INSERT OR REPLACE INTO naltp (discordid, tagproname, tagproid, oldname, mic, tpposition, playingfrom, homeserver, comfortservers, atlping, chiping, dalping, laping, miaping, nycping, sfping, seaping, torping, availdays, availhours, availcomment, gencomment, isregistered, islocked) VALUES (@discordid, @tagproname, @tagproid, @oldname, @mic, @tpposition, @playingfrom, @homeserver, @comfortservers, @atlping, @chiping, @dalping, @laping, @miaping, @nycping, @sfping, @seaping, @torping, @availdays, @availhours, @availcomment, @gencomment, @isregistered, @islocked);"),
        "getUsersByStatus": db.prepare("SELECT * FROM naltp WHERE isregistered=?;"),
        "getCountByStatus": db.prepare("SELECT COUNT(discordid) FROM naltp WHERE isregistered=?;"),
        "rescueLockedUsers": db.prepare("SELECT * FROM naltp WHERE islocked=?")
    };
    
    client.captainsDB = {
        "getUserByDiscord": db.prepare("SELECT * FROM naltpcaptain WHERE discordid=?;"),
        "getUserByTagPro": db.prepare("SELECT * FROM naltpcaptain WHERE tagproname=?;"),
        "setUser": db.prepare("INSERT OR REPLACE INTO naltpcaptain (discordid, tagproname, tagproid, q1, q2, q3, q4, q5, q6, q7, q8, q9, q10, isregistered) VALUES (@discordid, @tagproname, @tagproid, @q1, @q2, @q3, @q4, @q5, @q6, @q7, @q8, @q9, @q10, @isregistered);"),
        "getUsersByStatus": db.prepare("SELECT * FROM naltpcaptain WHERE isregistered=?;"),
        "getCountByStatus": db.prepare("SELECT COUNT(discordid) FROM naltpcaptain WHERE isregistered=?;")
    };
    
    // define all of the scrimlist functions
    client.scrimList = {
        "getScrimList": db.prepare("SELECT * FROM scrimlist ORDER BY nametype ASC, name ASC;"),
        "getScrimType": db.prepare("SELECT * FROM scrimlist WHERE nametype = ?;"),
        "getScrimPlayer": db.prepare("SELECT * FROM scrimlist WHERE id = ?;"),
        "setScrimPlayer": db.prepare("INSERT OR REPLACE INTO scrimlist (id, name, nametype) VALUES (@id, @name, @nametype);"),
        "deleteScrimPlayer": db.prepare("DELETE FROM scrimlist WHERE id = ?;"),
        "clearScrimList": db.prepare("DELETE FROM scrimlist;")
    };
    
    
    let refreshMapVotes = schedule.scheduleJob('*/15 * * * *', function() {
        axios.get(`https://tagpro.koalabeast.com/maps.json`)
        .then(async function (response) {
            let exportJSON = {};
            let currentMaps = response.data.rotation;
            let retiredMaps = response.data.retired;
            for (let i = 0; i < currentMaps.length; i++) {
                exportJSON[currentMaps[i].name] = {
                    "author": currentMaps[i].author,
                    "averageRating": currentMaps[i].averageRating,
                    "category": "Rotation",
                    "key": currentMaps[i].key,
                    "totalDislikes": currentMaps[i].totalDislikes,
                    "totalIndifferents": currentMaps[i].totalIndifferents,
                    "totalLikes": currentMaps[i].totalLikes,
                    "totalPlays": currentMaps[i].totalPlays,
                    "totalUsers": currentMaps[i].totalUsers,
                    "totalRatings": currentMaps[i].totalRatings,
                    "averageLikes": currentMaps[i].averageLikes,
                    "averageDislikes": currentMaps[i].averageDislikes,
                    "averageIndifferents": currentMaps[i].averageIndifferents
                }
            }
            for (let i = 0; i < retiredMaps.length; i++) {
                exportJSON[retiredMaps[i].name] = {
                    "author": retiredMaps[i].author,
                    "averageRating": retiredMaps[i].averageRating,
                    "category": "Retired",
                    "key": retiredMaps[i].key,
                    "totalDislikes": retiredMaps[i].totalDislikes,
                    "totalIndifferents": retiredMaps[i].totalIndifferents,
                    "totalLikes": retiredMaps[i].totalLikes,
                    "totalPlays": retiredMaps[i].totalPlays,
                    "totalUsers": retiredMaps[i].totalUsers,
                    "totalRatings": retiredMaps[i].totalRatings,
                    "averageLikes": retiredMaps[i].averageLikes,
                    "averageDislikes": retiredMaps[i].averageDislikes,
                    "averageIndifferents": retiredMaps[i].averageIndifferents
                }
            }
            exportJSON["TToC_lastUpdate"] = new Date().toLocaleTimeString('en-US',{timeZoneName:'short'});
            let writeJSON = {
                "id": "tagproMapStatistics",
                "status": JSON.stringify(exportJSON)
            };
            client.botText.setTextStatus.run(writeJSON);
        })
        .catch(function (error) {
            console.log("Error retrieving updated map votes");
        });
    });

    client.botStatus = {
        "getBotStatus": db.prepare("SELECT * FROM botstatus WHERE id = ?;"),
        "setBotStatus": db.prepare("INSERT OR REPLACE INTO botstatus (id, status) VALUES (@id, @status);")
    };
    
    client.botText = {
        "getTextStatus": db.prepare("SELECT * FROM bottext WHERE id = ?;"),
        "setTextStatus": db.prepare("INSERT OR REPLACE INTO bottext (id, status) VALUES (@id, @status);")
    };
    
    client.teamPerms = {
        "getTeamPerms": db.prepare("SELECT * FROM teamperms WHERE id = ?;"),
        "setTeamPerms": db.prepare("INSERT OR REPLACE INTO teamperms (id, teamlist) VALUES (@id, @teamlist);")
    };
    
    client.blacklist = {
        "getUser": db.prepare("SELECT * FROM blacklist WHERE id = ?;"),
        "setUser": db.prepare("INSERT OR REPLACE INTO blacklist (id) VALUES (@id);"),
        "deleteUser": db.prepare("DELETE FROM blacklist WHERE id = ?;")
    };
    
    client.usersDB = {
        "getUserByDiscord": db.prepare("SELECT * FROM users WHERE discordid = ?;"),
        "getUserByTagPro": db.prepare("SELECT * FROM users WHERE tagproid = ?;"),
        "getUserByTagProName": db.prepare("SELECT * FROM users WHERE tagproname = ? COLLATE NOCASE;"),
        "getUsersByStatus": db.prepare("SELECT * FROM users WHERE vstatus = ?;"),
        "getManualUsers": db.prepare("SELECT * FROM users WHERE vcount = 217253;"),
        "updateUser": db.prepare("INSERT OR REPLACE INTO users (discordid, tagproid, tagproname, verifyname, vstatus, vcount) VALUES (@discordid, @tagproid, @tagproname, @verifyname, @vstatus, @vcount);")
    };
    
    client.flairDB = {
        "getFlair": db.prepare("SELECT * FROM flairs WHERE id = ?;"),
        "getAll": db.prepare("SELECT * FROM flairs;"),
        "setFlair": db.prepare("INSERT OR REPLACE INTO flairs (id, flair, flairtype, reason, time, username, userid) VALUES (@id, @flair, @flairtype, @reason, @time, @username, @userid);"),
        "deleteFlair": db.prepare("DELETE FROM flairs WHERE id = ?;"),
        "ready": function(client) {
            var es = new EventSource('https://tagpro.koalabeast.com/flairlog');
            es.addEventListener("flair", function(data) {
                let thisEntry = JSON.parse(data.data);
                let dbCheck = client.flairDB.getFlair.get(thisEntry.id+"0");
                if (!dbCheck) {
                    for (let i = 0; i < thisEntry.flairs.length; i++) {
                        let dbEntry = {
                            id: thisEntry.id+i.toString(),
                            flair: JSON.stringify(thisEntry.flairs[i]),
                            flairtype: thisEntry.type,
                            reason: thisEntry.reason.replace(/\!$/, ''),
                            time: thisEntry.time,
                            username: thisEntry.username,
                            userid: thisEntry.user
                        }
                        let flairName = thisEntry.flairs[i].flair;
                        client.flairDB.setFlair.run(dbEntry);
                        let userCheck = client.usersDB.getUserByTagPro.get(dbEntry.userid);
                        if (userCheck) {
                            let memberCheck = client.guilds.first().members.get(userCheck.discordid);
                            if (memberCheck) {
                                let textChannel = client.guilds.first().channels.find(channel => channel.name === "bot-spam");
                                textChannel.send(`${memberCheck} has earned the ${flairName} flair for ${dbEntry.reason}! Congrats!`);
                            }
                        }
                    }
                }
            });
        }
    };
    
    const gAppKey = client.config.gAppKey;
    const gAppToken = client.config.gAppToken;
    const {client_secret, client_id, redirect_uris} = gAppKey.installed;
    const tempoAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);
    tempoAuth2Client.setCredentials(gAppToken);
    
    client.gApps = {
        "oAuth2Client": tempoAuth2Client,
        "callAppsScript": function (funcName, client, auth) {
            const scriptId = client.config.appScriptToken;
            const script = google.script({version: 'v1', auth});
            let response;
            // Make the API request. The request object is included here as 'resource'.
            script.scripts.run({
                resource: {
                    function: funcName,
                },
                scriptId: scriptId,
            }, function (err, resp) {
                if (err) {
                    // The API encountered a problem before the script started executing.
                    response = 'The API returned an error: ' + err;
                }
                if (resp.error) {
                    // The API executed, but the script returned an error.
                    // Extract the first (and only) set of error details. The values of this
                    // object are the script's 'errorMessage' and 'errorType', and an array
                    // of stack trace elements.
                    const error = resp.error.details[0];
                    response = 'Script error message: ' + error.errorMessage;
                } else {
                    // The structure of the result will depend upon what the Apps Script
                    // function returns. Here, the function returns an Apps Script Object
                    // with String keys and values, and so the result is treated as a
                    // Node.js object (folderSet).
                    response = resp.data.response.result;
                    let writeStatus = {
                        "id": funcName,
                        "status": JSON.stringify(response)
                    };
                    // define custom overwrite
                    if (funcName === "updateSignups") {
                        writeStatus.id = "DraftBoardSetup";
                    }
                    client.botText.setTextStatus.run(writeStatus);
                }
            });
        },
        "getSheetsData": function (sheetID, sheetRange, client, auth) {
            const sheets = google.sheets({version: 'v4', auth});
            sheets.spreadsheets.values.get({
                spreadsheetId: sheetID,
                range: sheetRange,
            }, (err, res) => {
                if (err) return console.log('The API returned an error: ' + err);
                const rows = res.data.values;
                if (rows.length) {
                    let writeStatus = {
                        "id": sheetID+sheetRange,
                        "status": JSON.stringify(rows)
                    };
                    client.botText.setTextStatus.run(writeStatus);
                } else {
                    console.log('No data found.');
                }
            });
        }
    };
}