module.exports = (req, res) => {
    if (req.body && req.body.challenge) {
        return res.json({
            "challenge": req.body.challenge,
        });
    }
    return res.status(404);
};
