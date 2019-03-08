const { WebClient } = require('@slack/client');
const token = process.env.token;
const web = new WebClient(token);

const postMessage = async (channel, text) => 
    await web.chat.postMessage({channel, text});

const replyToMessage = async (channel, text, thread_ts) => 
    await web.chat.postMessage({channel, text, thread_ts });

module.exports = {
    postMessage,
    replyToMessage,
}