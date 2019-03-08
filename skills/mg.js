const slackApi = require("../api/slack");
const MiniGroomingRequest = require("../models/minigroomingrequest");
const MiniGrooming = require("../models/minigrooming");
const formatDateAndTime = require("../utils").formatDateAndTime;
const CronJob = require('cron').CronJob;

// mg request "reason"
// mg status || mg
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
            return await slackApi.postOnlyVisibleToUser(channel, "You have to provide a reason for mini grooming.", user);  
        }
    }
    if (commands[2] === "urgent") {
        const reason = commands.slice(3).join(" ");
        if (reason) {
            return await slackApi.postMessage(channel, `<!here> Urgent mini-grooming requested by <@${user}>. Reason: ${reason}`);
        } else {
            return await slackApi.postOnlyVisibleToUser(channel, "You have to provide a reason to request an urgent mini grooming.", user);  
        }
    }

    if (!commands[2] || commands[2] === "status") {
        return await postInfoAboutNextMiniGrooming(channel);
    }
};

const postInfoAboutNextMiniGrooming = async (channel) => {
    if (!channel) {
        return;
    }
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

const setNextMiniGrooming = async () => {
    const lastMiniGrooming = await MiniGrooming.findOne().sort({ date: -1 });
    const lastMiniGroomingDate = lastMiniGrooming.date;
    let nextMiniGroomingDate = new Date();
    if (lastMiniGroomingDate.getDay() === 2) {
        nextMiniGroomingDate = lastMiniGroomingDate.setDate(lastMiniGroomingDate.getDate() + 2);
    } else {
        nextMiniGroomingDate = lastMiniGroomingDate.setDate(lastMiniGroomingDate.getDate() + 5);
    }
    const newMiniGroomingRequest = new MiniGrooming({
        date: nextMiniGroomingDate,
        happenning: false,
    });
    return await newMiniGroomingRequest.save();
}

const privateChannelId = process.env.fartingElephant;

// Every Tue 11:15
new CronJob('15 11 * * 2', async function() {
    try {
        await setNextMiniGrooming();
        await postInfoAboutNextMiniGrooming(privateChannelId);
    } catch (e) {
        console.error("Error executing Tuesdays Mini-grooming cron: ", e);
    }
}, null, true, 'Europe/Riga');

// Every Thu 11:15
new CronJob('15 11 * * 4', async function() {
    try {
        await setNextMiniGrooming();
        await postInfoAboutNextMiniGrooming(privateChannelId);
    } catch (e) {
        console.error("Error executing Thursdays Mini-grooming cron: ", e);
    }
}, null, true, 'Europe/Riga');