const Database = require("better-sqlite3");
let db = new Database("./data/botdatabase.db");

const schedule = require("node-schedule");
const axios = require("axios");
const EventSource = require('eventsource');

module.exports = (client) => {
    let stmt = db.prepare(`SELECT *
FROM sqlite_master
WHERE
type='table' and name='botstatus'
;`);
    let row = stmt.get();
    if(row === undefined){
        console.log("WARNING: database appears empty; initializing it.");
        const sqlInit = `
CREATE TABLE lounges (
id TEXT PRIMARY KEY,
adminid TEXT
);
CREATE TABLE scrimlist (
id TEXT PRIMARY KEY,
name TEXT,
nametype TEXT
);
CREATE TABLE botstatus (
id TEXT PRIMARY KEY,
status INTEGER
);
CREATE TABLE bottext (
id TEXT PRIMARY KEY,
status TEXT
);
CREATE TABLE teamperms (
id TEXT PRIMARY KEY,
teamlist TEXT
);
CREATE TABLE blacklist (
id TEXT PRIMARY KEY
);
CREATE TABLE flairs (
id TEXT PRIMARY KEY,
flair TEXT,
flairtype TEXT,
reason TEXT,
time TEXT,
username TEXT,
userid TEXT
);
CREATE TABLE naltp (
discordid TEXT PRIMARY KEY,
tagproid TEXT,
tagproname TEXT,
oldname TEXT,
mic TEXT,
tpposition TEXT,
playingfrom TEXT,
homeserver TEXT,
comfortservers TEXT,
atlping INTEGER,
chiping INTEGER,
dalping INTEGER,
laping INTEGER,
miaping INTEGER,
nycping INTEGER,
sfping INTEGER,
seaping INTEGER,
torping INTEGER,
availdays TEXT,
availhours TEXT,
availcomment TEXT,
gencomment TEXT,
isregistered INTEGER,
islocked INTEGER
);
CREATE TABLE naltpcaptain (
discordid TEXT PRIMARY KEY,
tagproid TEXT, 
tagproname TEXT,
q1 TEXT,
q2 TEXT,
q3 TEXT,
q4 TEXT,
q5 TEXT,
q6 TEXT,
q7 TEXT,
q8 TEXT,
q9 TEXT,
q10 TEXT,
isregistered TEXT
);
CREATE TABLE users (
discordid TEXT PRIMARY KEY,
tagproid TEXT,
tagproname TEXT,
oldroles TEXT,
verifyname TEXT,
vstatus INTEGER,
vcount INTEGER
);
INSERT INTO botstatus(id, status) VALUES ("databasecheck", 1);
`;
        db.exec(sqlInit);
    }
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
        "setUser": db.prepare("INSERT OR REPLACE INTO users (discordid, tagproid, tagproname, oldroles, verifyname, vstatus, vcount) VALUES (@discordid, @tagproid, @tagproname, @oldroles, @verifyname, @vstatus, @vcount);")
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
}