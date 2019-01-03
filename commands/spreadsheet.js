// The alert command gives or removes the "TToC Alerts" role from the member

exports.run = (client, message, args, level) => {
    message.channel.send("Here's the spreadsheet: <https://docs.google.com/spreadsheets/d/1Ovc7sI35598CTTyrS5pSFW2V_C_XbXI_vP4LcEQKFIo/edit#gid=1836225865>");
};

exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: ["ss"],
    permLevel: "User"
};

exports.help = {
    name: "spreadsheet",
    category: "Tournaments",
    description: "Gives the current spreadsheet",
    usage: "spreadsheet"
};