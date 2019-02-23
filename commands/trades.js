// The trades command starts a trade period for tournament captains

exports.run = async (client, message, args, level) => {
    let rawDraftData = client.botText.getTextStatus.get("DraftBoardSetup");
    let capOrder;
    if (rawDraftData && rawDraftData.status) {
        let parseData = JSON.parse(rawDraftData.status);
        capOrder = parseData[0];
    }
    for (let i = 1; i < parseData[0].length; i++) {
        let captainData = client.tournaments.getLowerUser.get(capOrder[i].toLowerCase());
        let currentCaptain = message.guild.members.get(captainData.id);
        await currentCaptain.send(`Hey ${captainData.tagproname}, the draft is about to start! Your current pick number is ${i}. You have approximately two minutes to negotiate any trades before the draft starts! Contact the hosting commissioner if you have a trade. (Not me, I don't know what trades are yet sorry.)`);
    }
};

exports.conf = {
    enabled: true,
    guildOnly: true,
    aliases: [],
    permLevel: "Bot Owner"
};

exports.help = {
    name: "trades",
    category: "Tournaments",
    description: "Prepare tournament draft",
    usage: "trades"
};