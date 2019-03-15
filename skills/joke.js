const axios = require("axios");
const slackApi = require("../api/slack");

// const randomIntros = [
//     "",
//     "",
//     "I've got one for you - ",
//     "You got it, buddy, - ",
//     "Here you go - ",
//     "Catch this - ",
// ];

module.exports = async (payload) => {
    const { channel, text } = payload.event;
    const commands = text.split(" ");
    const category = commands[2];

    if (category === "categories") {
        return getCategories(channel);
    }

    return getJoke(channel, category);
};

const getJoke = async (channel, category) => {
    const categoryLink = category ? `?category=${category}` : "";
    const response = await axios.get("http://api.chucknorris.io/jokes/random" + categoryLink);
    // const randomNumber = Math.floor(Math.random() * (randomIntros.length - 1));
    // const randomIntro = randomIntros[randomNumber];
    return await slackApi.postMessage(channel, response.data.value);
}

const getCategories = async (channel) => {
    const response = await axios.get("https://api.chucknorris.io/jokes/categories");
    console.log("categories", response.data);
    
    return await slackApi.postMessage(channel, "I've got categories like - " + response.data.join(", "));
}