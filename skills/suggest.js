const slackApi = require("../api/slack");
const Suggestion = require("../models/suggestion");

module.exports = async (payload) => {
    const { channel, text, user } = payload.event;
    const commands = text.split(" ");
    const suggestion = new Suggestion({text:commands.slice(2).join(" "), user, date: Date.now()});
    await suggestion.save()
    await slackApi.postMessage(channel, "Your suggestion has been saved.");
};
