const slackApi = require("../api/slack");

module.exports = async (payload) => {
    const { channel } = payload.event;
    return await slackApi.postMessage(channel, `:dafuq:, what did you just write? Get some "help"`);
};
