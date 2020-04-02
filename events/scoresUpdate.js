/**
* The scoresUpdate event gets live scores from a spreadsheet and puts it into the corresponding channel 
* @param {client} client - client object for the bot
*/

module.exports = async function (client) {
    // call the get data function
    client.gApps.getSheetsData("sheet_id_for_export","RawExport!I19:J19",client,client.gApps.oAuth2Client);
    // wait for data to be retrieved
    await client.wait(10000);
    // parse data
    let gameData = JSON.parse(client.botText.getTextStatus.get("sheet_id_for_exportRawExport!I19:J19").status);
    // get channel to paste data into
    let mltpChannel = client.guilds.first().channels.find(c => c.name === "mltp-general");
    // clean the data so it does new line properly
    gameData[0][0] = gameData[0][0].replace(/217253/g,"\n");
    // set channel topic
    await mltpChannel.setTopic(gameData[0][0]).catch(console.error);
};