const fs = require("fs");
const Discord = require("discord.js");
const client = new Discord.Client();
const readline = require("readline");
const {google} = require("googleapis");

const { promisify } = require("util");
const readdir = promisify(require("fs").readdir);
const Enmap = require("enmap");

client.config = require("./config.js"); // config file
require("./modules/functions.js")(client); // functions file
client.commands = new Enmap();
client.aliases = new Enmap();
client.settings = new Enmap({name: "settings"});
client.logger = require("./modules/Logger.js");

const Database = require("better-sqlite3");
let db = new Database("./data/botdatabase.db");

const moment = require("moment");

const badWords = require("bad-words");
const badFilter = new badWords();

const schedule = require("node-schedule");
const axios = require('axios');

const init = async () => {

    // connect to bot users database
    let stmt = db.prepare(`SELECT name
FROM sqlite_master
WHERE
type='table' and name='tournamentusers'
;`);
    let row = stmt.get();
    if(row === undefined){
        console.log("WARNING: database appears empty; initializing it.");
        // tournamentusers is the table managing user data for tournaments
        // lounges is the table managing voice lounges and admins
        // scrimlist is the table managing available players/teams for scrims
        // duelusers is the table managing user data for the duel system
        // duelgames is the table managing the list of games for the duel system
        // botstatus is the table managing misc flags such as tournament status
        const sqlInit = `
CREATE TABLE tournamentusers (
id TEXT PRIMARY KEY,
tagproname TEXT,
position TEXT,
mic TEXT,
ping INTEGER,
pstatus INTEGER
);

CREATE TABLE lounges (
id TEXT PRIMARY KEY,
adminid TEXT
);

CREATE TABLE scrimlist (
id TEXT PRIMARY KEY,
name TEXT,
nametype TEXT
);

CREATE TABLE duelusers (
id TEXT PRIMARY KEY,
discordname TEXT,
server TEXT,
currentelo REAL,
highelo REAL,
lowelo REAL,
win INTEGER,
loss INTEGER,
tie INTEGER,
total INTEGER,
winp REAL,
gamestatus INTEGER
);

CREATE TABLE duelgames (
id INTEGER PRIMARY KEY,
playeroneid TEXT,
playeronescore INTEGER,
playeronebelo REAL,
playeroneaelo REAL,
playertwoid TEXT,
playertwoscore INTEGER,
playertwobelo REAL,
playertwoaelo REAL
);

CREATE TABLE botstatus (
id TEXT PRIMARY KEY,
status INTEGER
);

CREATE TABLE teamperms (
id TEXT PRIMARY KEY,
teamlist TEXT
);

INSERT INTO tournamentusers (id, tagproname, position, mic, ping, pstatus) VALUES
("0ABCDEF", "test", "Both", "Yes", 50, 0)
;

INSERT INTO botstatus(id, status) VALUES ("tournaments", 0);
INSERT INTO botstatus(id, status) VALUES ("draftpick", 1);
INSERT INTO botstatus(id, status) VALUES ("tournamentteams", 0);
`;
        db.exec(sqlInit);
    }

    // define all of the tournament functions
    client.tournaments = {
        "getTournamentUser": db.prepare("SELECT * FROM tournamentusers WHERE id = ?;"),
        "setTournamentUser": db.prepare("INSERT OR REPLACE INTO tournamentusers (id, tagproname, position, mic, ping, pstatus) VALUES (@id, @tagproname, @position, @mic, @ping, @pstatus);"),
        "resetSignups": db.prepare("UPDATE tournamentusers SET pstatus = 0;"),
        "updateSignup": function(client, currentUser, type) {
            // build the form submission step by step
            let formSubmitURL = client.config.tournamentFormLink;
            // add name first
            formSubmitURL += client.config.tournamentFormName + "=" + currentUser.tagproname + "&";
            // add position
            formSubmitURL += client.config.tournamentFormPos + "=" + currentUser.position + "&";
            // add mic
            formSubmitURL += client.config.tournamentFormMic + "=" + currentUser.mic + "&";
            // add ping
            formSubmitURL += client.config.tournamentFormPing + "=" + currentUser.ping + "&";
            // add captain status
            formSubmitURL += client.config.tournamentFormCap + "=" + "No&";
            // add form type
            if (currentUser.pstatus === 2) {
                formSubmitURL += client.config.tournamentFormCap + "=" + "Yes&";
                formSubmitURL += client.config.tournamentFormType + "=" + type + "&";
            }
            else if (currentUser.pstatus === 1) {
                formSubmitURL += client.config.tournamentFormCap + "=" + "No&";
                formSubmitURL += client.config.tournamentFormType + "=" + type + "&";
            }
            else {
                formSubmitURL += client.config.tournamentFormCap + "=" + "No&";
                formSubmitURL += client.config.tournamentFormType + "=Remove&";
            }
            formSubmitURL += "submit=Submit";

            axios({
                method: "post",
                url: formSubmitURL
            });
        }
    };
    client.logger.log("tournamentuser db functions loaded.");
    
    // define all of the lounge functions
    client.lounges = {
        "getLoungeAdmin": db.prepare("SELECT * FROM lounges WHERE id = ?;"),
        "setLoungeAdmin": db.prepare("INSERT OR REPLACE INTO lounges (id, adminid) VALUES (@id, @adminid);"),
        "deleteLoungeAdmin": db.prepare("DELETE FROM lounges WHERE id = ?;"),
        "checkLoungeAdmin": db.prepare("SELECT * FROM lounges WHERE adminid = ?;"),
        "clearLoungeAdmin": db.prepare("DELETE FROM lounges;")
    };
    client.logger.log("lounges db functions loaded.");
    
    // define all of the scrimlist functions
    client.scrimList = {
        "getScrimList": db.prepare("SELECT * FROM scrimlist ORDER BY nametype ASC, name ASC;"),
        "getScrimPlayer": db.prepare("SELECT * FROM scrimlist WHERE id = ?;"),
        "setScrimPlayer": db.prepare("INSERT OR REPLACE INTO scrimlist (id, name, nametype) VALUES (@id, @name, @nametype);"),
        "deleteScrimPlayer": db.prepare("DELETE FROM scrimlist WHERE id = ?;"),
        "clearScrimlist": db.prepare("DELETE FROM scrimlist;")
    };
    let resetScrimList = schedule.scheduleJob('0 0 5 * * *', function(){
        // clear scrim list at 5 AM local time
        client.scrimList.clearScrimlist.run();
        client.logger.log("scrim list db cleared.");
    });
    client.logger.log("scrimlist db functions loaded.");

    // define all of the botStatus functions
    client.botStatus = {
        "getBotStatus": db.prepare("SELECT * FROM botstatus WHERE id = ?;"),
        "setBotStatus": db.prepare("INSERT OR REPLACE INTO botstatus (id, status) VALUES (@id, @status);")
    };
    client.logger.log("botstatus db functions loaded.");
    
    client.teamPerms = {
        "getTeamPerms": db.prepare("SELECT * FROM teamperms WHERE id = ?;"),
        "setTeamPerms": db.prepare("INSERT OR REPLACE INTO teamperms (id, teamlist) VALUES (@id, @teamlist);")
    };
    
    // return a new timestamp
    client.getTime = () => {return moment().format()};
    // add bad words in the config to the bad words list
    badFilter.addWords(...client.config.addBadWords);
    // remove bad words in the config from the bad words list
    badFilter.removeWords(...client.config.removeBadWords);
    // checkProfanity will check a string for any bad words
    client.checkProfanity = (stringCheck) => {return badFilter.isProfane(stringCheck)};

    // Here we load **commands** into memory, as a collection, so they're accessible
    // here and everywhere else.
    const cmdFiles = await readdir("./commands/");
    client.logger.log(`Loading a total of ${cmdFiles.length} commands.`);
    cmdFiles.forEach(f => {
        if (!f.endsWith(".js")) return;
        const response = client.loadCommand(f);
        if (response) console.log(response);
    });

    // Then we load events, which will include our message and ready event.
    const evtFiles = await readdir("./events/");
    client.logger.log(`Loading a total of ${evtFiles.length} events.`);
    evtFiles.forEach(file => {
        const eventName = file.split(".")[0];
        client.logger.log(`Loading Event: ${eventName}`);
        const event = require(`./events/${file}`);
        // Bind the client to any event, before the existing arguments
        // provided by the discord.js event.
        // This line is awesome by the way. Just sayin'.
        client.on(eventName, event.bind(null, client));
    });

    // Generate a cache of client permissions for pretty perm names in commands.
    client.levelCache = {};
    for (let i = 0; i < client.config.permLevels.length; i++) {
        const thisLevel = client.config.permLevels[i];
        client.levelCache[thisLevel.name] = thisLevel.level;
    }
    // Here we login the client.
    client.login(client.config.discordToken);
    setInterval(function(){ client.emit("updateStreams"); }, 60000);
    // End top-level async/await function.
};

init();