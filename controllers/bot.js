const { WebClient } = require('@slack/client');
// An access token (from your Slack app or custom integration - xoxp, xoxb)
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
        if (payload.event && payload.event.type === "app_mention") {
            if (payload.event.text.includes("help")) {
                console.log("help received!");
                await web.chat.postMessage({ channel: payload.event.channel, text:
                    `Here's how I can help you:
                        - @bot 123: does nothing...` });
            }
        }
    } catch (e) {
        console.error("Error occurred processing bot query:", e);
    }
};
