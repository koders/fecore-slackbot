const { WebClient } = require('@slack/client');

const token = process.env.token;
const web = new WebClient(token);


let currentTrueDefective = "";

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

        if (payload.event && type === "app_mention") {
            if (text.includes("help")) {
                console.log("help received!");
                await web.chat.postMessage({ channel, text:
                    `Here's how I can help you:
                        - @bot 123: does nothing...` });
            }

            if (text.includes("td set")) {
                console.log(payload);
                const taggedUser = text.slice(text.indexOf("set") + 4);
                if (!taggedUser) {
                    await web.chat.postMessage({ channel, text:
                        "You have to tag a user to set him as a true defective person" });  
                }
            }
        }
    } catch (e) {
        console.error("Error occurred processing bot query:", e);
    }
};
