const slackApi = require("../api/slack");

module.exports = async (payload) => {
    const { channel, text, user } = payload.event;
    const commands = text.split(" ");
    const users = commands.slice(2);
    if (users.length === 0) {
        return await slackApi.postMessage(channel, "Provide user list");
    }
    const randomPerson = users[Math.floor(Math.random() * users.length)];
    await slackApi.postMessage(channel, randomPerson);
};
