const slackApi = require("../api/slack");

module.exports = async (payload) => {
    const { channel } = payload.event;
    return await slackApi.postMessage(channel, `Here's how I can help you:
            - @bot 123: does nothing...`);
};
