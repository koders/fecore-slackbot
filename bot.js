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
        if (payload.payload) {
            const parsedPayload = JSON.parse(payload.payload);
            if (parsedPayload && parsedPayload.type === "interactive_message") {
                require("./skills/review")(parsedPayload);
                return;
            }
        }
        
        const { text, type } = payload.event;
        const commands = text.split(" ");
        let mainCommand = commands[1].toLowerCase();
        if (mainCommand === "unhang") {
            mainCommand = "hang";
        } else if (mainCommand === "wfh") {
            mainCommand = "workingFromHome";
        }
        // Bot is mentioned
        if (payload.event && type === "app_mention") {
            require("./skills/" + mainCommand)(payload);
        }
    } catch (e) {
        console.error("Error occurred processing bot query:", e);
        require("./skills/fallback")(payload);   
    }
};