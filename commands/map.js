/**
* The map command returns information about a tagpro map
* @param {string} name/id - the name/id of a map to look up
*/

const Discord = require('discord.js');
const axios = require('axios');

exports.run = async (client, message, args, level) => {
    // return if no arguments were provided
    if (!args || args.length < 1) return await message.reply("\nSorry, you didn't provide enough arguments.\nTry this: !map [name]").catch(console.error);
    // get map name
    let productionMaps = {
        "Birdhouse":"Birdhouse",
        "Box Turtle":"Box_Turtle",
        "Bulldog":"Bulldog",
        "Carrera":"Carrera",
        "Catch-22":"Catch-22",
        "EMERALD":"EMERALD",
        "Gumbo":"Gumbo",
        "Lemon":"Lemon",
        "Marauder":"Marauder",
        "Pilot":"Pilot",
        "Plasma":"Plasma",
        "Reaper":"Reaper",
        "Scorpio":"Scorpio",
        "Sky Dweller":"Sky_Dweller",
        "Sugar Hill":"Sugar_Hill",
        "Swan Song":"Swan_Song",
        "Tehuitzingo":"Tehuitzingo",
        "Tetanic":"Tetanic",
        "Toe Tag":"Toe_Tag",
        "Transilio":"Transilio",
        "Treppenwitz":"Treppenwitz",
        "Ultralight":"Ultralight",
        "Vardo":"Vardo",
        "Vicarious":"Vicarious",
        "Wamble":"Wamble",
        "Whiplash":"Whiplash",
        "Wombo Combo":"Wombo_Combo",
        "45":"45",
        "Aerodent":"Aerodent",
        "Angry Pig":"AngryPig",
        "Apparition":"Apparition",
        "Artichoke":"Artichoke",
        "Atomic":"Atomic",
        "Axis":"Axis",
        "Backdoor":"Backdoor",
        "Baffle":"Baffle",
        "Bigmouth":"Bigmouth",
        "Birch":"Birch",
        "Blobfish":"Blobfish",
        "Blooper":"Blooper",
        "Bombing Run":"bomber",
        "Boombox":"boombox",
        "Brute":"Brute",
        "CFB":"CFB",
        "Cabin":"Cabin",
        "Cactus":"Cactus",
        "Cedar":"Cedar",
        "Center Flag":"centerflag",
        "Choke":"Choke",
        "Citizen":"Citizen",
        "Cloud":"Cloud",
        "Clutch":"clutch",
        "Colors":"colors",
        "Command Center":"CommandCenter",
        "Constriction":"Constriction",
        "Convoy":"Convoy",
        "Cosmic":"Cosmic",
        "Curb":"Curb",
        "DZ4":"DZ4",
        "Danger Zone 3":"DangerZone",
        "Dealer":"Dealer",
        "Draft":"Draft",
        "El Moustachio":"El_Moustachio",
        "Fiend":"Fiend",
        "Floral Mappe":"Floral_Mappe",
        "Frontdoor":"Frontdoor",
        "GamePad":"gamepad",
        "Gamesphere":"Gamesphere",
        "GeoKoala":"teamwork",
        "Goldie":"Goldie",
        "Graphite":"Graphite",
        "Grenadine":"Grenadine",
        "Hexane":"Hexane",
        "Hornswoggle":"Hornswoggle",
        "Hotspot":"Hotspot",
        "Hub":"Hub",
        "Hurricane":"Hurricane2",
        "Hyper Reactor":"HyperReactor",
        "Hyperdrive":"Hyperdrive",
        "IRON":"IRON",
        "Jagged":"Jagged",
        "Jardim":"Jardim",
        "Joji":"Joji",
        "Kite":"Kite",
        "Lights":"Lights",
        "Long Island":"Long_Island",
        "Map Damon":"Map_Damon",
        "Mapache Chief":"Mapache_Chief",
        "Market":"Market",
        "Marrow":"Marrow",
        "Mars Ball Explorer":"WelcomeToMars",
        "Mephisto":"Mephisto",
        "Mighty":"Mighty",
        "Mild High":"Mild_High",
        "Mode 7":"Mode7",
        "Monarch":"Monarch",
        "Mzungu":"Mzungu",
        "Neon":"Neon",
        "Neptune":"Neptune",
        "Nirvana":"Nirvana",
        "Oval":"oval",
        "Pariah":"Pariah",
        "Phenochilus":"Phenochilus",
        "Platypus":"Platypus",
        "Prime":"Prime",
        "Qio":"Qio",
        "Reflex2":"reflex2",
        "Renegade":"Renegade",
        "Ricochet":"ricochet",
        "RocketBalls":"RocketBalls",
        "Rush":"Rush",
        "SNES v2":"snes",
        "Saigon":"Saigon",
        "Sediment":"Sediment",
        "September":"September",
        "Shine":"Shine",
        "Simplicity":"Simplicity",
        "Simulation":"Simulation",
        "Smirk":"Smirk",
        "Solstice":"Solstice",
        "Star":"star",
        "Stare":"Stare",
        "Straight Cache Homie":"Straight_Cache_Homie",
        "SuperDuperStamp":"SuperDuperStamp",
        "Thank You Momofuku Ando":"Thank_You_Momofuku_Ando",
        "Thinking With Portals":"ThinkingWithPortals",
        "Tint":"Tint",
        "Tombolo":"Tombolo",
        "Trebuchet":"Trebuchet",
        "Ultradrive":"Ultradrive",
        "Vagabond":"Vagabond",
        "Veldt":"Veldt",
        "Velocity":"velocity",
        "Volt":"Volt",
        "Whisper":"Whisper",
        "Wormwood":"Wormwood",
        "Wormy":"wormy",
        "101010":"101010",
        "Arboretum":"Arboretum",
        "Arena":"arena",
        "Battery":"battery",
        "Big Vird":"vee2",
        "Birdhouse Mirrored":"Birdhouse_Mirrored",
        "Blast Off":"blastoff",
        "Boostsv2.1":"Boosts",
        "Bounce":"Bounce",
        "Box Turtle Mirrored":"Box_Turtle_Mirrored",
        "Buffalo":"Buffalo",
        "Bulldog Mirrored":"Bulldog_Mirrored",
        "Cache":"Cache",
        "Caravan":"caravan",
        "Carrera Mirrored":"Carrera_Mirrored",
        "Catch-22 Mirrored":"Catch-22_Mirrored",
        "Catch-22 NLTP Edition":"Catch-22_NLTP_Edition",
        "Citadel":"Citadel",
        "Citizen Mirrored":"Citizen_Mirrored",
        "Clash":"Clash",
        "Classico":"Classico",
        "Cloud Mirrored":"Cloud_Mirrored",
        "Constriction Mirrored":"Constriction_Mirrored",
        "Contain Masters":"ContainMasters",
        "Decisis":"Decisis",
        "Del":"Del",
        "Diamond Faces":"Diamond",
        "Duel":"Duel",
        "Dumbell":"fullspeed",
        "EMERALD Mirrored":"EMERALD_Mirrored",
        "Event Horizon":"eventhorizon",
        "Event Horizon 2":"eventhorizon2",
        "Figure 8":"map2-2",
        "Flame":"Flame",
        "Foozball":"Foozball",
        "GateKeeper":"GateKeeper",
        "Glory Hole":"RiskAndReward",
        "Grail of Speed":"GrailOfSpeed",
        "Gumbo Mirrored":"Gumbo_Mirrored",
        "Hockey":"Hockey",
        "Hourglass":"Hourglass",
        "Joji Mirrored":"Joji_Mirrored",
        "Kite Mirrored":"Kite_Mirrored",
        "Lemon Mirrored":"Lemon_Mirrored",
        "Lold":"lold",
        "Marauder Mirrored":"Marauder_Mirrored",
        "Mars Game Mode":"GameMode",
        "Micro":"Micro",
        "Neon Mirrored":"Neon_Mirrored",
        "Open Field Masters":"OFM",
        "Penalties":"Penalties",
        "Pilot 2":"Pilot_2",
        "Pilot Mirrored":"Pilot_Mirrored",
        "Plasma Mirrored":"Plasma_Mirrored",
        "Pokeball":"community1",
        "Push It":"PushIt",
        "Ricochet Mirrored":"ricochet_Mirrored",
        "Rink":"Rink",
        "Scorpio Mirrored":"Scorpio_Mirrored",
        "Shortcut":"shortcut",
        "Simulation Mirrored":"Simulation_Mirrored",
        "Sky Dweller Mirrored":"Sky_Dweller_Mirrored",
        "Snipers3":"snipers3",
        "Speedway":"speedway",
        "Spiders":"spiders",
        "Sugar Hill Mirrored":"Sugar_Hill_Mirrored",
        "Swoop":"swoop",
        "Tehuitzingo Mirrored":"Tehuitzingo_Mirrored",
        "Tetanic Mirrored":"Tetanic_Mirrored",
        "The Holy See":"HolySee",
        "Toe Tag Mirrored":"Toe_Tag_Mirrored",
        "Transilio Mirrored":"Transilio_Mirrored",
        "Treppenwitz Mirrored":"Treppenwitz_Mirrored",
        "Twister":"twister",
        "UKRAINE":"UKRAINE",
        "Ultralight Mirrored":"Ultralight_Mirrored",
        "Vardo Mirrored":"Vardo_Mirrored",
        "Vee":"bird",
        "Vicarious Mirrored":"Vicarious_Mirrored",
        "Volt Mirrored":"Volt_Mirrored",
        "Wamble Mirrored":"Wamble_Mirrored",
        "Whiplash Mirrored":"Whiplash_Mirrored",
        "Whirlwind 2":"whirlwind",
        "Wombo Combo Mirrored":"Wombo_Combo_Mirrored",
        "Zirconium":"Zirconium",
        "gfy":"gfy",
        "yiss 3.2":"yiss 3.2",
        "Haste":"id/67910",
        "Transilio 2020":"id/67148",
        "Worm":"id/68338"
    };
    let productionKey = Object.keys(productionMaps).find(key => key.toLowerCase() === args.join(" ").toLowerCase());
    let testNum = parseInt(args[0]);
    if (productionKey && productionMaps[productionKey].substring(0,3) === "id/") {
        let rawMapId = productionMaps[productionKey].substring(3);
        await axios.get(`http://unfortunate-maps.jukejuice.com/download?type=json&mapid=${rawMapId}`)
        .then(async function (response) {
            const mapEmbed = new Discord.RichEmbed()
                .setTitle(`${response.data.info.name} [id: ${rawMapId}]`)
                .setDescription(`By: ${response.data.info.author}`)
                .setImage(`http://unfortunate-maps.jukejuice.com/static/previews/${rawMapId}.png`)
                .setColor('DARK_GOLD');
            return await message.channel.send(mapEmbed).catch(console.error);
        })
        .catch(async function (error) {
            return await message.channel.send("Sorry, there was an error retrieving that map id.").catch(console.error);
        });
    }
    else if (productionKey) {
        const mapEmbed = new Discord.RichEmbed()
            .setTitle(`${productionKey} [PD]`)
            .setDescription('By: N/A')
            .setImage(`https://static.koalabeast.com/images/maps/${encodeURIComponent(productionMaps[productionKey])}.png`)
            .setColor('DARK_GOLD');
        return await message.channel.send(mapEmbed).catch(console.error);
    }
    else if (args.length == 1 && testNum) {
        await axios.get(`http://unfortunate-maps.jukejuice.com/download?type=json&mapid=${args[0]}`)
        .then(async function (response) {
            const mapEmbed = new Discord.RichEmbed()
                .setTitle(`${response.data.info.name} [id: ${args[0]}]`)
                .setDescription(`By: ${response.data.info.author}`)
                .setImage(`http://unfortunate-maps.jukejuice.com/static/previews/${args[0]}.png`)
                .setColor('DARK_GOLD');
            return await message.channel.send(mapEmbed).catch(console.error);
        })
        .catch(async function (error) {
            return await message.channel.send("Sorry, there was an error retrieving that map id.").catch(console.error);
        });
    }
    else {
        await axios.get(`http://unfortunate-maps.jukejuice.com/search?query=${encodeURIComponent(args.join(" "))}`)
        .then(async function (response) {
            let id = response.data.split('id="map_')[1].split('"')[0];
            let mapName = response.data.split('class="searchable">')[1].split("</a>")[0];
            let mapAuthor = response.data.split('style="word-wrap:break-word;">')[1].split("</a>")[0];
            const exampleEmbed = new Discord.RichEmbed()
                .setTitle(`${mapName} [id: ${id}]`)
                .setDescription('By: '+mapAuthor)
                .setImage(`http://unfortunate-maps.jukejuice.com/static/previews/${id}.png`)
                .setColor('DARK_GOLD');
            return await message.channel.send(exampleEmbed).catch(console.error);
        })
        .catch(async function (error) {
            return await message.channel.send("Sorry, I couldn't find a map with that name.").catch(console.error);
        });
    }
};

exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: [],
    permLevel: "User"
};

exports.help = {
    name: "map",
    category: "tagpro",
    description: "Gets information about a TagPro Map",
    usage: "map [name]"
};