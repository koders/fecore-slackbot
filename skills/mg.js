const slackApi = require("../api/slack");
const MiniGroomingRequest = require("../models/minigroomingrequest");
const MiniGrooming = require("../models/minigrooming");
const formatDateAndTime = require("../utils").formatDateAndTime;

// mg request "reason"
// mg status || mg - lists users and reasons, date and time of upcoming minigrooming. time left
// mg urgent "reason"

module.exports = async (payload) => {
    const { channel, text, user, ts } = payload.event;
    const commands = text.split(" ");
    if (commands[2] === "request") {
        const reason = commands.slice(3).join(" ");
        if (reason) {
            const minigrooming = await MiniGrooming.findOne().sort({ date: -1 });
            minigrooming.happenning = true;
            await minigrooming.save();
            const minigroomingrequest = new MiniGroomingRequest({
                name: `<@${user}>`,
                date: Date.now(),
                reason: reason,
                nextMiniGroomingId: minigrooming._id
            });
            await minigroomingrequest.save();
            return await slackApi.replyToMessage(channel, "Thank you, mini-grooming requested...", ts);
        } else {
            return await slackApi.replyToMessage(channel, "You have to provide a reason for mini grooming.", ts);  
        }
    }
    if (commands[2] === "urgent") {
        const reason = commands.slice(3).join(" ");
        if (reason) {
            return await slackApi.postMessage(channel, `<!here> Urgent mini-grooming requested by <@${user}>. Reason: ${reason}`);
        } else {
            return await slackApi.replyToMessage(channel, "You have to provide a reason to request an urgent mini grooming.", ts);  
        }
    }

    if (!commands[2] || commands[2] === "status") {
        const nextMiniGrooming = await MiniGrooming.findOne().sort({ date: -1 });
        if (nextMiniGrooming.happenning) {
            const requests = await MiniGroomingRequest.find({nextMiniGroomingId: nextMiniGrooming._id});
            const message = "Next mini-grooming: "
                + formatDateAndTime(nextMiniGrooming.date)
                + "\n"
                + requests.reduce((reducer, req, index) => {
                    return reducer + `${index + 1}. *${req.name}:*  ${req.reason}\n`
                }, "");
            return await slackApi.postMessage(channel, message);  
        } else {
            return await slackApi.postMessage(channel, "Nobody has requested mini-grooming yet.");  
        }
    }
};
