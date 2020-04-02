const axios = require("axios");

module.exports = (client) => {
    
    client.getStreams = axios.create({
      baseURL: 'https://api.twitch.tv/helix/streams',
      timeout: 10000,
      headers: {'Client-ID': client.config.twitchToken}
    });
    
    client.tagproCheck = axios.create({
        baseURL: 'https://tagpro.koalabeast.com/profiles/',
        timeout: 10000
    });
    
}