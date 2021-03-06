const slackApi = require("../api/slack");
const Defective = require("../models/defective");
const formatDateAndTime = require("../utils").formatDateAndTime;

module.exports = async (payload) => {
    const { channel, text } = payload.event;
    const commands = text.split(" ");
    if (commands[2] === "set") {
        const taggedUser = commands[3];
        if (taggedUser) {
            const defective = new Defective({name: taggedUser, date: Date.now()});
            await defective.save();
            return await slackApi.postMessage(channel, taggedUser + " is now our true defective!");
        } else {
            return await slackApi.postMessage(channel, "You have to tag a user to set him as a true defective person.");  
        }
    }

    if (!commands[2] || commands[2] === "get") {
        const currentTrueDefective = await Defective.findOne().sort({ date: -1 });
        const message = currentTrueDefective
            ? "True defective for this sprint is " + currentTrueDefective.name + " since " + formatDateAndTime(currentTrueDefective.date)
            : "No True defective set!";
        return await slackApi.postMessage(channel, message);
    }
};
