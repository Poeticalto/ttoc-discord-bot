const fs = require("fs");
const Discord = require('discord.js');
const client = new Discord.Client();
const readline = require('readline');
const {google} = require('googleapis');

const { promisify } = require("util");
const readdir = promisify(require("fs").readdir);
const Enmap = require("enmap");

client.config = require("./config.js"); // config file
require("./modules/functions.js")(client); // functions file
client.commands = new Enmap();
client.aliases = new Enmap();
client.settings = new Enmap({name: "settings"});
client.logger = require("./modules/Logger.js");

const Database = require('better-sqlite3');
let db = new Database("./data/botdatabase.db");

const moment = require('moment');

const badWords = require('bad-words');
const badFilter = new badWords();

const schedule = require('node-schedule');

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
			
			INSERT INTO tournamentusers (id, tagproname, position, mic, ping, pstatus) VALUES
			("0ABCDEF", "test", "Both", "Yes", 50, 0)
			;
			`;
        db.exec(sqlInit);
    }

    client.getTournamentUser = db.prepare("SELECT * FROM tournamentusers WHERE id = ?;");
    client.setTournamentUser = db.prepare("INSERT OR REPLACE INTO tournamentusers (id, tagproname, position, mic, ping, pstatus) VALUES (@id, @tagproname, @position, @mic, @ping, @pstatus);");
	client.logger.log("Tournament user db functions loaded.");
	
	client.getLoungeAdmin = db.prepare("SELECT * FROM lounges WHERE id = ?;");
    client.setLoungeAdmin = db.prepare("INSERT OR REPLACE INTO lounges (id, adminid) VALUES (@id, @adminid);");
	client.deleteLoungeAdmin = db.prepare("DELETE FROM lounges WHERE id = ?;");
	client.checkLoungeAdmin = db.prepare("SELECT * FROM lounges WHERE adminid = ?;");
	client.logger.log("lounge admin db functions loaded.");
	
	client.getScrimList = db.prepare("SELECT * FROM scrimlist ORDER BY nametype ASC, name ASC;");
	client.getScrimPlayer = db.prepare("SELECT * FROM scrimlist WHERE id = ?;");
	client.setScrimPlayer = db.prepare("INSERT OR REPLACE INTO scrimlist (id, name, nametype) VALUES (@id, @name, @nametype);");
	client.deleteScrimPlayer = db.prepare("DELETE FROM scrimlist WHERE id = ?;");
	client.clearScrimlist = db.prepare("DELETE FROM scrimlist;");
	let resetScrimList = schedule.scheduleJob('0 0 5 * * *', function(){
		// clear scrim list at 5 AM local time
		client.clearScrimlist.run();
		client.logger.log("scrim list db cleared.");
	});
	client.logger.log("scrimlist db functions loaded.");
	
	client.getTime = () => {return moment().format()};
	badFilter.addWords(...client.config.addBadWords);
	badFilter.removeWords(...client.config.removeBadWords);
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

    // End top-level async/await function.
};

init();