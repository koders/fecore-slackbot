const mongoose = require('mongoose');

const miniGroomingRequest = {
    name: String,
    reason: String,
    date: Date, // date of request or schedule
    nextMiniGroomingId: mongoose.Schema.Types.ObjectId,
}

module.exports = mongoose.model('MiniGroomingRequest', miniGroomingRequest);