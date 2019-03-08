const slackApi = require("../api/slack");

module.exports = async (payload) => {
    const { channel } = payload.event;
    const commands = [
        {title: "help", description: "Show help"},
        {title: "td get", description: "Show current true defective"},
        {title: "td set @user", description: "Set new true defective"},
        {title: "joke [category]", description: "Brighten day"},
        {title: "joke categories", description: "Joke list"},
        {title: "hang list [@user]", description: "Show list of hanged people or hang reasons for a single user"},
        {title: "hang @user [reason]", description: "Hangs user"},
        {title: "unhang @user", description: "Removes last hang for user"},
        {title: "mg", description: "Show status of next grooming"},
        {title: "mg request reason", description: "Request next grooming"},
        {title: "mg urgent reason", description: "Request urgent grooming, to be right now"},
    ];
    const message = commands.map(command => `*${command.title}* | ${command.description}\n`);
    return await slackApi.postMessage(channel, "This is the stuff I know:\n" + message.join(""));
};
