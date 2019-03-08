const slackApi = require("../api/slack");
const Hang = require("../models/hang");
const formatDateAndTime = require("../utils").formatDateAndTime;

module.exports = async (payload) => {
    const { channel, text, user } = payload.event;
    const commands = text.split(" ");
    const hangedUser = commands[2];

    if (commands[1] === "unhang") {
        return unhang(payload);
    }

    if (hangedUser === "list") {
        const listForUser = commands[3];
        return listForUser ? getListForUser(listForUser, channel) : getList(channel);
    } else {
        hang(commands, hangedUser, user, channel);
    }
};

const hang = async (commands, hangedUser, hangedBy, channel) => {
    const reason = commands.slice(3).join(" ");
    const hang = new Hang({name: hangedUser, date: Date.now(), reason, hanger: `<@${hangedBy}>`});
    await hang.save();
    return await slackApi.postMessage(channel, hangedUser + " got hanged " + (reason || "nothing :dunno:"));
}

const getList = async (channel) => {
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
    const message = await Promise.all(list).then(items => {
        return items.map(current => {
            return `${current.name}: ${current.count}\n`;
        });
    });
    return await slackApi.postMessage(channel, "Total hangs:\n" + message);
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
    const message = hangs.reduce((reducer, hang, index) => {
        return reducer + `${index + 1}. *${hang.reason}* by ${hang.hanger} @ ${formatDateAndTime(hang.date)}\n`
    }, "");
    return await slackApi.postMessage(channel, "Hangs for " + user + "\n" + message);
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