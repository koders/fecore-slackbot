const slackApi = require("../api/slack");
const Hang = require("../models/hang");
const formatDateAndTime = require("../utils").formatDateAndTime;
const CronJob = require('cron').CronJob;

module.exports = async (payload) => {
    const { channel, text, user } = payload.event;
    const commands = text.split(" ");
    const hangedUser = commands[2];

    if (commands[1] === "unhang") {
        return unhang(payload);
    }

    if (hangedUser === "list") {
        const listForUser = commands[3];
        return listForUser ? await getListForUser(listForUser, channel) : await getList(channel);
    } else if (!hangedUser.startsWith("<@")) {
        return await slackApi.postOnlyVisibleToUser(channel, "That's not a valid Slack user, you can't hang him.", user);
    } else {
        return await hang(commands, hangedUser, user, channel);
    }
};

const hang = async (commands, hangedUser, hangedBy, channel) => {
    const reason = commands.slice(3).join(" ");
    const hang = new Hang({name: hangedUser, date: Date.now(), reason, hanger: `<@${hangedBy}>`});
    await hang.save();
    return await slackApi.postMessage(channel, hangedUser + " got hanged " + (reason || "for nothing :dunno:"));
}

const getList = async (channel) => {
    const userHangs = await getThisMonthsHangedUsers();
    const message = userHangs.map(current => {
            return `${current.name}: ${current.count}\n`;
        });
    return await slackApi.postMessage(channel, "Total hangs for current month:\n" + message.join(""));
}

const getListForUser = async (user, channel) => {
    const date = new Date();
    const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
    const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    const hangs = await Hang.find({
        name: user,
        date: {
            $gte: firstDay,
            $lte: lastDay,
        }
    });

    if (hangs.length === 0) {
        return await slackApi.postMessage(channel, user + "hasn't been hanged yet! :notbad:");
    }

    const message = "Hangs for " + user + "\n" + hangs.reduce((reducer, hang, index) => {
        return reducer + `${index + 1}. *${hang.reason ? hang.reason : "No reason"}* by ${hang.hanger} @ ${formatDateAndTime(hang.date)}\n`
    }, "");
    return await slackApi.postMessage(channel, message);
}

const unhang = async (payload) => {
    const { channel, text, user } = payload.event;
    const commands = text.split(" ");
    const hangedUser = commands[2];

    if (!hangedUser) {
        return;
    }
    const last = await Hang.findOne({name: hangedUser}).sort({ _id: -1 });
    if (last) {
        last.delete();
    }
    return await slackApi.postMessage(channel, `<@${user}> unhanged ${hangedUser}`);
}

const getThisMonthsHangedUsers = async () => {
    const date = new Date();
    const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
    const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    const names = await Hang.distinct("name");
    const list = names.map(async name => {
        const count = await Hang.countDocuments({
            name: name,
            date: {
                $gte: firstDay,
                $lte: lastDay,
            }
        });
        return {
            name,
            count,
        }
    });
    const userHangs = await Promise.all(list);
    return userHangs.sort((a, b) => b.count - a.count);
}

const getMonthlyReport = async (channel) => {
    const userHangs = await getThisMonthsHangedUsers();
    const doucheOfTheMonth = userHangs.shift();
    const message =
`This months hang game results are in.
Douche of the month: ${doucheOfTheMonth.name}. Hanged ${doucheOfTheMonth.count} times. :shame:
Results for the rest who got hanged: 
${userHangs.map(current => `${current.name}: ${current.count}\n`).join("")}`;
// And of course, our winner - ${winner.name}. ${winner.count ? `Only hanged ${winner.count} times` : "Never got hanged"}!
// :party: :party: :party: :party: :party:`;

    return await slackApi.postMessage(channel, message);
}

const privateChannelId = process.env.fartingElephant;

// First weekday of the month @10:50
new CronJob('50 10 1-3 * *', async function() {
    const now = new Date();
    if (now.getDay() === 1) {
        await getMonthlyReport(privateChannelId);
    }
}, null, true, 'Europe/Riga');

new CronJob('50 10 1 * *', async function() {
    const now = new Date();
    if (now.getDay() > 1 && now.getDay() <= 5) {
        await getMonthlyReport(privateChannelId);
    }
}, null, true, 'Europe/Riga');