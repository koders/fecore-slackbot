const slackApi = require("../api/slack");
const Review = require("../models/review");

module.exports = async (payload) => {
    if (payload.type === "interactive_message") {
        return postResponse(payload);
    }
    const { user, text, ts, channel } = payload.event;

    const commands = text.split(" ");
    const link = commands[2];
    const comments = commands.slice(3).join(" ") || "";

    const review = new Review({user, link, comments});
    review.save();

    return await slackApi.postInteractiveMessage(
        process.env.fartingElephant,
        `<@${user}> just posted a new merge request ${link} ${comments}`,
        [
            {
                // text: "Choose a game to play",
                fallback: "You are unable to review",
                callback_id: `{
                    "type": "review",
                    "channel": "${channel}",
                    "ts": "${ts}"
                }`,
                "color": "#000000",
                "attachment_type": "default",
                "actions": [
                    {
                        "name": "approve",
                        "text": ":thumbsup:",
                        "type": "button",
                        "value": ":thumbsup:"
                    },
                    {
                        "name": "disapprove",
                        "text": ":thumbsdown:",
                        "type": "button",
                        "value": ":thumbsdown:"
                    },
                    {
                        "name": "comment",
                        "text": ":comment:",
                        "type": "button",
                        "value": ":comment:"
                    },
                ]
            }
        ]
    );
};

const postResponse = async (payload) => {
    const { callback_id, actions } = payload;
    const parsedCallback = JSON.parse(callback_id);
    return await slackApi.replyToMessage(parsedCallback.channel, actions[0].value, parsedCallback.ts);
}
