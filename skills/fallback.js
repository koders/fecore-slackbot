const slackApi = require("../api/slack");

module.exports = async (payload) => {
    const { channel } = payload.event;
    return await slackApi.postMessage(channel, `I dont get it... :dafuq:`);
};
