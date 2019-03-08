const { WebClient } = require('@slack/client');
const token = process.env.token;
const web = new WebClient(token);

const postMessage = async (channel, text) => 
    await web.chat.postMessage({channel, text});

const replyToMessage = async (channel, text, thread_ts) => 
    await web.chat.postMessage({channel, text, thread_ts });

const postOnlyVisibleToUser = async (channel, text, user) => 
    await web.chat.postEphemeral({channel, text, user });

const sendDM = async (userID, text) => 
    await web.chat.postMessage({channel: userID, text});

const postInteractiveMessage = async (channel, text, attachments) => {
    await web.chat.postMessage({channel, text, attachments});
}

module.exports = {
    postMessage,
    replyToMessage,
    postOnlyVisibleToUser,
    sendDM,
    postInteractiveMessage,
}