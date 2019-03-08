const slackApi = require("../api/slack");
const formatDateAndTime = require("../utils").formatDateAndTime;

const reportingManager = process.env.reportingManager;

// @Chuck wfh description
module.exports = async (payload) => {
    const { channel, user, text } = payload.event;
    const commands = text.split(" ");
    const description = commands.slice(2).join(" ");

    if (!description) {
        return await slackApi.postOnlyVisibleToUser(channel, "You have to provide a description before asking to work from home...", user);
    }

    const message = `Employee <@${user}> will be working from home: ${description}`;
    return await slackApi.sendDM(reportingManager, message);
};
