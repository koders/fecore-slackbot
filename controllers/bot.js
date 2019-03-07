const { WebClient } = require('@slack/client');
const Defective = require("../models/defective");

const token = process.env.token;
const web = new WebClient(token);

module.exports = async (req, res) => {
    const payload = req.body;
    if (payload && payload.type === "url_verification") {
        return res.json({
            "challenge": payload.challenge,
        });
    }
    // immediately respond to slack that request is received
    res.sendStatus(200);

    try {
        const { text, type, channel } = payload.event;

        // Bot is mentioned
        if (payload.event && type === "app_mention") {
            if (text.includes("help")) {
                console.log("help received!");
                await web.chat.postMessage({ channel, text:
                    `Here's how I can help you:
                        - @bot 123: does nothing...` });
            }

            if (text.includes("td set")) {
                const taggedUser = text.slice(text.indexOf("set") + 4);
                if (taggedUser) {
                    const currentTrueDefective = taggedUser;
                    const defective = new Defective({name: taggedUser, date: Date.now()});
                    await defective.save();
                    return await write(channel, taggedUser + " is now our true defective!");
                } else {
                    return await write(channel, "You have to tag a user to set him as a true defective person.");  
                }
            }

            if (text.includes("td get")) {
                const currentTrueDefective = await Defective.findOne().sort({ date: -1 });

                return await write(channel, "True defective for this sprint is " + currentTrueDefective.name + " since " + currentTrueDefective.date);
            }
        }
    } catch (e) {
        console.error("Error occurred processing bot query:", e);
    }
};

const write = async (channel, text) => {
    return await web.chat.postMessage({ channel, text });
}