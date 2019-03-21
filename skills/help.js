const slackApi = require("../api/slack");

module.exports = async (payload) => {
    const { channel, user } = payload.event;
    const commands = [
        {title: "help", description: "Show help"},
        {title: "td", description: "Show current true defective"},
        {title: "td set @user", description: "Set new true defective"},
        {title: "joke [$category]", description: "Brighten day"},
        {title: "joke categories", description: "Joke list"},
        {title: "hang list [@user]", description: "Show list of hanged people or hang reasons for a single user"},
        {title: "hang @users [$reason]", description: "Hangs user or multiple users"},
        {title: "unhang @user", description: "Removes last hang for user"},
        {title: "mg", description: "Show status of next grooming"},
        {title: "mg request $reason", description: "Request next grooming"},
        {title: "mg urgent $reason", description: "Request urgent grooming, to be right now"},
        {title: "wfh description", description: "Request work from home, has to include date and reason in description. Sends message to reporting manager."},
        {title: "review $link [$comment]", description: "Add merge request to be reviewed"},
        {title: "suggest $improvement", description: "Add suggestion what needs to be improved for Chuck"},
        {title: "spin $users", description: "Choose a random user from the list"},
    ];
    const message = commands.map(command => `*${command.title}* | ${command.description}\n`);
    return await slackApi.postOnlyVisibleToUser(channel, "This is the stuff I know:\n" + message.join(""), user);
};
